import { Configuration, OpenAIApi } from "openai";
import Env from '@ioc:Adonis/Core/Env'
import { RateSongBody } from "App/Types";

class OpenAIService {
    private configuration: Configuration;
    private openAi: OpenAIApi;   

    constructor() {
        this.configuration = new Configuration({
            apiKey: Env.get("OPENAI_API_KEY"),
        });
        this.openAi = new OpenAIApi(this.configuration);
    }

    public async report(body: Omit<RateSongBody, 'song_id'>): Promise<any> {
        const response = await this.openAi.createCompletion({
            model: "text-davinci-003",
            prompt: this.generatePrompt(body),
            temperature: 0.9,
            max_tokens: 2313,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
        });
        return response.data;
    }

    private generatePrompt(body: Omit<RateSongBody, 'song_id'>): string {
        return `Provide a concise and professional summary in a mail-like response that eliminates spelling errors or informal language? The answer will specify what we like about the song, what we don't like, and what the artiste needs to do to improve the music.
        What do you like about the song?
        response: ${body.likeComment}
        What don't you like about the song?
        response: ${body.disLikeComment}
        Is the song perfect as It is? if not, what could be done to improve the song?
        response: ${body.improvementComment}`;
    }
}

export default OpenAIService;