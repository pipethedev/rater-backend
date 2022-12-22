import Route from '@ioc:Adonis/Core/Route'
import validate from 'App/Helpers'
import { UpdateUserValidation } from 'App/Validation'

Route.group(() => {
  // User routes
  Route.group(() => {
    Route.get('/profile', 'UsersController.me').middleware('auth:api')

    Route.put('/profile', 'UsersController.update').middleware(['auth:api', validate(UpdateUserValidation)])
  }).prefix('/user')
}).prefix('/api/v1')
