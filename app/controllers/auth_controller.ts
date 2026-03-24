import RefreshToken from '#models/refresh_token'
import User from '#models/user'
import { refreshTokenValidator } from '#validators/access_token'
import { loginValidator } from '#validators/login'
import { createUserValidator } from '#validators/create_user'
import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class AuthController {
  /**
   * @register
   * @summary Register a new user
   * @requestBody <createUserValidator>
   * @responseBody 201 - { "userName": "Lorem Ipsum", "email": "lorem@gmail.com", "avatarUrl": "Lorem Ipsum", "createdAt": "2026-03-24T20:00:07.177+00:00", "updatedAt": "2026-03-24T20:00:07.177+00:00", "id": 2 } - User registed successfully
   * @returns
   */
  public async register({ request }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    const user = await User.create({
      userName: payload.userName,
      email: payload.email,
      password: payload.password,
      avatarUrl: payload.avatarUrl,
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
    const payload = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(payload.email, payload.password)

    const { accessToken, refreshToken } = await auth.use('jwt').generateTokens(user)
    // Or const { token } = await auth.use('jwt').generate(user) // without refresh token

    return { accessToken, refreshToken, user }
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
   * @responseBody 200 - { "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3NDM4Njg4NSwiZXhwIjoxNzc0Mzg3Nzg1fQ.cfr8uxToT20yQrFWuGJ-eCnSatxIiAGsbLjR_X2nYhU", "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3NDM4Njg4NSwiZXhwIjoxNzc0OTkxNjg1fQ.6j2DdBvRlKQ897OnQiqQmNZfUwvHCpLuYIA3iCqj2bk", "user": { "id": 1, "userName": "Lorem Ipsum", "email": "lorem@gmailCom", "avatarUrl": "Lorem Ipsum", "createdAt": "2026-03-24T20:57:11.748+00:00", "updatedAt": "2026-03-24T20:57:11.749+00:00" }} - Refreshed successful
   */
  public async refresh({ request, auth, response }: HttpContext) {
    const { refreshToken } = await request.validateUsing(refreshTokenValidator)
    const secret = env.get('APP_KEY')

    if (!secret) {
      return response.internalServerError({ error: 'Auth secret not configured' })
    }

    try {
      const payload = jwt.verify(refreshToken, secret)

      if (typeof payload !== 'object' || !('userId' in payload)) {
        return response.unauthorized({ error: 'Invalid refresh token' })
      }

      // Check database for revoked status
      await RefreshToken.query()
        .where('token', refreshToken)
        .where('is_revoked', false)
        .firstOrFail()

      const user = await User.findOrFail(payload.userId)

      // Revoke old token
      await RefreshToken.query().where('user_id', payload.userId).update({ is_revoked: true })

      const { accessToken, refreshToken: newRefreshToken } = await auth
        .use('jwt')
        .generateTokens(user)

      return response.json({ accessToken, refreshToken: newRefreshToken, user })
    } catch (error) {
      return response.unauthorized(error.message)
    }
  }
}
