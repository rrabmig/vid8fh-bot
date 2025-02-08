import { Injectable } from '@nestjs/common';
import { API, MessageContext, Upload, VK } from 'vk-io';
import { CommandWithPrefix, FeatureFlags } from './types';

import { helloPhoto, meePhoto, pockerFacePhoto } from './media/attachments';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class VkService {
  constructor(private readonly aiService: AiService) {}

  private readonly bot = new VK({
    token: process.env.VK_TOKEN!,
  });

  private readonly api = new API({
    token: process.env.VK_TOKEN!,
  });

  private readonly uploader = new Upload({
    api: this.api,
  });

  private readonly featureFlags: FeatureFlags = {
    mee: true,
    gpt: true,
  };

  private log = (message: string) => {
    this.bot.api.messages.send({
      peer_id: Number(process.env.LOG_CHAT_ID),
      random_id: 0,
      message: message,
    });
  };

  uploadPhoto(link: string) {
    return this.uploader.messagePhoto({
      source: {
        value: link,
      },
    });
  }

  doCommandResponse(messageContext: MessageContext) {
    const message = messageContext?.text?.toLowerCase().trim();

    if (!message) return;

    const [command] = message.split(' ');

    switch (command as CommandWithPrefix) {
      case '!help':
        messageContext.reply(`
          🐐 Доступные команды:
          !help - вывести список доступных команд
          !roll - рандомное число от 0 до 100
          `);
        break;

      case '!roll':
        messageContext.reply(
          `🐐 Коза выпало:  ${Math.floor(Math.random() * 100) + 1}`,
        );
        break;

      case '!ask': {
        const question = message.replace('!ask ', '');

        if (!message) return;

        this.aiService
          .generate(
            question,
            'Ты коза. Отвечай как коза. Коротко. На русском. Больше меее и смайликов.',
            1.4,
          )
          .then((aiResponse) => {
            if (!aiResponse) return;
            messageContext.reply(aiResponse.slice(0, 300));
          })
          .catch((error) => {
            this.log(error);
            messageContext.reply('🐐 Коза сломалась @rrabmig');
          });
        break;
      }

      default:
        messageContext.reply('Неизвестная команда');
    }
  }

  doDefaultResponse = async (messageContext: MessageContext) => {
    const message = messageContext?.text?.toLowerCase().trim();

    if (!message) return;

    if (message.includes('коза')) {
      messageContext.send('🐐 Я козаааа');
      return;
    }

    if (message.includes('привет я')) {
      messageContext.send('🐐 Привет я', {
        attachment: await this.uploadPhoto(helloPhoto),
      });
      return;
    }

    if (message.includes('микронаушник')) {
      messageContext.send('🐐 козе не нравится *>_<', {
        attachment: await this.uploadPhoto(pockerFacePhoto),
      });
      return;
    }

    if (message.includes('ме') && this.featureFlags.mee) {
      const randomNumber = Math.floor(Math.random() * 100) + 1;

      if (randomNumber > 30) return;

      const eCount = Math.floor(Math.random() * 20) + 1;

      let answerText = 'м';
      for (let i = 0; i < eCount; i++) {
        answerText += 'е';
      }

      const withAttachment = randomNumber < 10;

      if (withAttachment) {
        messageContext.send(answerText, {
          attachment: await this.uploadPhoto(meePhoto),
        });
      } else {
        messageContext.send(answerText);
      }

      return;
    }
  };

  onMessageNew(messageContext: MessageContext) {
    const message = messageContext?.text?.toLowerCase().trim();

    if (!message) return;

    if (message.startsWith('!')) {
      this.doCommandResponse(messageContext);
    } else {
      this.doDefaultResponse(messageContext);
    }
  }

  onModuleInit() {
    this.bot.updates.on('message_new', (messageContext) =>
      this.onMessageNew(messageContext),
    );

    this.bot.updates.start();
    this.log('Бот успешно запущен!');
  }

  onModuleDestroy() {
    this.log('Бот завершил работу!');
    this.bot.updates.stop();
  }
}
