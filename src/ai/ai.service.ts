import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.DEEPSEEK_API_KEY ?? '',
  });

  private readonly model = 'deepseek/deepseek-r1:free';

  private throttle = false;

  async generate(prompt: string, systemMessage?: string, temperature?: number) {
    if (this.throttle) {
      return '🐐 Коза думает, дождись ответа';
    }

    systemMessage =
      systemMessage?.trim() ?? 'Ты гномик, которого заперли в компьютере';
    temperature = temperature ?? 1;

    this.throttle = true;

    const ans = await Promise.race([
      new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve('🐐 Коза устала думать (');
        }, 120 * 1000);
      }),
      this.openai.chat.completions
        .create({
          model: this.model,
          messages: [
            { role: 'user', content: prompt },
            {
              role: 'system',
              content: systemMessage,
            },
          ],
          temperature: temperature,
        })
        .then((response) => {
          return response.choices[0].message.content;
        }),
    ]).finally(() => {
      this.throttle = false;
    });

    return ans;
  }
}
