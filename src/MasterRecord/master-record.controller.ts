import { Controller, Get, Query } from '@nestjs/common';
import { MasterRecordService } from './master-record.service';
import { MasterRecord } from './master-record.entity';

@Controller('master-records')
export class MasterRecordController {
  constructor(private readonly masterRecordService: MasterRecordService) {}

  @Get()
  async findAll(): Promise<MasterRecord[]> {
    return this.masterRecordService.findAll();
  }

  @Get('by-contact')
  async findByContactNumber(@Query('contactnumber') contactnumber: string): Promise<MasterRecord | null> {
    return this.masterRecordService.findByContactNumber(contactnumber);
  }
}