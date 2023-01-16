import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import AdminFeedback from "App/Models/AdminFeedback";

export default class AdminFeedbackRepository {
    public async create(data: Partial<AdminFeedback>, transaction?: TransactionClientContract): Promise<AdminFeedback> {
        return await AdminFeedback.create(data, { client: transaction });
    }

    public async update(id: number, data: Partial<AdminFeedback>, transaction?: TransactionClientContract) {
        return await AdminFeedback.query({ client: transaction }).where('id', id).update(data).first()
    }

    public async findBySongId(songId: string): Promise<AdminFeedback | null> {
        return await AdminFeedback.query().where('song_id', songId).first();
    }
}