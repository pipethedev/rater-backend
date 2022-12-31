import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse, SuccessResponse } from 'App/Helpers'
import RatingService from 'App/Services/RatingService'
import { RateSongBody, UpdateSongRating } from 'App/Types'
import { container } from 'tsyringe'
import Logger from '@ioc:Adonis/Core/Logger'
import Rating from 'App/Models/Rating'
import AppError from 'App/Helpers/error'

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

    public async songRating({ request, response }: HttpContextContract) {
        try {
            const result = await Rating.query().preload('user').where('song_id', request.param('songId'))

            return response.ok(SuccessResponse("Song rating fetched successfully",result))
        } catch (error) {
            Logger.error(error.message)
            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
            return response.internalServerError(ErrorResponse('Unable to fetch ratings, try again later!'))
        }
    }

    public async updateSongRating({ auth, request, response }: HttpContextContract) {
        try {
            const { id } = auth.user! // this is the authenticated user

            const body = request.body() as UpdateSongRating

            const result = await this.ratingService.update(id, request.param('songId'), body)

            return response.ok(result)

        } catch (error) {
            Logger.error(error.message)
            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
            return response.internalServerError(ErrorResponse('Unable to update song rating, try again later!'))
        }
    }

    public async updateRating({ }: HttpContextContract) {}
}
