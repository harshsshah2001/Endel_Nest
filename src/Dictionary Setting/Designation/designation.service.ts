import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Designation } from './designation.entity';
import { CreateDesignationDto, UpdateDesignationDto } from './designation.dto';

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private readonly designationRepository: Repository<Designation>,
  ) {}

  async create(dto: CreateDesignationDto): Promise<Designation> {
    const existing = await this.designationRepository.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Designation already exists');
    }
    const designation = this.designationRepository.create(dto);
    return this.designationRepository.save(designation);
  }

  async findAll(): Promise<Designation[]> {
    return this.designationRepository.find();
  }

  async findOne(id: number): Promise<Designation> {
    const designation = await this.designationRepository.findOne({ where: { id } });
    if (!designation) {
      throw new NotFoundException('Designation not found');
    }
    return designation;
  }

  async update(id: number, dto: UpdateDesignationDto): Promise<Designation> {
    const designation = await this.findOne(id);
    const existing = await this.designationRepository.findOne({ where: { name: dto.name } });
    if (existing && existing.id !== id) {
      throw new ConflictException('Designation already exists');
    }
    Object.assign(designation, dto);
    return this.designationRepository.save(designation);
  }

  async remove(id: number): Promise<void> {
    const designation = await this.findOne(id);
    await this.designationRepository.remove(designation);
  }
}