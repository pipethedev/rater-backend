import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // Authentication routes
  Route.group(() => {
    Route.post('/references', 'TransactionsController.allPaymentReferences')
  }).prefix('/api/v1')

});