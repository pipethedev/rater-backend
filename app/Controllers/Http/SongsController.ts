import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse, SuccessResponse } from 'App/Helpers'
import Logger from '@ioc:Adonis/Core/Logger'
import SongService from 'App/Services/SongService'
import { container } from 'tsyringe'
import { UNSUPPORTED_MEDIA_TYPE, INTERNAL_SERVER_ERROR } from 'http-status'
import AppError from 'App/Helpers/error'
import { Roles } from 'App/Enum'
import { CreateSongAnalytics, ManualAllocation } from 'App/Types'
import AllocationRepository from 'App/Repository/AllocationRepository'
import AllocationService from 'App/Services/AllocationService'

export default class SongsController {
    protected songService : SongService = container.resolve(SongService)
    protected allocationService: AllocationService = container.resolve(AllocationService)
    protected allocationRepository = container.resolve(AllocationRepository)

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

    public async allocations({ response }: HttpContextContract) {
        try {
            const result = await this.allocationRepository.findAll()

            return response.ok(SuccessResponse(`All songs allocation fetched`, result.map((val) => {
                return {
                    id: val.id,
                    song_id: val.song_id,
                    song: val.song.title,
                    worker:  `${val.worker.first_name} ${val.worker.last_name}`,
                }
            })))
        } catch (error) {
            Logger.error(error.message)

            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))

            return response.status(INTERNAL_SERVER_ERROR).send(ErrorResponse('We could not fetch your allocations, try again later!', error))
        }
    }

    public async allocate({ request, response }: HttpContextContract) {
      try {
        const { songId, workerId } = request.body() as ManualAllocation

        const result = await this.allocationService.manualAllocation({ songId, workerId })

        return response.ok(SuccessResponse(`Song allocated to worker successfully`, result))
      } catch (error) {
        Logger.error(error.message)

        if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
        return response.status(INTERNAL_SERVER_ERROR).send(ErrorResponse('We could not allocate your song, try again later!', error))
      }
    }

    public async getAllSongs({ auth, response }: HttpContextContract){
      try {
        const { id, role } = auth.user!

        const userRole = Object.keys(Roles)[Number(role) - 1]

        const result = await this.songService.fetchSongs(id)
         
        return response.ok(SuccessResponse(`Songs fetched successfully for ${userRole}`, result))
      } catch (error) {
        Logger.error(error.message)
        
        if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))

        return response.status(INTERNAL_SERVER_ERROR).send(ErrorResponse('We could not fetch your songs, try again later!', error))
      }
    }
    
    public async analytics({ auth, request, response }: HttpContextContract){
      try {
        const { id } = auth.user!

        const songId = request.param('songId')

        const result = await this.songService.saveSongAnalytics(songId, id, request.body() as CreateSongAnalytics)
         
        return response.ok(SuccessResponse(`Songs analytics saved successfully`, result))
      } catch (error) {
        Logger.error(error.message)

        if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))

        return response.status(INTERNAL_SERVER_ERROR).send(ErrorResponse('We could not fetch your songs, try again later!', error))
      }
    }

    public async fetchAnalytics({ request, response }: HttpContextContract){
      try {
        const { workerId, songId } = request.params()

        const result = await this.songService.fetchSongAnalytics(songId, workerId)
         
        return response.ok(SuccessResponse(`Songs analytics fetched successfully`, result))
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
