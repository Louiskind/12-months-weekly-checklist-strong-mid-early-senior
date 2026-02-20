import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
// import { Exception } from '@adonisjs/core/exceptions'

export default class UserLocationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    console.log(ctx)
    // Downstream logic
    // throw new Exception('Aborting request')

    /**
     * Call next method in the pipeline and return its output
     */
    await next()

    // Upstream logic
    if (ctx.response.hasContent) {
      console.log(ctx.response.content)
      console.log(typeof ctx.response.content)

      ctx.response.send('newResponse')
    }

    // streaming response
    // if (ctx.response.hasStream) {
    //   ctx.response.outgoingStream.on('data', (chunk) => {
    //     console.log(chunk)
    //   })
    // }

    // Dealing with file downloads
    // if (ctx.response.hasFileToStream) {
    //   console.log(ctx.response.fileToStream.generateEtag)
    //   console.log(ctx.response.fileToStream.path)
    // }
  }
}