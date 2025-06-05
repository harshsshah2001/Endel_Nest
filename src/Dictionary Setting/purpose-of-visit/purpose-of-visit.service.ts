import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurposeOfVisit } from './purpose-of-visit.entity';
import { CreatePurposeOfVisitDto, UpdatePurposeOfVisitDto } from './purpose-of-visit.dto';

@Injectable()
export class PurposeOfVisitService {
  constructor(
    @InjectRepository(PurposeOfVisit)
    private readonly purposeOfVisitRepository: Repository<PurposeOfVisit>,
  ) {}

  async create(dto: CreatePurposeOfVisitDto): Promise<PurposeOfVisit> {
    const existing = await this.purposeOfVisitRepository.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Purpose of visit already exists');
    }
    const purpose = this.purposeOfVisitRepository.create(dto);
    return this.purposeOfVisitRepository.save(purpose);
  }

  async findAll(): Promise<PurposeOfVisit[]> {
    return this.purposeOfVisitRepository.find();
  }

  async findOne(id: number): Promise<PurposeOfVisit> {
    const purpose = await this.purposeOfVisitRepository.findOne({ where: { id } });
    if (!purpose) {
      throw new NotFoundException('Purpose of visit not found');
    }
    return purpose;
  }

  async update(id: number, dto: UpdatePurposeOfVisitDto): Promise<PurposeOfVisit> {
    const purpose = await this.findOne(id);
    const existing = await this.purposeOfVisitRepository.findOne({ where: { name: dto.name } });
    if (existing && existing.id !== id) {
      throw new ConflictException('Purpose of visit already exists');
    }
    Object.assign(purpose, dto);
    return this.purposeOfVisitRepository.save(purpose);
  }

  async remove(id: number): Promise<void> {
    const purpose = await this.findOne(id);
    await this.purposeOfVisitRepository.remove(purpose);
  }
}