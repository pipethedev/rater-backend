import Route from '@ioc:Adonis/Core/Route'
import validate from 'App/Helpers'
import { RateSongValidation } from 'App/Validation'

Route.group(() => {4
  // Rating routes

  Route.group(() => {

    Route.route('/rate-song/:songId', ['POST', 'PUT'], 'RatingsController.rateSong').middleware([validate(RateSongValidation), 'role:manager'])

    Route.get('/:songId', 'RatingsController.songRating')

    Route.post('/admin-feedback/:songId', 'RatingsController.adminFeedback').middleware([validate({ comment: "required|string" }), 'role:admin'])

    Route.put('/admin-feedback/:songId', 'RatingsController.editAdminFeedback').middleware([validate({ comment: "required|string" }), 'role:admin'])

  }).prefix('/rating').middleware(['auth:api', 'banned'])

}).prefix('/api/v1')
