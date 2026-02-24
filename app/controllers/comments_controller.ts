import Comment from '#models/comment'
import { createCommentValidator, updateCommentValidator } from '#validators/comment'
import type { HttpContext } from '@adonisjs/core/http'

export default class CommentsController {
  /**
   * @index
   * @summary Display a list of resource
   */
  async index({}: HttpContext) {
    const comments = await Comment.query().preload('post')

    return comments
  }

  /**
   * @store
   * @summary Create a new record
   * @requestBody {"content": "Comment content", "postId": 1}
   * @responseBody 201 - Created comment
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createCommentValidator)

    const comment = await Comment.create(payload)

    return comment
  }

  /**
   * @show
   * @summary Show individual record
   * @paramPath commentId @type(string) @required
   * @responseBody 200 - Array of comment
   */
  async show({ params }: HttpContext) {
    const commentId = params.id

    const comment = await Comment.query().where('id', commentId).preload('post')

    return comment
  }

  /**
   * @update
   * @summary Edit individual record
   * @paramPath commentId @type(string) @required
   * @requestBody {"content": "Comment content"}
   * @responseBody 200 - Updated comment
   */
  async update({ params, request }: HttpContext) {
    const commentId = params.id
    const payload = await request.validateUsing(updateCommentValidator)

    const comment = await Comment.findOrFail(commentId)
    comment.merge(payload)

    await comment.save()
    return comment
  }

  /**
   * @destroy
   * @summary Delete comment
   * @paramPath commentId
   * @responseBody 204 - noContent
   */
  async destroy({ params, response }: HttpContext) {
    const commentId = params.id

    const comment = await Comment.findOrFail(commentId)
    await comment.delete()

    return response.noContent()
  }
}