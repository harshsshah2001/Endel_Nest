import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return 'Hello World!';
  }
  @Get('message') 
  getMessage(): string {
    return 'Hello from NestJS!';
  }
}
