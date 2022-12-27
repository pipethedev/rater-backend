import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    // Pricing routes
    Route.group(() => {
        Route.get('/', 'PricingsController.fetch')

        Route.put('/update', 'PricingsController.update').middleware('role:admin')
    }).prefix('/pricing')
}).prefix('/api/v1')