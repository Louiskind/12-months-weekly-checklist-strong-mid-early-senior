import RefreshToken from '#models/refresh_token'
import { errors, symbols } from '@adonisjs/auth'
import type { AuthClientResponse, GuardContract } from '@adonisjs/auth/types'
import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'
import { DateTime } from 'luxon'

/**
 * Bridge between the user provider and the guard.
 * Wraps the actual user object with methods the guard needs.
 */
export type JwtGuardUser<RealUser> = {
  getId(): string | number | BigInt
  getOriginal(): RealUser
}

export type JwtGuardOptions = {
  secret: string
}

/**
 * Interface that user providers must implement
 * to work with the JWT guard.
 */
export interface JwtUserProviderContract<RealUser> {
  /**
   * Property for TypeScript to infer the actual user type.
   * Not used at runtime.
   */
  [symbols.PROVIDER_REAL_USER]: RealUser

  /**
   * Create a guard user instance from the actual user object.
   */
  createUserForGuard(user: RealUser): Promise<JwtGuardUser<RealUser>>

  /**
   * Find a user by their ID.
   */
  findById(identifier: string | number | BigInt): Promise<JwtGuardUser<RealUser> | null>
}

export class JwtGuard<UserProvider extends JwtUserProviderContract<unknown>> implements GuardContract<
  UserProvider[typeof symbols.PROVIDER_REAL_USER]
> {
  #ctx: HttpContext
  #userProvider: UserProvider
  #options: JwtGuardOptions

  constructor(ctx: HttpContext, userProvider: UserProvider, options: JwtGuardOptions) {
    this.#ctx = ctx
    this.#userProvider = userProvider
    this.#options = options
  }
  /**
   * Events emitted by this guard. JWT guard doesn't emit events,
   * but the property is required by the interface.
   */
  declare [symbols.GUARD_KNOWN_EVENTS]: {}

  /**
   * Unique identifier for this guard type.
   */
  driverName: 'jwt' = 'jwt'

  /**
   * Whether authentication has been attempted during this request.
   */
  authenticationAttempted: boolean = false

  /**
   * Whether the current request is authenticated.
   */
  isAuthenticated: boolean = false

  /**
   * The authenticated user, if any.
   */
  user?: UserProvider[typeof symbols.PROVIDER_REAL_USER]

  async generate(user: UserProvider[typeof symbols.PROVIDER_REAL_USER]) {
    const providerUser = await this.#userProvider.createUserForGuard(user)

    const token = jwt.sign(
      { userId: providerUser.getId() },
      this.#options.secret,
      { expiresIn: '15m' } // short-lived
    )

    return {
      type: 'bearer',
      token: token,
    }
  }

  // Extending custom adonisjs 6 auth implementations with refresh token
  async generateTokens(user: UserProvider[typeof symbols.PROVIDER_REAL_USER]) {
    const providerUser = await this.#userProvider.createUserForGuard(user)

    const accessToken = jwt.sign({ userId: providerUser.getId() }, this.#options.secret, {
      expiresIn: '15m',
    })

    const refreshToken = jwt.sign({ userId: providerUser.getId() }, this.#options.secret, {
      expiresIn: '7d',
    })

    await RefreshToken.create({
      userId: Number(providerUser.getId()), // force to number
      token: refreshToken,
      expiresAt: DateTime.now().plus({ days: 7 }),
    })


    return { accessToken, refreshToken }
  }

  async authenticate(): Promise<UserProvider[typeof symbols.PROVIDER_REAL_USER]> {
    /**
     * Skip if already authenticated during this request
     */
    if (this.authenticationAttempted) {
      return this.getUserOrFail()
    }
    this.authenticationAttempted = true

    /**
     * Read the authorization header
     */
    const authHeader = this.#ctx.request.header('authorization')
    if (!authHeader) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    /**
     * Extract the token from "Bearer <token>"
     */
    const [, token] = authHeader.split('Bearer ')
    if (!token) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    /**
     * Verify the token and extract the payload
     */
    const payload = jwt.verify(token, this.#options.secret)
    
    if (typeof payload !== 'object' || !('userId' in payload)) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    /**
     * Find the user by ID from the token payload
     */
    const providerUser = await this.#userProvider.findById(payload.userId)
    if (!providerUser) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    /**
     * Store the authenticated user and return
     */
    this.user = providerUser.getOriginal()
    this.isAuthenticated = true
    return this.user
  }

  async check(): Promise<boolean> {
    try {
      await this.authenticate()
      return true
    } catch {
      return false
    }
  }

  getUserOrFail(): UserProvider[typeof symbols.PROVIDER_REAL_USER] {
    if (!this.user) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    return this.user
  }

  async authenticateAsClient(
    user: UserProvider[typeof symbols.PROVIDER_REAL_USER]
  ): Promise<AuthClientResponse> {
    const token = await this.generate(user)

    return {
      headers: {
        authorization: `Bearer ${token.token}`,
      },
    }
  }
}
