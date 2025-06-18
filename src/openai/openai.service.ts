import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
    private readonly openai: OpenAI;
    private readonly engine: string;

    constructor(private readonly config: ConfigService) {
        this.engine = this.config.getOrThrow<string>('DEEPSEEK_ENGINE_CHAT');
        this.openai = new OpenAI({
            baseURL: this.config.getOrThrow('DEEPSEEK_BASE_URL'),
            apiKey: this.config.getOrThrow('DEEPSEEK_API_TOKEN'),
        });
    }

    async generateAiResponse(prompt: string): Promise<string | null> {
        const chatCompletion: any = await this.openai.chat.completions.create({
            model: this.engine,
            messages: [{ role: 'user', content: prompt }],
        });

        return chatCompletion.choices[0].message.content;
    }

}
