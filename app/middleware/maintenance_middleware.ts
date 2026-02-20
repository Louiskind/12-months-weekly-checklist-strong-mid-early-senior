import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'

export default class MaintenanceMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Downstream logic
    // Checks an .env variable to block requests i.e check if maintenance mode is on
    if (env.get('MAINTENANCE_MODE') === 'true') {
      return ctx.response.status(503).send('Site is under maintenance')
    }

    const output = await next()
    // Upstream logic runs here
    return output
  }
}