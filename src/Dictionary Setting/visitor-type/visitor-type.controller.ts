import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { VisitorTypeService } from './visitor-type.service';
import { CreateVisitorTypeDto, UpdateVisitorTypeDto } from './visitor-type.dto';

@Controller('visitor-type')
export class VisitorTypeController {
  constructor(private readonly visitorTypeService: VisitorTypeService) {}

  @Post()
  create(@Body() dto: CreateVisitorTypeDto) {
    return this.visitorTypeService.create(dto);
  }

  @Get()
  findAll() {
    return this.visitorTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.visitorTypeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVisitorTypeDto) {
    return this.visitorTypeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.visitorTypeService.remove(id);
  }
}