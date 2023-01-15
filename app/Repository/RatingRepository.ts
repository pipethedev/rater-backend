import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { RatingLevel } from "App/Enum";
import Rating from "App/Models/Rating";

export default class RatingRepository {
    public async create(data: Partial<Rating>, transaction: TransactionClientContract): Promise<Rating> {
        return await Rating.create(data, { client: transaction });
    }

    public async findByWorkerAndSongId(workerId: string, songId: string): Promise<Rating | null> {
        return await Rating.query().where('song_id', songId).andWhere('worker_id', workerId).preload('worker').first();
    }

    public async findFairSong(songId: string): Promise<Rating[]> {
        return await Rating.query().where({ song_id: songId, rating: RatingLevel.Fair });
    }

    public async updateToAlmostGood(songId: string, transaction?: TransactionClientContract)  {
        return await Rating.query({ client: transaction }).where({ song_id: songId }).update({ rating: RatingLevel.AlmostGood });
    }

    public async update(ratingId: string, songId: string, data: Partial<Rating>)  {
        return await Rating.query().where({ id: ratingId, song_id: songId }).update(data);
    }
}