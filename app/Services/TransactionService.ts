import { SuccessResponse } from "App/Helpers";
import TransactionRepository from "App/Repository/TransactionRepository";
import { container } from "tsyringe";

export default class TransactionService {
    protected transactionRepository: TransactionRepository = container.resolve(TransactionRepository)
    public async all() {
        try {   
            const transactions = await this.transactionRepository.findAll();
            return SuccessResponse("All transactions", transactions)
        } catch (error) {
            throw error;
        }
    }
 
    public async user(userId: string) {
        try {   
            const transactions = await this.transactionRepository.findAllByUser(userId);
            return SuccessResponse("All transactions", transactions)
        } catch (error) {
            throw error;
        }
    }
}