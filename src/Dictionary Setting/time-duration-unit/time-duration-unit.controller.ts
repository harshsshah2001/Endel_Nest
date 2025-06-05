import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TimeDurationUnitService } from './time-duration-unit.service';
import { CreateTimeDurationUnitDto, UpdateTimeDurationUnitDto } from './time-duration-unit.dto';

@Controller('time-duration-unit')
export class TimeDurationUnitController {
  constructor(private readonly timeDurationUnitService: TimeDurationUnitService) {}

  @Post()
  create(@Body() dto: CreateTimeDurationUnitDto) {
    return this.timeDurationUnitService.create(dto);
  }

  @Get()
  findAll() {
    return this.timeDurationUnitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.timeDurationUnitService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTimeDurationUnitDto) {
    return this.timeDurationUnitService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.timeDurationUnitService.remove(id);
  }
}