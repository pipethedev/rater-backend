import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // User routes
  Route.group(() => {
    Route.post('/upload', 'SongsController.create')

    Route.get('/all', 'SongsController.getAllSongs')

    Route.get('/:songId', 'SongsController.fetchSingleSong')

    Route.delete('/:songId', 'SongsController.deleteSong').middleware('role:user')

  }).prefix('/song').middleware(['auth:api', 'banned'])
}).prefix('/api/v1')
