import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender } from './gender.entity';
import { CreateGenderDto, UpdateGenderDto } from './gender.dto';

@Injectable()
export class GenderService {
  constructor(
    @InjectRepository(Gender)
    private readonly genderRepository: Repository<Gender>,
  ) {}

  async create(dto: CreateGenderDto): Promise<Gender> {
    const existing = await this.genderRepository.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Gender already exists');
    }
    const gender = this.genderRepository.create(dto);
    return this.genderRepository.save(gender);
  }

  async findAll(): Promise<Gender[]> {
    return this.genderRepository.find();
  }

  async findOne(id: number): Promise<Gender> {
    const gender = await this.genderRepository.findOne({ where: { id } });
    if (!gender) {
      throw new NotFoundException('Gender not found');
    }
    return gender;
  }

  async update(id: number, dto: UpdateGenderDto): Promise<Gender> {
    const gender = await this.findOne(id);
    const existing = await this.genderRepository.findOne({ where: { name: dto.name } });
    if (existing && existing.id !== id) {
      throw new ConflictException('Gender already exists');
    }
    Object.assign(gender, dto);
    return this.genderRepository.save(gender);
  }

  async remove(id: number): Promise<void> {
    const gender = await this.findOne(id);
    await this.genderRepository.remove(gender);
  }
}