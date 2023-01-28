import Database, { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { Roles } from "App/Enum";
import Env from '@ioc:Adonis/Core/Env'
import Allocation from "App/Models/Allocation";
import AllocationRepository from "App/Repository/AllocationRepository";
import UserRepository from "App/Repository/UserRepository";
import { container, injectable } from "tsyringe";
import { random } from "App/Helpers";
import Logger from '@ioc:Adonis/Core/Logger'
import User from "App/Models/User";
import AppError from "App/Helpers/error";
import { BAD_REQUEST } from "http-status";

@injectable()
export default class AllocationService {
    protected userRepository: UserRepository = container.resolve(UserRepository)
    protected allocationRepository: AllocationRepository = container.resolve(AllocationRepository)

    public async create(songId: string, exceptionWorkerId: string | null = null): Promise<boolean> {
        let workers: User[] = await this.userRepository.all(Roles.MANAGER);

        const midWay = Env.get('MAXIMUM_SONG_ALLOCATION') / 2

        const trx = await Database.transaction()
        try {
            if(exceptionWorkerId || exceptionWorkerId !== null) {
                workers = workers.filter((val) => val.id !== exceptionWorkerId);
            }

            // Pick a random worker
            const randomIndex = random(0, workers.length - 1) as number;

            const workerId = workers[randomIndex].id;

            // Fetch all the song(s) allocated of the user for the past 24 hours
            const allocations = await this.allocationRepository.findbyWorkerIdAndDate(workerId)

            if(allocations.length < Env.get('MAXIMUM_SONG_ALLOCATION')) {
                Logger.info(`Worker #${workers[randomIndex].id} has not exceeded his daily limit`)
        
                // If the number of song(s) allocated is greater than or equal to the mid way which is 5
                allocations.length <= midWay ? await this.allocateWithRandomIndex({ songId, worker_id: workerId }, trx) :  await this.allocateWithLowestValue(songId, trx);

                await trx.commit();

                Logger.info(`completed for #${workerId}`);
            } else{
                await this.allocationRepository.create({ worker_id: workerId, song_id: songId, pending: true }, trx);
            }
        } catch (error) {
            await trx.rollback()

            Logger.error(error.message)
        }
        return true;
    }

    async allocateWithRandomIndex ({ songId, worker_id },trx: TransactionClientContract){

        const check = await this.allocationRepository.findbyWorkerIdAndSongId(worker_id, songId)

        console.log("Iteration")
                        
        if(!check) await this.allocationRepository.create({ worker_id, song_id: songId, pending: false }, trx)
    }

    async allocateWithLowestValue(songId: string, trx: TransactionClientContract) {
        const { worker_id } = await this.allocationRepository.findLowestCount() as Allocation

        const check = await this.allocationRepository.findbyWorkerIdAndSongId(worker_id, songId)
            
        if(!check) await this.allocationRepository.create({ worker_id, song_id: songId, pending: false }, trx)

    }

    public async manualAllocation({ songId, workerId }: { songId: string; workerId: string}) {
        const trx = await Database.transaction()

        try {
            const maxAllocation = Env.get('MAXIMUM_SONG_ALLOCATION');

            const allocations = await this.allocationRepository.findbyWorkerIdAndDate(workerId)

            if(allocations.length == maxAllocation) throw new AppError(BAD_REQUEST, `Worker has exceeded his daily limit of ${maxAllocation} songs`);

            const check = await this.allocationRepository.findbyWorkerIdAndSongId(workerId, songId);

            if(check) throw new AppError(BAD_REQUEST, `Song has already been allocated to worker`);

            const allocation = await this.allocationRepository.create({ worker_id: workerId, song_id: songId, pending: false }, trx);

            await trx.commit();

            Logger.info(`completed for #${workerId}`);

            return allocation;
        } catch (error) {
            await trx.rollback()

            Logger.error(error.message)

            throw error;
        }
    }
}