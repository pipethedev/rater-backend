import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // User routes
  Route.group(() => {

    Route.get('/all', 'TransactionsController.allTransaction').middleware('role:admin')

    Route.get('/my-transactions', 'TransactionsController.userTransaction').middleware('role:user')

  }).prefix('/transactions').middleware(['auth:api', 'banned'])
}).prefix('/api/v1')
