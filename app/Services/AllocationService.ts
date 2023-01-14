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

@injectable()
export default class AllocationService {
    protected userRepository: UserRepository = container.resolve(UserRepository)
    protected allocationRepository: AllocationRepository = container.resolve(AllocationRepository)

    public async create(songId: string, exceptionWorkerId: string | null = null): Promise<boolean> {
        let workers: User[] = await this.userRepository.all(Roles.MANAGER);
        let allocations: Allocation[];

        const totalWorkers = workers.length;

        const midWay = Env.get('MAXIMUM_SONG_ALLOCATION') / 2

        const trx = await Database.transaction()
        try {
            if(exceptionWorkerId || exceptionWorkerId !== null) {
                workers = await User.query().where('id', exceptionWorkerId);
            }

            console.log(workers);

            for (let key of Object.keys(workers)) {
                // Fetch all the song(s) allocated of the user for the past 24 hours
                allocations = await this.allocationRepository.findbyWorkerIdAndDate(workers[key].id)

                if(allocations.length < Env.get('MAXIMUM_SONG_ALLOCATION')) {
                    Logger.info("This worker has not exceeded his daily limit")
        
                    // If the number of song(s) allocated is greater than or equal to the mid way which is 5
                    if(allocations.length <= midWay) {

                        await this.allocateWithRandomIndex({ songId, workers, allocations, totalWorkers }, exceptionWorkerId, trx);
                        
                    } else {
                        Logger.info("This worker has exceeded his daily limit assigning to another worker")
                        // Use the lowest number of song(s) allocated worker
                        await this.allocateWithLowestValue(exceptionWorkerId, songId, trx);
                    }
                    await trx.commit();
                }else{
                    await this.allocationRepository.create({ worker_id: workers[key].id, song_id: songId, pending: true }, trx);
                }
                
                Logger.info(`completed for ${workers[key].id}`)
            }
        } catch (error) {
            await trx.rollback()
        }
        return true;
    }

    async allocateWithRandomIndex ({ songId, workers, allocations, totalWorkers }, exceptionWorkerId: string | null, trx: TransactionClientContract){
        const randomIndex = random(0, allocations.length === 0 ? 0 : totalWorkers - 1) as number
        const worker_id = workers[randomIndex].id;

        if(worker_id !== exceptionWorkerId) {
            const check = await this.allocationRepository.findbyWorkerIdAndSongId(worker_id, songId)
                        
            if(!check) await this.allocationRepository.create({ worker_id, song_id: songId, pending: false }, trx)
        }else {
            await this.allocateWithRandomIndex({ songId, workers, allocations, totalWorkers }, exceptionWorkerId, trx);
        }
    }

    async allocateWithLowestValue(exceptionWorkerId: string | null, songId: string, trx: TransactionClientContract) {
        const { worker_id } = await this.allocationRepository.findLowestCount() as Allocation

        if(worker_id !== exceptionWorkerId) {
            const check = await this.allocationRepository.findbyWorkerIdAndSongId(worker_id, songId)
            
            if(!check) await this.allocationRepository.create({ worker_id, song_id: songId, pending: false }, trx)
        }
    }
}