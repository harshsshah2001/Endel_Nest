import { Controller, Get, Patch, Delete, Param, Body, InternalServerErrorException, ParseIntPipe } from '@nestjs/common';
import { VisitorAppointmentDataService } from './visitor_appointment_data.service';
import { Appointment } from '../appointment.entity';

@Controller('visitor-appointment-data')
export class VisitorAppointmentDataController {
  constructor(private readonly visitorAppointmentDataService: VisitorAppointmentDataService) {}

  @Get()
  async getVisitorData(): Promise<
    { id: number; firstname: string; lastname: string; contactnumber: string; nationalid: string }[]
  > {
    try {
      return await this.visitorAppointmentDataService.getVisitorData();
    } catch (error) {
      console.error('❌ Controller error in getVisitorData:', error);
      throw new InternalServerErrorException('Failed to fetch visitor data.');
    }
  }

  @Get(':id')
  async getVisitorById(@Param('id', ParseIntPipe) id: number): Promise<Appointment> {
    try {
      return await this.visitorAppointmentDataService.getVisitorById(id);
    } catch (error) {
      console.error('❌ Controller error in getVisitorById:', error);
      throw error;
    }
  }

  @Patch(':id')
  async updateVisitor(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Appointment>,
  ): Promise<Appointment> {
    try {
      return await this.visitorAppointmentDataService.updateVisitor(id, data);
    } catch (error) {
      console.error('❌ Controller error in updateVisitor:', error);
      throw error;
    }
  }

  @Delete(':id')
  async deleteVisitor(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      return await this.visitorAppointmentDataService.deleteVisitor(id);
    } catch (error) {
      console.error('❌ Controller error in deleteVisitor:', error);
      throw error;
    }
  }
}