import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // User routes
  Route.group(() => {
    Route.post('/upload', 'SongsController.create').middleware('role:user')

    Route.get('/all', 'SongsController.getAllSongs')

    Route.get('/:songId', 'SongsController.fetchSingleSong')

    Route.delete('/:songId', 'SongsController.deleteSong').middleware('role:user')

    Route.get('/download/:songId', 'SongsController.downloadSong').middleware('auth:api')

  }).prefix('/song').middleware(['auth:api', 'banned'])
}).prefix('/api/v1')
