import Database, { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import Allocation from "App/Models/Allocation";

export default class AllocationRepository {
    public async create(data: Partial<Allocation>, transaction?: TransactionClientContract): Promise<Allocation> {
        return await Allocation.create(data, { client: transaction });
    }

    public async updateOne(id: string, data: Partial<Allocation>, transaction: TransactionClientContract): Promise<Allocation> {
        return await Allocation.query({ client: transaction }).where('id', id).update(data).first();
    }

    public async findByWorkerId(workerId: string): Promise<Allocation[]> {
        return await Allocation.query().where('worker_id', workerId).preload('song');
    }

    public async findbyWorkerIdAndDate(workerId: string): Promise<Allocation[]> {
        return await Allocation.query().where({ 'worker_id':  workerId, 'pending': false }).andWhere('created_at', '>=', Database.raw('DATE_SUB(NOW(), INTERVAL 1 DAY)'));
    }

    public async findbyWorkerIdAndSongId(workerId: string, songId: string): Promise<Allocation | null> {
        return await Allocation.query().where({ 'song_id': songId, 'pending': false }).andWhere('worker_id', workerId).first();
    }

    public async findLowestCount(): Promise<Allocation | null> {
        return await Allocation.query().where('pending', false).groupBy('worker_id').orderByRaw('count(*) ASC').first();
    }

    public async findPending(transaction?: TransactionClientContract): Promise<Allocation[]> {
        return await Allocation.query({ client: transaction }).where('pending', true);
    }

    public async updatePending(transaction?: TransactionClientContract): Promise<Allocation[]> {
        return await Allocation.query({ client: transaction }).where('pending', true).update({ pending: true });
    }
}