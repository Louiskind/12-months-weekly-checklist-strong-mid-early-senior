import User from '#models/user'
import { loginValidator } from '#validators/login'
import { createUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  /**
   * @register
   * @summary Register a new user
   * @requestBody {"userName": "John", "email": "john@gmail.com", "password": "12345678", "avatarUrl": "null"}
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

    return await auth.use('jwt').generate(user)
  }
}