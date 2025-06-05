import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PurposeOfVisitService } from './purpose-of-visit.service';
import { CreatePurposeOfVisitDto, UpdatePurposeOfVisitDto } from './purpose-of-visit.dto';

@Controller('purpose-of-visit')
export class PurposeOfVisitController {
  constructor(private readonly purposeOfVisitService: PurposeOfVisitService) {}

  @Post()
  create(@Body() dto: CreatePurposeOfVisitDto) {
    return this.purposeOfVisitService.create(dto);
  }

  @Get()
  findAll() {
    return this.purposeOfVisitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.purposeOfVisitService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePurposeOfVisitDto) {
    return this.purposeOfVisitService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.purposeOfVisitService.remove(id);
  }
}