import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // User routes
  Route.group(() => {
    Route.post('/upload', 'SongsController.create').middleware('auth:api')

  }).prefix('/song')
}).prefix('/api/v1')
