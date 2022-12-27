import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RatingsController {
    public async rateSong({  }: HttpContextContract) {}

    public async allRating({ }: HttpContextContract) {}

    public async updateRating({ }: HttpContextContract) {}
}
