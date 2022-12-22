import Route from '@ioc:Adonis/Core/Route'
import validate from 'App/Helpers'
import { RegisterValidation,  LoginValidation} from 'App/Validation'

Route.group(() => {
  // Authentication routes
  Route.group(() => {
    Route.post('/login', 'AuthController.login').middleware(validate(LoginValidation))

    Route.post('/register', 'AuthController.register').middleware(validate(RegisterValidation))

    Route.post('/logout', 'AuthController.logout')
  }).prefix('/auth')
}).prefix('/api/v1')
