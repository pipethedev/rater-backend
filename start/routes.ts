import Route from '@ioc:Adonis/Core/Route'

import './routes/auth.route'
import './routes/user.route'
import './routes/song.route'
import './routes/pricing.route'
import './routes/rating.route'
import './routes/transaction.route'
import './routes/payment_reference.route'

Route.get('/', async () => {
  return {
    name: 'Rater app API',
    version: '1.0.0',
    author: 'Muritala David Ilerioluwa',
  }
})

Route.get('/api/v1/dashboard/stats', 'StatsController.get').middleware(['auth:api'])

Route.post('/api/v1/paystack-webhook', 'WebhookController.manage').middleware('paystack')
