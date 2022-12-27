import Route from '@ioc:Adonis/Core/Route'
import validate from 'App/Helpers'

Route.group(() => {
    // Pricing routes
    Route.group(() => {
        Route.get('/', 'PricingsController.fetch')

        Route.put('/update/:priceId', 'PricingsController.update').middleware(['auth:api', 'role:admin', validate({ price: 'required|integer'})])
    }).prefix('/pricing')
}).prefix('/api/v1')