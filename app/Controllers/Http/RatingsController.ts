import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RatingsController {
    public async rateSong({ request, response }: HttpContextContract) {}

    public async updateRating({ request, response }: HttpContextContract) {}
}
