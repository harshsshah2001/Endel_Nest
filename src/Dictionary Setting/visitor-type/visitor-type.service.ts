import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitorType } from './visitor-type.entity';
import { CreateVisitorTypeDto, UpdateVisitorTypeDto } from './visitor-type.dto';

@Injectable()
export class VisitorTypeService {
  constructor(
    @InjectRepository(VisitorType)
    private readonly visitorTypeRepository: Repository<VisitorType>,
  ) {}

  async create(dto: CreateVisitorTypeDto): Promise<VisitorType> {
    const existing = await this.visitorTypeRepository.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Visitor type already exists');
    }
    const visitorType = this.visitorTypeRepository.create(dto);
    return this.visitorTypeRepository.save(visitorType);
  }

  async findAll(): Promise<VisitorType[]> {
    return this.visitorTypeRepository.find();
  }

  async findOne(id: number): Promise<VisitorType> {
    const visitorType = await this.visitorTypeRepository.findOne({ where: { id } });
    if (!visitorType) {
      throw new NotFoundException('Visitor type not found');
    }
    return visitorType;
  }

  async update(id: number, dto: UpdateVisitorTypeDto): Promise<VisitorType> {
    const visitorType = await this.findOne(id);
    const existing = await this.visitorTypeRepository.findOne({ where: { name: dto.name } });
    if (existing && existing.id !== id) {
      throw new ConflictException('Visitor type already exists');
    }
    Object.assign(visitorType, dto);
    return this.visitorTypeRepository.save(visitorType);
  }

  async remove(id: number): Promise<void> {
    const visitorType = await this.findOne(id);
    await this.visitorTypeRepository.remove(visitorType);
  }
}