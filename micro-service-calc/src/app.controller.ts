import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('sum')
  async sum(numArr: Array<number>): Promise<Number> {
    return numArr.reduce((total, item) => total + item, 0);
  }
}
