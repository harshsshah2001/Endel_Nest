import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './department.dto';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentService.create(dto);
  }

  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDepartmentDto) {
    return this.departmentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.remove(id);
  }
}