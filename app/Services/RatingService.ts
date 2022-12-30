import { container, injectable } from "tsyringe";
import Database from "@ioc:Adonis/Lucid/Database";
import RatingRepository from "App/Repository/RatingRepository";
import { RateSongBody } from "App/Types";
import { SuccessResponse } from "App/Helpers";
import SongRepository from "App/Repository/SongRepository";
import Song from "App/Models/Song";
import UserRepository from "App/Repository/UserRepository";
import User from "App/Models/User";
import { Roles } from "App/Enum";
import Rating from "App/Models/Rating";
import { AppError } from "App/Exceptions/Handler";
import { BAD_REQUEST } from "http-status";

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

            if(worker.role === Roles.ADMIN) {
                // Send a mail to the user about their review
            }

            const rating = await this.ratingRepository.create({ ...body, worker_id: workerId, user_id }, trx)

            await trx.commit()

            return SuccessResponse("Song rated successfully", rating)
        } catch (error) {
            await trx.rollback()
            throw error;
        }
    }
}