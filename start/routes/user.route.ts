import Route from '@ioc:Adonis/Core/Route'
import validate from 'App/Helpers'
import { UpdateUserValidation, UpdatePasswordValidation } from 'App/Validation'

Route.group(() => {
  // User routes
  Route.group(() => {
    Route.get('/', 'UsersController.me').middleware('auth:api')

    Route.put('/', 'UsersController.updateProfile').middleware([ 'auth:api',validate(UpdateUserValidation)])

    Route.put('/change-password', 'UsersController.changePassword').middleware(['auth:api', validate(UpdatePasswordValidation) ])

  }).prefix('/user/profile')

  Route.get('/users', 'UsersController.getAllUsers')
}).prefix('/api/v1')
