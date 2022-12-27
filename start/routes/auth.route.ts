import Route from '@ioc:Adonis/Core/Route'
import validate from 'App/Helpers'
import { RegisterValidation, LoginValidation, EmailValidation, ResetPasswordValidation } from 'App/Validation'

Route.group(() => {
  // Authentication routes
  Route.group(() => {
    Route.post('/login', 'AuthController.login').middleware([validate(LoginValidation)])

    Route.post('/register', 'AuthController.register').middleware(validate(RegisterValidation))

    Route.post('/logout', 'AuthController.logout')

    Route.get('/verify-email/:token', 'AuthController.verifyUserEmail').as('verifyEmail')

    Route.put('/reset-password/:token', 'AuthController.resetPassword').middleware(validate(ResetPasswordValidation))

    Route.post('/forgot-password', 'AuthController.forgotPassword').middleware(validate(EmailValidation) )

    Route.post('/resend-verification', 'AuthController.resendVerification').middleware(validate(EmailValidation))
  }).prefix('/auth')
}).prefix('/api/v1')
