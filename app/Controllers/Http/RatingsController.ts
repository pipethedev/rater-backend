import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse, SuccessResponse } from 'App/Helpers'
import RatingService from 'App/Services/RatingService'
import { AdminFeedbackBody, RateSongBody } from 'App/Types'
import { container } from 'tsyringe'
import Logger from '@ioc:Adonis/Core/Logger'
import Rating from 'App/Models/Rating'
import AppError from 'App/Helpers/error'

export default class RatingsController {
    protected ratingService : RatingService = container.resolve(RatingService)
    public async rateSong({ auth, request, response }: HttpContextContract) {
        try {
            const { id } = auth.user! // this is the authenticated user
            const songId = request.param('songId')
            const body = request.body() as RateSongBody

            const method = request.method()

            const result = await this.ratingService.rate(id, method, { ...body, song_id: songId})

            return response.ok(SuccessResponse("Song rated successfully", result))

        } catch (error) {
            console.log(error.response.data.error)
            Logger.error(error.message)
            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
            return response.internalServerError(ErrorResponse('Unable to rate song, try again later!'))
        }
    }

    public async adminFeedback({ auth, request, response }: HttpContextContract) {
        try {
            const { id } = auth.user!

            const body = { song_id: request.param('songId'), comment: request.input('comment') } as AdminFeedbackBody;

            const result = await this.ratingService.adminFeedback(id, body)

            return response.ok(SuccessResponse("Admin feedback provided successfully", result))
        } catch (error) {
            Logger.error(error.message)
            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
            return response.internalServerError(ErrorResponse('Unable to create feedback on song, try again later!'))
        }
    }

    public async editAdminFeedback({ auth, request, response }: HttpContextContract) {
        try {
            const { id } = auth.user!

            const body = { song_id: request.param('songId'), comment: request.input('comment') } as AdminFeedbackBody;

            const result = await this.ratingService.editAdminFeedback(id, body)

            return response.ok(SuccessResponse("Admin feedback edited successfully", result))
        } catch (error) {
            Logger.error(error.message)
            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
            return response.internalServerError(ErrorResponse('Unable to create feedback on song, try again later!'))
        }
    }

    public async songRating({ request, response }: HttpContextContract) {
        try {
            const result = await Rating.query().preload('worker').where('song_id', request.param('songId'))

            return response.ok(SuccessResponse("Song rating fetched successfully",result))
        } catch (error) {
            Logger.error(error.message)
            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
            return response.internalServerError(ErrorResponse('Unable to fetch ratings, try again later!'))
        }
    }
}
