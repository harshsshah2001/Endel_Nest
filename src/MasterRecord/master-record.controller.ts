import { Controller, Get } from '@nestjs/common';
import { MasterRecordService } from './master-record.service';
import { MasterRecord } from './master-record.entity';

@Controller('master-records')
export class MasterRecordController {
  constructor(private readonly masterRecordService: MasterRecordService) {}

  @Get()
  async findAll(): Promise<MasterRecord[]> {
    return this.masterRecordService.findAll();
  }
}