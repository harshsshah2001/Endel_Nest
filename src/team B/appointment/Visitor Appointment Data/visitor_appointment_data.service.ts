import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../appointment.entity';

@Injectable()
export class VisitorAppointmentDataService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  async getVisitorData(): Promise<
    { id: number; firstname: string; lastname: string; contactnumber: string; nationalid: string }[]
  > {
    try {
      return await this.appointmentRepo.find({
        select: ['id', 'firstname', 'lastname', 'contactnumber', 'nationalid'],
      });
    } catch (error) {
      console.error('❌ Error fetching visitor data:', error);
      throw new InternalServerErrorException('Failed to fetch visitor data.');
    }
  }

  async getVisitorById(id: number): Promise<Appointment> {
    try {
      const visitor = await this.appointmentRepo.findOne({ where: { id } });
      if (!visitor) {
        throw new NotFoundException(`Visitor with ID ${id} not found`);
      }
      return visitor;
    } catch (error) {
      console.error('❌ Error fetching visitor by ID:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch visitor.');
    }
  }

  async updateVisitor(id: number, data: Partial<Appointment>): Promise<Appointment> {
    try {
      const visitor = await this.appointmentRepo.findOne({ where: { id } });
      if (!visitor) {
        throw new NotFoundException(`Visitor with ID ${id} not found`);
      }
      await this.appointmentRepo.update(id, data);
      const updatedVisitor = await this.appointmentRepo.findOne({ where: { id } });
      if (!updatedVisitor) {
        throw new NotFoundException(`Visitor with ID ${id} not found`);
      }
      return updatedVisitor;
    } catch (error) {
      console.error('❌ Error updating visitor:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update visitor.');
    }
  }

  async deleteVisitor(id: number): Promise<void> {
    try {
      const visitor = await this.appointmentRepo.findOne({ where: { id } });
      if (!visitor) {
        throw new NotFoundException(`Visitor with ID ${id} not found`);
      }
      await this.appointmentRepo.delete(id);
    } catch (error) {
      console.error('❌ Error deleting visitor:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete visitor.');
    }
  }
}