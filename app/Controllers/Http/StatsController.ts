import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { RatingLevel, Roles } from 'App/Enum'
import { SuccessResponse, convertToNaria } from 'App/Helpers'
import Rating from 'App/Models/Rating'
import Song from 'App/Models/Song'
import User from 'App/Models/User'

export default class StatsController {
    public async get({ auth, response }: HttpContextContract) {

        let songs, users, revenue, ratings, payments;

        const { id, role } = auth.user!

        switch(role) {
            case Roles.ADMIN:
                songs = (await Song.all()).length
                users = (await User.query()).length
                revenue = await Database.rawQuery('SELECT SUM(amount) as total FROM transactions')
                return response.ok( SuccessResponse("Dashbord stats", { songs, users, revenue: convertToNaria(revenue[0][0].total)}))
            case Roles.MANAGER:
                songs = await Rating.query().where('worker_id', id)
                const good = await Rating.query().where('worker_id', id).where('rating', RatingLevel.Good)
                const fair = await Rating.query().where('worker_id', id).where('rating', RatingLevel.Fair)
                const bad = await Rating.query().where('worker_id', id).where('rating', RatingLevel.Bad)
                return response.ok( SuccessResponse("Dashbord stats", { songs: songs.length, good: good.length, fair: fair.length, bad: bad.length }))
            case Roles.USER:
                songs = (await Song.query().where('user_id', id)).length
                ratings = await Database.rawQuery('SELECT AVG(rating) as avg_rating FROM ratings WHERE user_id = ?', [id])
                payments = await Database.rawQuery('SELECT SUM(amount) as total FROM transactions WHERE user_id = ?', [id])
                return response.ok(SuccessResponse("Dashbord stats", { songs, ratings: Number(ratings[0][0].avg_rating), payments: convertToNaria(payments[0][0].total)}))
            default:
        }
    }
}