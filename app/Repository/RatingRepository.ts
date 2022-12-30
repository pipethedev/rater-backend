import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import Rating from "App/Models/Rating";

export default class RatingRepository {
    public async create(data: Partial<Rating>, transaction: TransactionClientContract): Promise<Rating> {
        return await Rating.create(data, { client: transaction });
    }

    public async findByWorkerAndSongId(workerId: string, songId: string): Promise<Rating | null> {
        return await Rating.query().where('song_id', songId).andWhere('worker_id', workerId).preload('user').first();
    }
}