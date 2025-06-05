import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorAppointmentDataService } from './visitor_appointment_data.service';
import { VisitorAppointmentDataController } from './visitor_appointment_data.controller';
import { Appointment } from '../appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  providers: [VisitorAppointmentDataService],
  controllers: [VisitorAppointmentDataController],
})
export class VisitorAppointmentDataModule {}