// master-record.service.ts
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

  async findByContactNumber(contactnumber: string): Promise<MasterRecord | null> {
    const records = await this.masterRecordRepository.find({
      where: { contactnumber },
    });
    // Return the first preapproval record, or the first record if none are preapproval
    return records.find(record => record.recordType === 'preapproval') || records[0] || null;
  }
}