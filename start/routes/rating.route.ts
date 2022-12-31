import Route from '@ioc:Adonis/Core/Route'
import validate from 'App/Helpers'
import { RateSongValidation } from 'App/Validation'

Route.group(() => {
  // Rating routes

  Route.group(() => {

    Route.post('/rate-song', 'RatingsController.rateSong').middleware(validate(RateSongValidation)).middleware('role:manager')

    Route.put('/rate-song/:songId', 'RatingsController.updateSongRating').middleware(validate({ rating: 'required|in:Good,Bad,Fair', comment: 'string|required' })).middleware('role:manager')

    Route.get('/:songId', 'RatingsController.songRating')

  }).prefix('/rating').middleware(['auth:api'])

}).prefix('/api/v1')
