import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AppError } from 'App/Exceptions/Handler'
import { ErrorResponse } from 'App/Helpers'
import Logger from '@ioc:Adonis/Core/Logger'
import SongService from 'App/Services/SongService'
import { container } from 'tsyringe'
import { UploadSong } from 'App/Types'
import { UNSUPPORTED_MEDIA_TYPE, INTERNAL_SERVER_ERROR } from 'http-status'

export default class SongsController {
    protected songService : SongService = container.resolve(SongService)

    public async create({ auth, request, response }: HttpContextContract){
        try {
            const { id } = auth.user!

            const body = request.body() as UploadSong

            const file = request.file('audio', { size: '10mb', extnames: [ 'mp3', 'ogg', 'wav', 'mp4', 'wma' ] })!

            const result = await this.songService.saveRecord(id, body, file)
            
            return response.ok(result)
          } catch (error) {
            Logger.error(error.message)
            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
            return response.status(error.length > 0 ? UNSUPPORTED_MEDIA_TYPE : INTERNAL_SERVER_ERROR).send(ErrorResponse('We could not upload your song, try again later!', error))
          }
    }

    public async getAllSongs({ }: HttpContextContract){}

    public async fetchSingleSong({ }: HttpContextContract){}

    public async deleteSong({ }: HttpContextContract){}
}
