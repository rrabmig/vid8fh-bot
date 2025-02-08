import { Module } from '@nestjs/common';
import { VkService } from './vk.service';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [VkService],
  exports: [VkService],
})
export class VkModule {}
