import Database from "@ioc:Adonis/Lucid/Database";
import { Roles } from "App/Enum";
import Env from '@ioc:Adonis/Core/Env'
import Allocation from "App/Models/Allocation";
import AllocationRepository from "App/Repository/AllocationRepository";
import UserRepository from "App/Repository/UserRepository";
import { container, injectable } from "tsyringe";
import { random } from "App/Helpers";
import Logger from '@ioc:Adonis/Core/Logger'

@injectable()
export default class AllocationService {
    protected userRepository: UserRepository = container.resolve(UserRepository)
    protected allocationRepository: AllocationRepository = container.resolve(AllocationRepository)

    public async create(songId: string): Promise<boolean> {
        let worker_id: string;
        let allocations: Allocation[];

        const midWay = Env.get('MAXIMUM_SONG_ALLOCATION') / 2

        const trx = await Database.transaction()
        try {
            const workers = await this.userRepository.all(Roles.MANAGER)

            for (let key of Object.keys(workers)) {
                // Fetch all the song(s) allocated of the user for the past 24 hours
                allocations = await this.allocationRepository.findbyWorkerIdAndDate(workers[key].id)

                if(allocations.length === Env.get('MAXIMUM_SONG_ALLOCATION')) {

                }else if(allocations.length < Env.get('MAXIMUM_SONG_ALLOCATION')) {
                    const randomIndex = random(0, allocations.length === 0 ? 0 : allocations.length - 1) as number
        
                    // If the number of song(s) allocated is greater than or equal to the mid way which is 5
                    if(allocations.length <= midWay) {

                        worker_id = workers[randomIndex].id
            
                        const check = await this.allocationRepository.findbyWorkerIdAndSongId(worker_id, songId)
                        
                        if(!check) await this.allocationRepository.create({ worker_id, song_id: songId }, trx)
        
                    } else {
                        // Use the lowest number of song(s) allocated worker
                        const { worker_id } = await this.allocationRepository.findLowestCount() as Allocation
        
                        const check = await this.allocationRepository.findbyWorkerIdAndSongId(worker_id, songId)
                            
                        if(!check) await this.allocationRepository.create({ worker_id, song_id: songId }, trx)
                    }
                    await trx.commit();
                }
                Logger.info(`completed for ${workers[key].id}`)
            }
        } catch (error) {
            await trx.rollback()
        }
        return true;
    }
}