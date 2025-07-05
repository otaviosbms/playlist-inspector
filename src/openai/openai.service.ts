import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
        try {
            const systemMessage: ChatCompletionMessageParam = {
                role: 'system',
                content: prompt
            };

            const maxTokens: number = this.config.get<number>('GPT_MAX_TOKENS') || 800;

            const chatCompletion: any = await this.openai.chat.completions.create({
                model: this.engine,
                messages: [
                    systemMessage,
                    { role: 'user', content: message }
                ],
                max_tokens: maxTokens
            });

            console.log('Chat Completion:', chatCompletion);

            return chatCompletion.choices[0].message.content;
        } catch (error) {
            console.error('Erro ao gerar resposta da IA:', error?.response?.data || error.message || error);
            throw new InternalServerErrorException('Erro ao gerar resposta da IA. Tente novamente mais tarde.');
        }
    }
}

