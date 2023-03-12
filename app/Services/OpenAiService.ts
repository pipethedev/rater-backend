import { Configuration, OpenAIApi } from "openai";
import Env from '@ioc:Adonis/Core/Env'
import { RateSongBody } from "App/Types";
import { container, injectable } from "tsyringe";
import MailService from "./MailService";
import RatingRepository from "App/Repository/RatingRepository";

@injectable()
class OpenAIService {
    private configuration: Configuration;
    private openAi: OpenAIApi;   

    constructor(private readonly mailService: MailService, private readonly ratingRepo: RatingRepository) {
        this.mailService = container.resolve(MailService);

        this.configuration = new Configuration({
            apiKey: Env.get("OPENAI_API_KEY"),
        });
        this.openAi = new OpenAIApi(this.configuration);
    }

    public async report(user: { first_name: string, last_name: string, email: string}, details: {
        ratingId: string,
        songId: string,
        songName: string
    },body: Omit<RateSongBody, 'song_id'>): Promise<any> {

        const { ratingId, songId, songName } = details;

        const response = await this.openAi.createCompletion({
            model: "text-davinci-003",
            prompt: this.generatePrompt(user.first_name, songName, body),
            max_tokens: 2048,
        });
        const comment = response.data.choices[0].text;

        await Promise.all([
            this.ratingRepo.update(ratingId, songId, {
                aiComment: comment
            }),
    
            this.mailService.send(user.email, 'Soundseek Report', 'emails/admin_feedback', {
                first_name: user.first_name,
                last_name: user.last_name,
                isAdmin: false,
                comment
            })
        ]);
    }

    private generatePrompt(name: string, songName: string,body: Omit<RateSongBody, 'song_id'>): string {
        return `Generate a professional email from the CEO of Soundseek to ${name} regarding their latest release, "${songName}". Use feedback collected from a form that asked users three questions: "What do you like about the song?", "What don't you like about the song?", and "Is the song perfect as it is? If not, what could be done to improve the song?" Incorporate user feedback from the forms, including ${body.likeComment}, ${body.improvementComment} ${body.disLikeComment}, into the email. Encourage the artiste moving forward and ensure the email is directly addressed to them`
    }
}

export default OpenAIService;

