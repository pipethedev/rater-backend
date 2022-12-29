import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AppError } from 'App/Exceptions/Handler'
import { ErrorResponse } from 'App/Helpers'
import RatingService from 'App/Services/RatingService'
import { RateSongBody } from 'App/Types'
import { container } from 'tsyringe'
import Logger from '@ioc:Adonis/Core/Logger'

export default class RatingsController {
    protected ratingService : RatingService = container.resolve(RatingService)
    public async rateSong({ auth, request, response }: HttpContextContract) {
        try {
            const { id } = auth.user! // this is the authenticated user
            const body = request.body() as RateSongBody

            const result = await this.ratingService.rate(id, body)

            return response.ok(result)

        } catch (error) {
            Logger.error(error.message)
            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
            return response.internalServerError(ErrorResponse('Unable to rate song, try again later!'))
        }
    }

    public async allRating({ }: HttpContextContract) {}

    public async updateRating({ }: HttpContextContract) {}
}
