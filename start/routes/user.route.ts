import Route from '@ioc:Adonis/Core/Route'
import validate from 'App/Helpers'
import { UpdateUserValidation, UpdatePasswordValidation, CreateWorker } from 'App/Validation'

Route.group(() => {
  // User routes
  Route.group(() => {
    Route.get('/', 'UsersController.me').middleware('auth:api')

    Route.put('/', 'UsersController.updateProfile').middleware([ 'auth:api',validate(UpdateUserValidation)])

    Route.put('/change-password', 'UsersController.changePassword').middleware(['auth:api', validate(UpdatePasswordValidation) ])

  }).prefix('/user/profile')

  Route.group(() => {

    Route.post('/create-worker', 'UsersController.createWorker').middleware(validate(CreateWorker))

    Route.get('/', 'UsersController.getAllUsers')
  
    Route.put('/:userId', 'UsersController.banUser').middleware([validate({ banned: 'required|boolean' }),'role:admin'])

  }).prefix('/users').middleware(['auth:api', 'role:admin'])

}).prefix('/api/v1')
