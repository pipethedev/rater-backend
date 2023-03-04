import { Configuration, OpenAIApi } from "openai";
import Env from '@ioc:Adonis/Core/Env'
import { RateSongBody } from "App/Types";
import { container, injectable } from "tsyringe";
import MailService from "./MailService";

@injectable()
class OpenAIService {
    private configuration: Configuration;
    private openAi: OpenAIApi;   

    constructor(private readonly mailService: MailService) {
        this.mailService = container.resolve(MailService);

        this.configuration = new Configuration({
            apiKey: Env.get("OPENAI_API_KEY"),
        });
        this.openAi = new OpenAIApi(this.configuration);
    }

    public async report(user: { first_name: string, last_name: string, email: string}, body: Omit<RateSongBody, 'song_id'>): Promise<any> {
        const response = await this.openAi.createCompletion({
            model: "text-davinci-003",
            prompt: this.generatePrompt(user.first_name, body),
            max_tokens: 2048,
        });
        const comment = response.data.choices[0].text;

        await this.mailService.send(user.email, 'Soundseek Report', 'emails/admin_feedback', {
            first_name: user.first_name,
            last_name: user.last_name,
            isAdmin: false,
            comment
        });
    }

    

    private generatePrompt(name: string, body: Omit<RateSongBody, 'song_id'>): string {
        return `Provide a concise and professional summary in a mail-like response of a song that eliminates spelling errors or informal language based on these remarks for a reciepient named ${name} and the sender name is Soundseek. 
        ${body.likeComment}, ${body.improvementComment}, ${body.disLikeComment}. Starting with Dear ${name}`;
    }
}

export default OpenAIService;

