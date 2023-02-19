import { extname } from 'path'
import Event from '@ioc:Adonis/Core/Event'
import { UpdateSongAnalytics, UploadSong } from "App/Types";
import { container, injectable } from "tsyringe";
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { SuccessResponse } from "App/Helpers";
import { BAD_REQUEST, NOT_FOUND, UNSUPPORTED_MEDIA_TYPE } from "http-status";
import SongRepository from "App/Repository/SongRepository";
import Drive from '@ioc:Adonis/Core/Drive'
import { randomBytes } from 'crypto'
import Database from '@ioc:Adonis/Lucid/Database'
import MailService from "./MailService";
import Encryption from '@ioc:Adonis/Core/Encryption'
import UserRepository from "App/Repository/UserRepository";
import User from "App/Models/User";
import Env from '@ioc:Adonis/Core/Env'
import Song from "App/Models/Song";
import PaystackService from "./PaystackService";
import ReferenceRepository from "App/Repository/ReferenceRepository";
import PaymentReference from "App/Models/PaymentReference";
import { RatingLevel, Roles } from 'App/Enum';
import AllocationService from './AllocationService';
import AllocationRepository from 'App/Repository/AllocationRepository';
import AppError from 'App/Helpers/error';
import Allocation from 'App/Models/Allocation';

@injectable()
export default class SongService {
    protected allocationService: AllocationService = container.resolve(AllocationService)
    protected paystackService: PaystackService = container.resolve(PaystackService)
    protected paymentReferenceRepository: ReferenceRepository = container.resolve(ReferenceRepository)
    protected songRepository: SongRepository = container.resolve(SongRepository)
    protected mailService: MailService = container.resolve(MailService)
    protected userRepository: UserRepository = container.resolve(UserRepository)
    protected allocationRepository: AllocationRepository = container.resolve(AllocationRepository)

    public async saveRecord(userId: string, { request }) {
        const trx = await Database.transaction()
        try {
            const { title, payment_reference } = request.body() as UploadSong;

            const supportedFiles: string[] = [ 'mp3', 'ogg', 'wav', 'mp4', 'wma', 'm4a' ];

            // Check for pending payment reference
            const paymentReference = await this.paymentReferenceRepository.findUnused(userId) as PaymentReference

            if(payment_reference !== paymentReference.reference) throw new AppError(BAD_REQUEST, "Kindly use your un-used payment reference to proceed");

            const payment = await this.paystackService.verify(payment_reference) as PaymentReference

            const file: MultipartFileContract = request.file('audio', { size: '10mb', extnames:  supportedFiles })!

            if(!file) throw new AppError(UNSUPPORTED_MEDIA_TYPE, `Kindly provide a supported file! ${supportedFiles.join(',')}`)

            if (!file.isValid) throw file.errors;

            const { id, email, first_name, last_name } = await this.userRepository.findByID(userId) as User

            const encrypt = Encryption.child({ secret: randomBytes(16).toString('hex') });
              
            const generatedId = btoa(encrypt.encrypt(String((file as any).data.clientName)));

            await file.moveToDisk('./', { name: generatedId })

            const url = `${Env.get('CLOUDCUBE_URL')}/${Env.get('CLOUDCUBE_BUCKET_NAME')}/${generatedId}?x-id=GetObject`;

            const song = await this.songRepository.create({
                user_id: id,
                title,
                file_name: String((file as any).data.clientName),
                file_url: url,
                external_id: generatedId
            }, trx)

            Event.emit('create:allocation', { song_id: song.id })

            await Promise.all([
                this.paymentReferenceRepository.update(payment.id, { used: true }, trx),

                this.mailService.send(email, `${Env.get('APP_NAME')} Sound Submission`, "emails/song_submission", { name: `${last_name} ${first_name}`, ...song}),
            ])

            await trx.commit()
            return SuccessResponse("File uploaded successfully, an adminstrator will get back to you", song)
        } catch (error) {
            await trx.rollback()
            throw error;
        }
    }

    public async saveSongAnalytics(songId: string, body: UpdateSongAnalytics) {
        const trx = await Database.transaction();
        try {
            const allocation = await this.allocationRepository.findBySongId(songId) as Allocation

            if(!allocation) throw new AppError(NOT_FOUND, "Song not found");

            const update = await this.allocationRepository.updateOne(allocation.id, body, trx)

            await trx.commit()
            return SuccessResponse("Song analytics updated successfully", update)
        } catch (error) {
            await trx.rollback()
            throw error;
        }
    }

    public async fetchSongs(userId: string) {
        try {
            let response: any[];
            const user = await this.userRepository.findByID(userId) as User

            const data = await this.allocationRepository.findByWorkerId(userId)

           switch (user.role) {
                case Roles.ADMIN:
                    response = await this.songRepository.findByRating(RatingLevel.Good, Roles.ADMIN)
                break;
                case Roles.USER:
                    response = await this.songRepository.findAllByUser(userId)
                break;
                case Roles.MANAGER:
                    response = data.map(({ song, worker }) => { 
                        return {
                            song,
                            worker: {
                                id: worker.id,
                                name: `${worker.last_name} ${worker.first_name}`
                            }
                        }
                    })
                break;
           }
            return response;
        } catch (error) {
            throw error;
        }
    }

    public async fetchSingleSong(userId: string, songId: string) {
        try {
            let song = await this.songRepository.findOneByUser(userId, songId)

            const user = await this.userRepository.findByID(userId) as User

            if (user.role !== Roles.USER) {
                song = await this.songRepository.findOneById(songId)
            }
            return SuccessResponse("Song fetched successfully", song)
        } catch (error) {
            throw error;
        }
    }

    public async download(songId: string, { response }) {
        const song = await this.songRepository.findOneById(songId) as Song

        const { size } = await Drive.getStats(song.external_id)

        response.type(extname(song.external_id))
        response.header('content-length', size)
      
        return await Drive.getStream(song.external_id)
    }

    public async deleteSong(userId: string, songId: string) {
        try {
            const song = await this.songRepository.findOneByUser(userId, songId) as Song
            if (!song) throw new AppError(NOT_FOUND, "This song is unavailable")
            await Promise.all([
                this.songRepository.deleteOneByUser(userId, songId),
                Drive.delete(song.file_name)
            ])
            return SuccessResponse<Song>(`Song #${song.id} deleted successfuly`, song)
        } catch (error) {
            throw error;
        }
    }
}