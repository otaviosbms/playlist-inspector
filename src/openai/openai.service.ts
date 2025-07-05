import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index';

@Injectable()
export class OpenaiService {
    private readonly openai: OpenAI;
    private readonly engine: string;

    constructor(private readonly config: ConfigService) {
        this.engine = this.config.getOrThrow<string>('GPT_ENGINE');

        const isDeepseek: boolean = this.engine.startsWith('deepseek');

        this.openai = new OpenAI({
            apiKey: this.config.getOrThrow('GPT_API_TOKEN'),
            ...(isDeepseek && {
                baseURL: this.config.getOrThrow('DEEPSEEK_BASE_URL'),
            }),
        });
    }

async generateAiResponse(prompt: string, message: string): Promise<string> {
    const systemMessage: ChatCompletionMessageParam = {
        role: 'system',
        content: prompt
    };

    const chatCompletion: any = await this.openai.chat.completions.create({
        model: this.engine,
        messages: [
            systemMessage,
            { role: 'user', content: message }
        ],
        max_tokens: 800
    });

    console.log('Chat Completion:', chatCompletion);

    return chatCompletion.choices[0].message.content;
}
}

