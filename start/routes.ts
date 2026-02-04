/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
// const UsersController = () => import('#controllers/users_controller')
const RegisterNewsletterSubscriptionController = () => import('#controllers/register_newsletter_subscriptions_controller')
const PostsController = () => import('#controllers/posts_controller')
const CommentsController = () => import('#controllers/comments_controller')
const GroupAttributesController = () => import('#controllers/group_attributes_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// router.group(() => {
//   router.get('/', [UsersController, 'index']) // subpath import
// })
//   .prefix('/user')
router.group(() => {
  router.get('/', '#controllers/users_controller.index') // Magic string lazy loading
})
  .prefix('/users')

router.post('newsletter/subscriptions', [RegisterNewsletterSubscriptionController])

router.group(() => {
  // router.resource('posts', PostsController).apiOnly() // Resourceful route (posts is resource name, 2nd arg is controller ref)
  // apiOnly() remove the edit and create which are usually handled by front end for an API server
  router.resource('posts', PostsController).only(['index', 'store', 'destroy']) // register only specific routes

})

// router.resource('posts.comments', CommentsController)
router.shallowResource('posts.comments', CommentsController) // Shallow routes, cuts off the parents prefixes

router.resource('group-attributes', GroupAttributesController).as('attributes') // Renaming resourcefull routes
