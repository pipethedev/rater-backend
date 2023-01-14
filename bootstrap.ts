import cron from 'node-cron'
import { injectable } from "tsyringe";
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
        cron.schedule('* * * * *', () => {
            console.log('running a task every minute');
        });
    }
}