import { JwtGuardOptions } from '#auth/guards/jwt'
import RefreshToken from '#models/refresh_token'
import User from '#models/user'
import { refreshTokenValidator } from '#validators/access_token'
import { loginValidator } from '#validators/login'
import { createUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'

export default class AuthController {
  #options: JwtGuardOptions

  constructor(options: JwtGuardOptions) {
    this.#options = options
  }

  /**
   * @register
   * @summary Register a new user
   * @requestBody <createUserValidator>
   * @responseBody 201 - User created
   * @returns
   */
  public async register({ request }: HttpContext) {
    const paload = await request.validateUsing(createUserValidator)

    const user = await User.create({
      userName: paload.userName,
      email: paload.email,
      password: paload.password,
      avatarUrl: paload.avatarUrl,
    })

    return user
  }

  /**
   * @login
   * @summary Login a user
   * @requestBody <loginValidator>
   * @responseBody 200 - {"type": "bearer", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3Mzc3ODgyNH0.vsKkzTF2GqoirfMVx-kVFhPv-lhrugl8JwHSmDhFH_g"} - Login successfuly
   */
  public async login({ request, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const { accessToken, refreshToken } = await auth.use('jwt').generateTokens(user)
    // Or const { token } = await auth.use('jwt').generate(user) // without refresh token

    return { accessToken, refreshToken }
  }

  /**
   * @logout
   * @summary Log out an authenticated user
   */
  public async logout({ auth }: HttpContext) {
    await RefreshToken.query().where('user_id', auth.user!.id).update({ is_revoked: true })
  }

  // Extending custom adonisjs 6 auth implementations with refresh token
  /**
   * @refresh
   * @summary Refreshes the access token
   * @requestBody <refreshTokenValidator>
   */
  public async refresh({ request, auth, response }: HttpContext) {
    const { refreshToken } = await request.validateUsing(refreshTokenValidator)

    try {
      const payload = jwt.verify(refreshToken, this.#options.secret)

      if (typeof payload !== 'object' || !('userId' in payload)) {
        return response.unauthorized({ error: 'Invalid refresh token' })
      }

      // const stored =
      await RefreshToken.query()
        .where('token', refreshToken)
        .where('is_revoked', false)
        .firstOrFail()

      const user = await User.findOrFail(payload.userId)

      // Revoke all existing refresh tokens for this user
      await RefreshToken.query().where('user_id', payload.userId).update({ is_revoked: true })

      const { accessToken, refreshToken: newRefreshToken } = await auth
        .use('jwt')
        .generateTokens(user)

      return response.json({ accessToken, refreshToken: newRefreshToken })
    } catch (error) {
      return response.unauthorized(error.message)
    }
  }
}
