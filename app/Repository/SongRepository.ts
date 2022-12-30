import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { RatingLevel } from "App/Enum";
import Song from "App/Models/Song";
import { injectable } from "tsyringe";

@injectable()
export default class SongRepository {
    public async create(data: Partial<Song>, transaction: TransactionClientContract): Promise<Song> {
        return await Song.create(data, { client: transaction });
    }

    public async updateOne(id: string, data: Partial<Song>, transaction: TransactionClientContract): Promise<Song> {
        return await Song.query({ client: transaction }).where('id', id).update(data).first();
    }

    public async findAllByUser(userId: string): Promise<Song[]> {
        return await Song.query().where('user_id', userId).preload('ratings');
    }

    public async findByRating(rating: RatingLevel): Promise<Song[]> {
        return await Song.query().whereHas('ratings', (ratingsQuery) => {
            ratingsQuery.where('rating', rating).preload('user')
        }, '>', 0)
    }

    public async findOneById(songId: string): Promise<Song| null> {
        return await Song.query().where('id', songId ).preload('ratings', (ratingsQuery) => {
            ratingsQuery.preload('user');
        }).first();
    }

    public async findOneByUser(userId: string, songId: string): Promise<Song| null> {
        return await Song.query().where('id', songId ).andWhere('user_id', userId ).preload('ratings', (ratingsQuery) => {
            ratingsQuery.preload('user');
        }).first();
    }

    public async deleteOneByUser(userId: string, songId: string): Promise<any> {
        return await Song.query().where({ id: songId, user_id: userId}).delete();   
    }
}