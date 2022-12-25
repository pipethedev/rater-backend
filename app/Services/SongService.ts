import { UploadSong } from "App/Types";
import { container, injectable } from "tsyringe";
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { SuccessResponse } from "App/Helpers";
import { AppError } from "App/Exceptions/Handler";
import httpStatus, { NOT_FOUND } from "http-status";
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

@injectable()
export default class SongService {
    protected songRepository: SongRepository = container.resolve(SongRepository)
    protected mailService: MailService = container.resolve(MailService)
    protected userRepository: UserRepository = container.resolve(UserRepository)

    public async saveRecord(userId: string, { title }: UploadSong, file: MultipartFileContract) {
        const trx = await Database.transaction()
        try {
            if(!file) throw new AppError(httpStatus.UNSUPPORTED_MEDIA_TYPE, "Kindly provide a file!")

            if (!file.isValid) throw file.errors;

            const { id, email, first_name, last_name } = await this.userRepository.findByID(userId) as User

            const userEncryptor = Encryption.child({ secret: randomBytes(16).toString('hex') });
              
            const generatedId = btoa(userEncryptor.encrypt(String((file as any).data.clientName)));

            const song = await this.songRepository.create({
                user_id: id,
                title,
            }, trx)

            await file.moveToDisk('./', { name: generatedId })
            
            const url = await Drive.getSignedUrl(generatedId as string)

             await this.songRepository.updateOne(song.id, {
                file_name: String((file as any).data.clientName),
                file_url: url,
                external_id: generatedId
            }, trx)

            await this.mailService.send(email, `${Env.get('APP_NAME')} sound submission`, "emails/song_submission", { name: `${last_name} ${first_name}`, ...song})

            await trx.commit()
            return SuccessResponse("File uploaded successfully, an adminstrator will get back to you", song)
        } catch (error) {
            await trx.rollback()
            throw error;
        }
    }

    public async fetchSongs(userId: string) {
        try {
            const songs = await this.songRepository.findAllByUser(userId)
            return SuccessResponse<Song[]>("All uploaded songs fetched successfully", songs)
        } catch (error) {
            throw error;
        }
    }

    public async deleteSong(userId: string, songId: string) {
        try {
            const song = await this.songRepository.findOneByUser(userId, songId) as Song
            if (!song) throw new AppError(NOT_FOUND, "This song is unavailable")
            await this.songRepository.deleteOneByUser(userId, songId);
            return SuccessResponse<Song>(`Song #${song.id} deleted successfuly`, song)
        } catch (error) {
            throw error;
        }
    }
}