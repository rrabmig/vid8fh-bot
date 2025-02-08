import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { VkModule } from './vk/vk.module';

@Module({
  imports: [ConfigModule.forRoot(), VkModule],
  providers: [AppService],
})
export class AppModule {}
