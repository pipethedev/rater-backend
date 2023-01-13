import Route from '@ioc:Adonis/Core/Route'
import validate from 'App/Helpers'
import { RateSongValidation } from 'App/Validation'

Route.group(() => {4
  // Rating routes

  Route.group(() => {

    Route.post('/rate-song', 'RatingsController.rateSong').middleware(validate(RateSongValidation)).middleware('role:manager')

    Route.put('/rate-song/:songId', 'RatingsController.updateSongRating').middleware(validate({ rating: 'required|in:Good,Bad,Fair', comment: 'string|required' })).middleware('role:manager')

    Route.get('/:songId', 'RatingsController.songRating')

    Route.post('/admin-feedback/:songId', 'RatingsController.adminFeedback').middleware([validate({ comment: "required|string" }), 'role:admin'])

  }).prefix('/rating').middleware(['auth:api', 'banned'])

}).prefix('/api/v1')
