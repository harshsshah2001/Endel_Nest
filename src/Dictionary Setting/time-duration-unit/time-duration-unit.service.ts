import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeDurationUnit } from './time-duration-unit.entity';
import { CreateTimeDurationUnitDto, UpdateTimeDurationUnitDto } from './time-duration-unit.dto';

@Injectable()
export class TimeDurationUnitService {
  constructor(
    @InjectRepository(TimeDurationUnit)
    private readonly timeDurationUnitRepository: Repository<TimeDurationUnit>,
  ) {}

  async create(dto: CreateTimeDurationUnitDto): Promise<TimeDurationUnit> {
    const existing = await this.timeDurationUnitRepository.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Time duration unit already exists');
    }
    const unit = this.timeDurationUnitRepository.create(dto);
    return this.timeDurationUnitRepository.save(unit);
  }

  async findAll(): Promise<TimeDurationUnit[]> {
    return this.timeDurationUnitRepository.find();
  }

  async findOne(id: number): Promise<TimeDurationUnit> {
    const unit = await this.timeDurationUnitRepository.findOne({ where: { id } });
    if (!unit) {
      throw new NotFoundException('Time duration unit not found');
    }
    return unit;
  }

  async update(id: number, dto: UpdateTimeDurationUnitDto): Promise<TimeDurationUnit> {
    const unit = await this.findOne(id);
    const existing = await this.timeDurationUnitRepository.findOne({ where: { name: dto.name } });
    if (existing && existing.id !== id) {
      throw new ConflictException('Time duration unit already exists');
    }
    Object.assign(unit, dto);
    return this.timeDurationUnitRepository.save(unit);
  }

  async remove(id: number): Promise<void> {
    const unit = await this.findOne(id);
    await this.timeDurationUnitRepository.remove(unit);
  }
}