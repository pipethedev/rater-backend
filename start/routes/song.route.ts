import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // User routes
  Route.group(() => {
    Route.post('/upload', 'SongsController.create').middleware('auth:api')

    Route.get('/all', 'SongsController.getAllSongs').middleware(['auth:api', 'banned'])

    Route.get('/:songId', 'SongsController.fetchSingleSong').middleware(['auth:api', 'banned'])

    Route.delete('/:songId', 'SongsController.deleteSong').middleware(['auth:api', 'banned'])

  }).prefix('/song')
}).prefix('/api/v1')
