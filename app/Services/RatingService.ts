import { container, injectable } from "tsyringe";
import Database from "@ioc:Adonis/Lucid/Database";
import RatingRepository from "App/Repository/RatingRepository";
import { RateSongBody, UpdateSongRating } from "App/Types";
import { SuccessResponse } from "App/Helpers";
import SongRepository from "App/Repository/SongRepository";
import Song from "App/Models/Song";
import UserRepository from "App/Repository/UserRepository";
import User from "App/Models/User";
import Rating from "App/Models/Rating";
import { AppError } from "App/Exceptions/Handler";
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND } from "http-status";

@injectable()
export default class RatingService {
    protected songRepository: SongRepository = container.resolve(SongRepository)
    protected userRepository: UserRepository = container.resolve(UserRepository)
    protected ratingRepository: RatingRepository = container.resolve(RatingRepository)

    public async rate(workerId: string, body: RateSongBody) {
        const trx = await Database.transaction()
        try {
            const worker = await this.userRepository.findByID(workerId) as User

            const { user_id } = await this.songRepository.findOneById(body.song_id) as Song

            // Check if user has rated the song before
            const ratedSong = await this.ratingRepository.findByWorkerAndSongId(worker.id, body.song_id) as Rating

            if(ratedSong) throw new AppError(BAD_REQUEST, "You have already rated this song")

            const rating = await this.ratingRepository.create({ ...body, worker_id: workerId, user_id }, trx)

            await trx.commit()

            return SuccessResponse("Song rated successfully", rating)
        } catch (error) {
            await trx.rollback()
            throw error;
        }
    }

    public async update(workerId: string, songId: string, body: UpdateSongRating) {
        const trx = await Database.transaction()
        try {
            const worker = await this.userRepository.findByID(workerId) as User

            if(!worker) throw new AppError(BAD_REQUEST, "Unable to rate song")

            const song = await this.songRepository.findOneById(songId) as Song

            if(!song) throw new AppError(NOT_FOUND, "This song does not exist")

            // Check if user has rated the song before
            const ratedSong = await this.ratingRepository.findByWorkerAndSongId(worker.id, songId) as Rating

            if(!ratedSong) throw new AppError(FORBIDDEN, "You don't have the access to update this rating")

            await this.ratingRepository.update(ratedSong.id, ratedSong.song_id, body)

            await trx.commit()

            return SuccessResponse("Song rating updated successfully", null)
        } catch (error) {
            await trx.rollback()
            throw error;
        }
    }
}