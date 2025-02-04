import { Injectable } from '@nestjs/common';

@Injectable()
export class VkService {
  getHello(): string {
    return 'Hello World!';
  }
}
