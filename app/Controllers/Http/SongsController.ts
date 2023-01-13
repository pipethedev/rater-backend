import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse } from 'App/Helpers'
import Logger from '@ioc:Adonis/Core/Logger'
import SongService from 'App/Services/SongService'
import { container } from 'tsyringe'
import { UNSUPPORTED_MEDIA_TYPE, INTERNAL_SERVER_ERROR } from 'http-status'
import AppError from 'App/Helpers/error'

export default class SongsController {
    protected songService : SongService = container.resolve(SongService)

    public async create({ auth, request, response }: HttpContextContract){
        try {
            const { id } = auth.user!

            const result = await this.songService.saveRecord(id, { request })
            
            return response.ok(result)
          } catch (error) {
            Logger.error(error.message)
            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
            return response.status(error.length > 0 ? UNSUPPORTED_MEDIA_TYPE : INTERNAL_SERVER_ERROR).send(ErrorResponse(error.message, error))
          }
    }

    public async getAllSongs({ auth, response }: HttpContextContract){
      try {
        const { id } = auth.user!

        const result = await this.songService.fetchSongs(id)
         
        return response.ok(result)
      } catch (error) {
        Logger.error(error.message)
        if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
        return response.status(INTERNAL_SERVER_ERROR).send(ErrorResponse('We could not fetch your songs, try again later!', error))
      }
    }

    public async fetchSingleSong({ auth, request, response }: HttpContextContract){
      try {

        const { id } = auth.user!

        const result = await this.songService.fetchSingleSong(id, request.param('songId'))

        return response.ok(result)
        
      } catch (error) {
        Logger.error(error.message)
        if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
        return response.status(INTERNAL_SERVER_ERROR).send(ErrorResponse('We could not fetch your song, try again later!', error))
      }
    }

    public async downloadSong({ request, response }: HttpContextContract){
      try {
        const result = await this.songService.download(request.param('songId'), { response })

        return response.stream(result)
        
      } catch (error) {
        Logger.error(error.message)
        if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
        return response.status(INTERNAL_SERVER_ERROR).send(ErrorResponse('We could not delete your song, try again later!', error))
      }
    }

    public async deleteSong({ auth, request, response }: HttpContextContract){
      try {

        const { id } = auth.user!

        const result = await this.songService.deleteSong(id, request.param('songId'))

        return response.ok(result)
        
      } catch (error) {
        Logger.error(error.message)
        if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
        return response.status(INTERNAL_SERVER_ERROR).send(ErrorResponse('We could not delete your song, try again later!', error))
      }
    }
}
