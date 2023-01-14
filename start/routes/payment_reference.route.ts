import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // Authentication routes
  Route.group(() => {
    Route.get('/payment-references', 'TransactionsController.allPaymentReferences').middleware(['auth:api', 'role:user'])
  }).prefix('/api/v1')

});