import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse, SuccessResponse } from 'App/Helpers';
import TransactionService from 'App/Services/TransactionService';
import { container } from 'tsyringe';
import Logger from '@ioc:Adonis/Core/Logger'
import UserRepository from 'App/Repository/UserRepository';
import { BAD_REQUEST } from 'http-status';
import AppError from 'App/Helpers/error';
import ReferenceRepository from 'App/Repository/ReferenceRepository';
import { Roles } from 'App/Enum';

export default class TransactionsController {
    protected transactionService: TransactionService = container.resolve(TransactionService)
    protected userRepository: UserRepository = container.resolve(UserRepository)
    protected paymentReferenceRepository: ReferenceRepository = container.resolve(ReferenceRepository)

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

    public async allPaymentReferences({ auth, response }: HttpContextContract) {
        try {
            const { role, id } = auth.user!;

            if(role !== Roles.USER) throw new AppError(BAD_REQUEST, "Invalid user")

            const result = await this.paymentReferenceRepository.findByUser(String(id));
            
            return response.ok(SuccessResponse("User payment reference fetched", result))
        } catch (error) {
            Logger.error(error.message)

            if (error instanceof AppError)  return response.status(error.statusCode).send(ErrorResponse(error.message))
            
            return response.internalServerError(ErrorResponse('We could not fetch the payment references, try again later!'))
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
