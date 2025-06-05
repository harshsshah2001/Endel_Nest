import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterRecord } from './master-record.entity';
import { MasterRecordService } from './master-record.service';
import { MasterRecordController } from './master-record.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MasterRecord])],
  providers: [MasterRecordService],
  controllers: [MasterRecordController],
  exports: [MasterRecordService], // Export service for use in other modules
})
export class MasterRecordModule {}