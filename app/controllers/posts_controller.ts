// This controller is created with --resource flag
import Post from '#models/post'
import { createPostValidator, updatePostValidator } from '#validators/post'
import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  /**
   * @index
   * @summary Display a list of posts
   * @responseBody 200 - Posts array
   */
  async index({ response }: HttpContext) {
    const posts = await Post.query().preload('comments')

    return response.ok(posts)
  }

  /**
   * @store
   * @summary Create a new post
   * @requestBody {"title": "Post title"}
   * @responseBody 201 - Post created
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createPostValidator)

    const post = await Post.create({
      title: payload.title,
    })

    return post
  }

  /**
   * @show
   * @summary Show individual post
   * @paramPath postId @type(string) @required
   * @responseBody 200 - Post array
   */
  async show({ params }: HttpContext) {
    const postId = params.id

    const post = await Post.query().where('id', postId).preload('comments')

    return post
  }

  /**
   * @update
   * @summary Edit individual post
   * @paramPath postId @type(string) @required
   * @requestBody {"title": "Post title"}
   * @responseBody 200 - Updated post
   */
  async update({ params, request }: HttpContext) {
    const postId = params.id
    const payload = await request.validateUsing(updatePostValidator)

    const post = await Post.findOrFail(postId)

    post.merge({
      title: payload.title ? payload.title : post.title,
    })
    await post.save()

    return post
  }

  /**
   * @destroy
   * @summary Delete post
   * @paramPath postId
   * @responseBody 204 - noContent
   */
  async destroy({ params, response }: HttpContext) {
    const postId = params.id

    const post = await Post.findOrFail(postId)

    await post.delete()
    return response.noContent()
  }
}