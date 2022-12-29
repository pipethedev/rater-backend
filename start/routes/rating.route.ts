import Route from '@ioc:Adonis/Core/Route'
import validate from 'App/Helpers'
import { RateSongValidation } from 'App/Validation'

Route.group(() => {
  // Rating routes

  Route.group(() => {

    Route.post('/rate-song', 'RatingsController.rateSong').middleware(validate(RateSongValidation))

    Route.get('/:songId', 'RatingsController.songRating')

  }).prefix('/rating').middleware(['auth:api', 'role:manager,admin'])

}).prefix('/api/v1')
