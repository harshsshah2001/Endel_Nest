import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterRecord } from './master-record.entity';

@Injectable()
export class MasterRecordService {
  constructor(
    @InjectRepository(MasterRecord)
    private masterRecordRepository: Repository<MasterRecord>,
  ) {}

  async upsert(masterRecord: Partial<MasterRecord>): Promise<MasterRecord> {
  let existingRecord: MasterRecord | null = null;

  // Make sure only one of visitorId or appointmentId is set
  if (masterRecord.recordType === 'spot') {
    masterRecord.appointmentId = undefined;
    if (masterRecord.visitorId) {
      existingRecord = await this.masterRecordRepository.findOne({
        where: { visitorId: masterRecord.visitorId, recordType: 'spot' },
      });
    }
  } else if (masterRecord.recordType === 'preapproval') {
    masterRecord.visitorId = undefined;
    if (masterRecord.appointmentId) {
      existingRecord = await this.masterRecordRepository.findOne({
        where: { appointmentId: masterRecord.appointmentId, recordType: 'preapproval' },
      });
    }
  }

  if (existingRecord) {
    const updated = Object.assign(existingRecord, masterRecord);
    return await this.masterRecordRepository.save(updated);
  } else {
    const newRecord = this.masterRecordRepository.create(masterRecord);
    
    return await this.masterRecordRepository.save(newRecord);
  }
}





  async findAll(): Promise<MasterRecord[]> {
    return this.masterRecordRepository.find();
  }
}