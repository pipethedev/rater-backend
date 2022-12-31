import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse } from 'App/Helpers';
import TransactionService from 'App/Services/TransactionService';
import { container } from 'tsyringe';
import Logger from '@ioc:Adonis/Core/Logger'
import UserRepository from 'App/Repository/UserRepository';
import { BAD_REQUEST } from 'http-status';
import AppError from 'App/Helpers/error';

export default class TransactionsController {
    protected transactionService: TransactionService = container.resolve(TransactionService)
    protected userRepository: UserRepository = container.resolve(UserRepository)

    public async allTransaction({ response }: HttpContextContract) {
        try {
            const result = await this.transactionService.all();
            return response.ok(result)
        } catch (error) {
            Logger.error(error.message)
            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
            return response.internalServerError(ErrorResponse('We could not fetch all users, try again later!'))
        }
    }

    public async userTransaction({ auth, response }: HttpContextContract) {
        try {
            const { id } = auth.user!

            const user = await this.userRepository.findByID(id)

            if (!user) throw new AppError(BAD_REQUEST, "Unable to fetch user transaction")

            const result = await this.transactionService.user(id);
            return response.ok(result)
        } catch (error) {
            Logger.error(error.message)
            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
            return response.internalServerError(ErrorResponse('We could not fetch all users, try again later!'))
        }
    }
}
