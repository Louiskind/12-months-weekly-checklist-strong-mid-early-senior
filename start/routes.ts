/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')
const PostsController = () => import('#controllers/posts_controller')
const CommentsController = () => import('#controllers/comments_controller')

router.get('/', async () => {
  return { hello: 'world' }
})

/**
 * Authentication routes
 */
router
  .group(() => {
    router.post('register', '#controllers/auth_controller.register')
    router.post('login', '#controllers/auth_controller.login')
    router.post('logout', '#controllers/auth_controller.logout').use(middleware.auth())
    router.post('refresh', '#controllers/auth_controller.refresh')
  })
  .prefix('api/auth')

/**
 * User routes
 */
router
  .group(() => {
    router.get('/', '#controllers/users_controller.index')
    router.get('/:id', [UsersController, 'show'])
    router.post('/', '#controllers/users_controller.store')
    router.put('/:id', [UsersController, 'update'])
    router.delete('/:id', '#controllers/users_controller.destroy')
  })
  .prefix('/users')

/**
 * Posts routes (protected)
 */
router
  .group(() => {
    router.resource('posts', PostsController).only(['index', 'store', 'update', 'destroy'])
  })
  .use(middleware.auth())

/**
 * Comments routes
 */
router.resource('comments', CommentsController).apiOnly()

/**
 * Swagger docs
 */
router.get('swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('docs', async () => {
  return AutoSwagger.default.ui('swagger')
})
