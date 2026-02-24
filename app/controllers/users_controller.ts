import { UserService } from '#services/user_service'
import { createUserValidator, updateUserValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UsersController {
  constructor(
    protected userService: UserService
  ) {}

  /**
   * @store
   * @description Create user
   * @requestBody {"username":"Lorem", "email":"lorem@gmail.com", "password":"123"}
   *  
   */
  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    try {
      const createdUser = await this.userService.createUser(payload)

      return response.ok(createdUser)
    } catch (error) {
      console.error(`UsersController, Failed to create user: ${error}`)

      return response.internalServerError({
        message: error.message
      })
    }
  }

  public async index({ response }: HttpContext) {
    try {
      const users = await this.userService.fetchUsers()

      return response.ok(users)
    } catch (error) {
      console.error('UsersController, Failed to fetch users: ', error)
      
      return response.internalServerError({
        message: error.message
      })
    }
  }

  public async show({ request, response }: HttpContext) {
    const userId = request.param('id')

    try {
      const user = await this.userService.fetchUser(userId)

      return response.ok(user)
    } catch (error) {
      console.error(`UsersController, Failed to find user with id ${userId}: ${error}`)

      return response.notFound({
        message: error.message
      })
    }
  }

  public async update({ request, response }: HttpContext) {
    const userId = request.param('id')
    const payload = await request.validateUsing(updateUserValidator)

    try {
      const updatedUser = await this.userService.updateUser(payload, userId)

      return response.ok(updatedUser)
    } catch (error) {
      console.error(`UsersController, Failed to update user with id: ${userId}: ${error}`)

      return response.notFound({
        message: error.message
      })
    }
  }

  public async destroy({ request, response }: HttpContext) {
    const userId = request.param('id')

    try {
      await this.userService.deleteUser(userId)

      return response.noContent()
    } catch (error) {
      console.error(`UsersController, Failed to delete user with id: ${userId}: ${error}`)

      return response.notFound({
        message: error.message
      })
    }
  }
}