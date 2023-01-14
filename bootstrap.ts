import AllocationRepository from 'App/Repository/AllocationRepository';
import cron from 'node-cron'
import { container, injectable } from "tsyringe";
import Validator from "validatorjs";

@injectable()
export default class BootstrapApp {

    public registerCustomValidationRules() {
        // initialize custom validations for validatorjs
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        Validator.register("uuid",(value: string) => {
            return uuidRegex.test(value);
          }, ":attribute is not a valid UUID");
    }

    public async registerCronJobs() {
        await Promise.all([
            this.registerPendingAllocations(),

            this.reAssignAllocatedPendingSongs()
        ]);
    }

    private async registerPendingAllocations() {
        const { default: AllocationRepository } = await import('App/Repository/AllocationRepository');
        const allocationRepository = container.resolve(AllocationRepository) as AllocationRepository;
        cron.schedule('0 23 * * *', async () => {
            console.log('Update pending allocations by 11pm before midnight');
            const pending = await allocationRepository.findPending()
            if(pending.length > 0){
                await allocationRepository.updatePending()
            }
        });
    }

    private async reAssignAllocatedPendingSongs() {
        console.log('running')
    }
}