import { UserService } from '#services/user_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UsersController {
  constructor(
    protected userService: UserService
  ) {}

  public async index({ response }: HttpContext) {
    const users = this.userService.all()

    return response.ok(users)
  }
}