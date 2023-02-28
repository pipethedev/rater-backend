import { container, injectable } from "tsyringe";
import Database from "@ioc:Adonis/Lucid/Database";
import RatingRepository from "App/Repository/RatingRepository";
import { AdminFeedbackBody, RateSongBody } from "App/Types";
import SongRepository from "App/Repository/SongRepository";
import Song from "App/Models/Song";
import UserRepository from "App/Repository/UserRepository";
import User from "App/Models/User";
import Rating from "App/Models/Rating";
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND } from "http-status";
import AppError from "App/Helpers/error";
import AdminFeedbackRepository from "App/Repository/AdminFeedbackRepository";
import MailService from "./MailService";
import AllocationRepository from "App/Repository/AllocationRepository";
import AllocationService from "./AllocationService";
import { RatingLevel } from "App/Enum";
import OpenAIService from "./OpenAiService";

@injectable()
export default class RatingService {
    protected songRepository: SongRepository = container.resolve(SongRepository)
    protected userRepository: UserRepository = container.resolve(UserRepository)
    protected allocationRepository: AllocationRepository = container.resolve(AllocationRepository)
    protected ratingRepository: RatingRepository = container.resolve(RatingRepository)
    protected feedbackRepository: AdminFeedbackRepository = container.resolve(AdminFeedbackRepository)
    protected mailService: MailService = container.resolve(MailService)
    protected allocationService: AllocationService = container.resolve(AllocationService)

    protected aiService: OpenAIService = container.resolve(OpenAIService)

    public async rate(workerId: string, method: string, body: RateSongBody) {
        
        const trx = await Database.transaction()
        try {
            let rating;
            const worker = await this.userRepository.findByID(workerId) as User
            
            const song = await this.songRepository.findOneById(body.song_id) as Song

            const report = await this.aiService.report(body);

            if(!song) throw new AppError(NOT_FOUND, "Song not found");

            const { user_id } = song;

            // Check if user has rated the song before
            const ratedSong = await this.ratingRepository.findByWorkerAndSongId(worker.id, body.song_id) as Rating

            // if(ratedSong) throw new AppError(BAD_REQUEST, "You have already rated this song")

            //Check if song is allocated to user
            const allocation = await this.allocationRepository.findbyWorkerIdAndSongId(worker.id, body.song_id)

            if(!allocation) throw new AppError(FORBIDDEN, "This song is not allocated to you for rating");

            if(body.rating === RatingLevel.Bad) {
                // chat gpt generate a report
                console.log('generate a report')
            }

            const fairSongRating = await this.ratingRepository.findByRating(body.song_id, RatingLevel.Fair);

            if(fairSongRating.length === 3 || fairSongRating.length > 2) {
                await this.ratingRepository.update((ratedSong as any).id, song.id, {
                    rating: RatingLevel.Bad
                } ,trx);
                // generate a report with chat got
                console.log('generate a report')
            }

            if(method === "POST") {
                rating = await this.ratingRepository.create({ ...body, worker_id: workerId, user_id }, trx)
            }else if(method === "PUT") {
                rating = await this.ratingRepository.update((ratedSong as any).id, song.id, { ...body, worker_id: workerId, user_id }, trx)
            }

            // If song us rated Fair it should be re-assigned to another worker in the allocation service
            if(body.rating === RatingLevel.Fair) await this.allocationService.create(body.song_id, workerId);

            await trx.commit()

            return {
                rating,
                report
            };
        } catch (error) {
            await trx.rollback()
            throw error;
        }
    }

    public async adminFeedback(adminId: string, body: AdminFeedbackBody) {
        const trx = await Database.transaction()
        try {
            const { song_id, comment } = body;
            const admin = await this.userRepository.findByID(adminId) as User;

            if(!admin) throw new AppError(BAD_REQUEST, "Invalid admin")

            const song = await this.songRepository.findOneById(song_id);

            if(!song) throw new AppError(BAD_REQUEST, "Invalid song id provided")

            // Check if user has rated the song before
            const feedback = await this.feedbackRepository.findBySongId(body.song_id);

            if(feedback) throw new AppError(BAD_REQUEST, "You have already provided a feedback for this song")

            const createdFeedback = await this.feedbackRepository.create({ song_id, comment, admin_id: adminId }, trx)

            // Send a mail to the song owner

            const { last_name, first_name } = song.user;

            await this.mailService.send(song.user.email, "SoundSeek Administrator Feedback", "emails/admin_feedback", { last_name, first_name, comment: createdFeedback.comment })

            await trx.commit()

            return createdFeedback;
        } catch (error) {
            await trx.rollback()
            throw error;
        }
    }

    public async editAdminFeedback(adminId: string, body: AdminFeedbackBody) {
        const trx = await Database.transaction()
        try {
            const { song_id, comment } = body;
            
            const admin = await this.userRepository.findByID(adminId) as User;

            if(!admin) throw new AppError(BAD_REQUEST, "Invalid admin")

            const song = await this.songRepository.findOneById(song_id);

            if(!song) throw new AppError(BAD_REQUEST, "Invalid song id provided")

            // Check if user has rated the song before
            const feedback = await this.feedbackRepository.findBySongId(body.song_id);

            if(feedback) {
                const updatedFeedback = await this.feedbackRepository.update(feedback.id, { comment }, trx)
                // Send a mail to the song owner

                const { last_name, first_name } = song.user;

                await this.mailService.send(song.user.email, "SoundSeek Administrator Feedback [UPDATE]", "emails/admin_feedback", { last_name, first_name, comment: updatedFeedback.comment })

                await trx.commit()

                return updatedFeedback;
            }
            throw new AppError(BAD_REQUEST, "Provide a feedback, before this feedback can be edited")
        } catch (error) {
            await trx.rollback()
            throw error;
        }
    }
}