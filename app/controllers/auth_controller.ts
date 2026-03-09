import User from '#models/user'
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
      avatarUrl: paload.avatarUrl
    })

    return user
  } 
}