import { container, injectable } from "tsyringe";
import Database from "@ioc:Adonis/Lucid/Database";
import RatingRepository from "App/Repository/RatingRepository";
import { RateSongBody } from "App/Types";
import { SuccessResponse } from "App/Helpers";
import SongRepository from "App/Repository/SongRepository";
import Song from "App/Models/Song";

@injectable()
export default class RatingService {
    protected songRepository: SongRepository = container.resolve(SongRepository)
    protected ratingRepository: RatingRepository = container.resolve(RatingRepository)

    public async rate(workerId: string, body: RateSongBody) {
        const trx = await Database.transaction()
        try {
            const { user_id } = await this.songRepository.findOneById(body.song_id) as Song

            const rating = await this.ratingRepository.create({ ...body, worker_id: workerId, user_id }, trx)

            await trx.commit()

            return SuccessResponse("Song rated successfully", rating)
        } catch (error) {
            await trx.rollback()
            throw error;
        }
    }
}