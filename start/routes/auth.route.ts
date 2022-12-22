import Route from '@ioc:Adonis/Core/Route'
import validate from 'App/Helpers'
import { RegisterValidation, LoginValidation, ForgotPasswordValidation } from 'App/Validation'

Route.group(() => {
  // Authentication routes
  Route.group(() => {
    Route.post('/login', 'AuthController.login').middleware(validate(LoginValidation))

    Route.post('/register', 'AuthController.register').middleware(validate(RegisterValidation))

    Route.post('/logout', 'AuthController.logout')

    Route.get('/verify-email/:token', 'AuthController.verifyUserEmail').as('verifyEmail')

    Route.post('/resend-verification', 'AuthController.verifyUserEmail').middleware(
      validate(ForgotPasswordValidation)
    )
  }).prefix('/auth')
}).prefix('/api/v1')
