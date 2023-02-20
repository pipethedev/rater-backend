import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import MusicMetric from "App/Models/MusicMetric";

export default class MusicMetricRepository {
    public async create(data: Partial<MusicMetric>, transaction?: TransactionClientContract): Promise<MusicMetric> {
        return await MusicMetric.create(data, { client: transaction });
    }

    public async findBySongId(songId: string): Promise<MusicMetric | null> {
        return await MusicMetric.query().where('song_id', songId).first();
    }

    public async findBySongIdAndWorkerId(songId: string, workerId: string): Promise<MusicMetric | null> {
        return await MusicMetric.query().where({ 'song_id': songId, 'worker_id' : workerId }).first();
    }
}