
import { Controller, Post, Body, Get, Query, UseInterceptors, UploadedFiles, InternalServerErrorException, BadRequestException, Param, Put, Patch, Res } from '@nestjs/common';
import { Appointment } from './appointment.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AppointmentService } from './appointment.service';
import { createReadStream } from 'fs';
import { join, relative } from 'path';
import { existsSync } from 'fs';
import { validate } from 'class-validator';
import { pagination } from '../appointment/appointment_dto/pagination.dto';
import { Response } from 'express';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

@Post('create')
@UseInterceptors(FileFieldsInterceptor([
  { name: 'photo', maxCount: 1 },
  { name: 'driverphoto', maxCount: 1 },
]))
async createOrUpdateAppointment(
  @Body() appointmentData: Partial<Appointment> & { durationUnit?: string },
  @UploadedFiles() files: { photo?: Express.Multer.File[]; driverphoto?: Express.Multer.File[] },
) {
  try {
    console.log('📥 Received appointmentData:', JSON.stringify(appointmentData, null, 2));
    console.log('📥 Multer photo path:', files?.photo?.[0]?.path);
    console.log('📥 Multer driverphoto path:', files?.driverphoto?.[0]?.path);

    if (!appointmentData.email || !appointmentData.date || !appointmentData.time) {
      throw new BadRequestException('Missing required fields: email, date, time');
    }

    const hasDriverDetails = appointmentData.drivername || appointmentData.drivermobile || appointmentData.drivernationalid;
    if (hasDriverDetails && !files?.driverphoto?.[0]) {
      throw new BadRequestException('Driver photo is required when driver details are provided');
    }

    // Normalize personname and department to ensure they are single strings
    const normalizeField = (field: string | string[] | undefined | null): string => {
      if (field === undefined || field === null) return '';
      if (Array.isArray(field)) {
        if (field.length === 0) return '';
        if (field.length > 1) {
          console.warn(`⚠️ Duplicate values detected for field: ${field}. Using the first value.`);
          return field[0]; // Use the first value if duplicates exist
        }
        return field[0]; // Use the single value if array has one element
      }
      return field; // Return as-is if it's a string
    };

    appointmentData.personname = normalizeField(appointmentData.personname);
    appointmentData.department = normalizeField(appointmentData.department);

    // Log the normalized data to confirm
    console.log('📋 Normalized appointmentData:', JSON.stringify(appointmentData, null, 2));

    const photoPath = files?.photo?.[0]?.path ? relative(process.cwd(), files.photo[0].path) : undefined;
    const driverPhotoPath = files?.driverphoto?.[0]?.path ? relative(process.cwd(), files.driverphoto[0].path) : undefined;

    const mappedData = {
      ...appointmentData,
      durationunit: appointmentData.durationUnit || appointmentData.durationunit,
      photo: photoPath,
      driverphoto: driverPhotoPath,
    };
    delete mappedData.durationUnit;

    const result = await this.appointmentService.createOrUpdateAppointment(mappedData);
    console.log('📤 Returning created/updated appointment:', JSON.stringify(result, null, 2));
    return {
      ...result,
      photo: result.photo ? `/uploads/${result.photo.split('/').pop()}` : null,
      driverphoto: result.driverphoto ? `/uploads/${result.driverphoto.split('/').pop()}` : null,
    };
  } catch (error) {
    console.error('❌ Controller error in createOrUpdateAppointment:', error);
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to process appointment: ' + error.message);
  }
}

  @Get()
  async getAppointments(
    @Query('email') email?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      console.log('📋 GET /appointment called with:', { email, page, limit });

      if (email) {
        console.log(`📋 Fetching appointments for email: ${email}`);
        const appointments = await this.appointmentService.getAppointmentsByEmail(email);
        const mappedAppointments = appointments.map(appointment => ({
          ...appointment,
          photo: appointment.photo ? `/uploads/${appointment.photo.split('/').pop()}` : null,
          driverphoto: appointment.driverphoto ? `/uploads/${appointment.driverphoto.split('/').pop()}` : null,
        }));
        console.log('📤 Returning appointments for email:', JSON.stringify(mappedAppointments, null, 2));
        return mappedAppointments;
      } else {
        console.log('📋 Fetching all appointments with pagination');
        const paginationDto = new pagination();
        paginationDto.page = page && !isNaN(parseInt(page, 10)) ? parseInt(page, 10) : 0;
        paginationDto.limit = limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 0;

        if (paginationDto.page || paginationDto.limit) {
          console.log('📋 Validating pagination DTO:', JSON.stringify(paginationDto, null, 2));
          const errors = await validate(paginationDto);
          if (errors.length > 0) {
            console.error('❌ Pagination validation errors:', errors);
            throw new BadRequestException('Invalid pagination parameters');
          }
        } else {
          console.log('📋 No pagination parameters provided, fetching all appointments');
        }

        const { appointments, total } = await this.appointmentService.getAllAppointments(paginationDto);
        const mappedAppointments = appointments.map(appointment => ({
          ...appointment,
          photo: appointment.photo ? `/uploads/${appointment.photo.split('/').pop()}` : null,
          driverphoto: appointment.driverphoto ? `/uploads/${appointment.driverphoto.split('/').pop()}` : null,
        }));
        console.log(`📤 Returning ${mappedAppointments.length} appointments, total: ${total}`);

        if (!paginationDto.page && !paginationDto.limit) {
          return mappedAppointments;
        }

        return {
          data: mappedAppointments,
          total,
          page: paginationDto.page || 1,
          limit: paginationDto.limit || 10,
        };
      }
    } catch (error) {
      console.error('❌ Controller error in getAppointments:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve appointments: ' + error.message);
    }
  }

  @Get('contactnumber/:contactnumber')
  async getAppointmentByContactNumber(@Param('contactnumber') contactnumber: string) {
    try {
      console.log(`📋 Fetching appointment with contactnumber: ${contactnumber}`);
      const appointment = await this.appointmentService.getAppointmentByContactNumber(contactnumber);
      if (!appointment) {
        throw new BadRequestException('Appointment not found');
      }
      const mappedAppointment = {
        ...appointment,
        photo: appointment.photo ? `/uploads/${appointment.photo.split('/').pop()}` : null,
        driverphoto: appointment.driverphoto ? `/uploads/${appointment.driverphoto.split('/').pop()}` : null,
      };
      console.log('📤 Returning appointment:', JSON.stringify(mappedAppointment, null, 2));
      return mappedAppointment;
    } catch (error) {
      console.error('❌ Controller error in getAppointmentByContactNumber:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve appointment: ' + error.message);
    }
  }

  @Get(':id')
  async getAppointmentById(@Param('id') id: string) {
    try {
      console.log(`📋 Fetching appointment with ID: ${id}`);
      const appointment = await this.appointmentService.getAppointmentById(id);
      if (!appointment) {
        throw new BadRequestException('Appointment not found');
      }
      const mappedAppointment = {
        ...appointment,
        photo: appointment.photo ? `/uploads/${appointment.photo.split('/').pop()}` : null,
        driverphoto: appointment.driverphoto ? `/uploads/${appointment.driverphoto.split('/').pop()}` : null,
      };
      console.log('📤 Returning appointment:', JSON.stringify(mappedAppointment, null, 2));
      return mappedAppointment;
    } catch (error) {
      console.error('❌ Controller error in getAppointmentById:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve appointment: ' + error.message);
    }
  }

  @Get(':id/photo')
  async getAppointmentPhoto(
    @Param('id') id: string,
    @Query('type') type: 'photo' | 'driverphoto',
    @Res() res: Response,
  ) {
    try {
      const appointment = await this.appointmentService.getAppointmentById(id);
      if (!appointment) {
        throw new BadRequestException('Appointment not found');
      }

      const photoPath = type === 'photo' ? appointment.photo : appointment.driverphoto;
      console.log(`📸 Streaming ${type} from path: ${photoPath}`);
      if (!photoPath) {
        console.log(`📸 No ${type} found, serving placeholder`);
        const placeholderPath = join(process.cwd(), 'public/assets/placeholder.jpg');
        const file = createReadStream(placeholderPath);
        res.set({
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `inline; filename="placeholder.jpg"`,
        });
        file.pipe(res);
        return;
      }

      const absolutePath = join(process.cwd(), photoPath);
      if (!existsSync(absolutePath)) {
        console.warn(`📸 File not found at ${absolutePath}, serving placeholder`);
        const placeholderPath = join(process.cwd(), 'public/assets/placeholder.jpg');
        const file = createReadStream(placeholderPath);
        res.set({
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `inline; filename="placeholder.jpg"`,
        });
        file.pipe(res);
        return;
      }

      const file = createReadStream(absolutePath);
      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `inline; filename="${type}-${id}.jpg"`,
      });
      file.pipe(res);
    } catch (error) {
      console.error('❌ Controller error in getAppointmentPhoto:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve photo');
    }
  }

  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'photo', maxCount: 1 },
    { name: 'driverphoto', maxCount: 1 },
  ]))
  async updateAppointment(
    @Param('id') id: string,
    @Body() appointmentData: Partial<Appointment> & { durationUnit?: string },
    @UploadedFiles() files: { photo?: Express.Multer.File[]; driverphoto?: Express.Multer.File[] },
  ) {
    try {
      console.log('📥 Received appointmentData:', JSON.stringify(appointmentData, null, 2));
      console.log('📥 Received files:', JSON.stringify(files, null, 2));

      const hasDriverDetails = appointmentData.drivername || appointmentData.drivermobile || appointmentData.drivernationalid;
      const existingAppointment = await this.appointmentService.getAppointmentById(id);
      if (hasDriverDetails && !files?.driverphoto?.[0] && !existingAppointment.driverphoto) {
        throw new BadRequestException('Driver photo is required when driver details are provided');
      }

      const photoPath = files?.photo?.[0]?.path ? relative(process.cwd(), files.photo[0].path) : appointmentData.photo || existingAppointment.photo;
      const driverPhotoPath = files?.driverphoto?.[0]?.path ? relative(process.cwd(), files.driverphoto[0].path) : appointmentData.driverphoto || existingAppointment.driverphoto;

      const mappedData = {
        ...appointmentData,
        durationunit: appointmentData.durationUnit || appointmentData.durationunit,
        photo: photoPath,
        driverphoto: driverPhotoPath,
      };
      delete mappedData.durationUnit;

      const updatedAppointment = await this.appointmentService.updateAppointment(id, mappedData);
      console.log('📤 Returning updated appointment:', JSON.stringify(updatedAppointment, null, 2));
      return {
        ...updatedAppointment,
        photo: updatedAppointment.photo ? `/uploads/${updatedAppointment.photo.split('/').pop()}` : '',
        driverphoto: updatedAppointment.driverphoto ? `/uploads/${updatedAppointment.driverphoto.split('/').pop()}` : '',
      };
    } catch (error) {
      console.error('❌ Controller error in updateAppointment:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update appointment: ' + error.message);
    }
  }

  @Put(':id/text-update')
  async updateAppointmentText(
    @Param('id') id: string,
    @Body() appointmentData: Partial<Appointment> & { durationUnit?: string },
  ) {
    try {
      console.log('📥 Received text update data:', JSON.stringify(appointmentData, null, 2));

      const mappedData = {
        ...appointmentData,
        durationunit: appointmentData.durationUnit || appointmentData.durationunit,
      };
      delete mappedData.durationUnit;

      const updatedAppointment = await this.appointmentService.updateAppointment(id, mappedData);
      console.log('📤 Returning updated appointment:', JSON.stringify(updatedAppointment, null, 2));
      return {
        ...updatedAppointment,
        photo: updatedAppointment.photo ? `/uploads/${updatedAppointment.photo.split('/').pop()}` : '',
        driverphoto: updatedAppointment.driverphoto ? `/uploads/${updatedAppointment.driverphoto.split('/').pop()}` : '',
      };
    } catch (error) {
      console.error('❌ Controller error in updateAppointmentText:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update appointment: ' + error.message);
    }
  }

  @Patch(':id/gatepass')
  async updateGatepassStatus(
    @Param('id') id: string,
  ) {
    try {
      const updatedAppointment = await this.appointmentService.updateGatepassStatus(id);
      console.log('📤 Returning updated appointment:', JSON.stringify(updatedAppointment, null, 2));
      return {
        ...updatedAppointment,
        photo: updatedAppointment.photo ? `/uploads/${updatedAppointment.photo.split('/').pop()}` : '',
        driverphoto: updatedAppointment.driverphoto ? `/uploads/${updatedAppointment.driverphoto.split('/').pop()}` : '',
      };
    } catch (error) {
      console.error('❌ Controller error in updateGatepassStatus:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update gatepass status');
    }
  }

  @Patch('nda')
  async updateNdaStatus(
    @Body() body: { email: string; date: string; time: string; ndaApproved: boolean },
  ) {
    try {
      console.log('📥 Received NDA update data:', JSON.stringify(body, null, 2));
      const updatedAppointment = await this.appointmentService.updateNdaStatus(
        body.email,
        body.date,
        body.time,
        body.ndaApproved,
      );
      console.log('📤 Returning updated appointment:', JSON.stringify(updatedAppointment, null, 2));
      return {
        ...updatedAppointment,
        photo: updatedAppointment.photo ? `/uploads/${updatedAppointment.photo.split('/').pop()}` : null,
        driverphoto: updatedAppointment.driverphoto ? `/uploads/${updatedAppointment.driverphoto.split('/').pop()}` : '',
      };
    } catch (error) {
      console.error('❌ Controller error in updateNdaStatus:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update NDA status: ' + error.message);
    }
  }

  @Patch('safety')
  async updateSafetyStatus(
    @Body() body: { email: string; date: string; time: string; SaftyApproval: boolean },
  ) {
    try {
      console.log('📥 Received safety acknowledgment update data:', JSON.stringify(body, null, 2));
      const updatedAppointment = await this.appointmentService.updateSafetyStatus(
        body.email,
        body.date,
        body.time,
        body.SaftyApproval,
      );
      console.log('📤 Returning updated appointment:', JSON.stringify(updatedAppointment, null, 2));
      return {
        ...updatedAppointment,
        photo: updatedAppointment.photo ? `/uploads/${updatedAppointment.photo.split('/').pop()}` : null,
        driverphoto: updatedAppointment.driverphoto ? `/uploads/${updatedAppointment.driverphoto.split('/').pop()}` : '',
      };
    } catch (error) {
      console.error('❌ Controller error in updateSafetyStatus:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update safety acknowledgment status: ' + error.message);
    }
  }


@Patch(':id/status/:status')
async updateStatus(
  @Param('id') id: string,
  @Param('status') status: string,
  @Body() body: { sendEmail?: boolean; complete?: boolean; exit?: boolean }
): Promise<Appointment>{
  try {
    console.log(`📋 Updating status for appointment ID: ${id} to: ${status}, body:`, JSON.stringify(body, null, 2));
    const updatedAppointment = await this.appointmentService.updateStatus(id, status, { complete: body.complete, exit: body.exit });
    console.log('📤 Returning updated appointment:', JSON.stringify(updatedAppointment, null, 2));
    return {
      ...updatedAppointment,
      photo: updatedAppointment.photo && typeof updatedAppointment.photo === 'string' && updatedAppointment.photo.trim() !== ''
        ? `/uploads/${updatedAppointment.photo.split(/[\\/]/).pop()}`
        : '',
      driverphoto: updatedAppointment.driverphoto && typeof updatedAppointment.driverphoto === 'string' && updatedAppointment.driverphoto.trim() !== ''
        ? `/uploads/${updatedAppointment.driverphoto.split(/[\\/]/).pop()}`
        : '',
    };
  } catch (error) {
    console.error('❌ Controller error in updateStatus:', error);
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new InternalServerErrorException(`Failed to update status: ${error.message}`);
  }
}

  @Get('check-status')
  async checkFormStatus(
    @Query('email') email: string,
    @Query('date') date: string,
    @Query('time') queryTime: string,
  ) {
    try {
      if (!email || !date || !queryTime) {
        throw new BadRequestException('Missing required query parameters: email, date, time');
      }
      const isFormCompleted = await this.appointmentService.checkFormStatus(email, date, queryTime);
      console.log(`📤 Returning form status: ${isFormCompleted}`);
      return { isFormCompleted };
    } catch (error) {
      console.error('❌ Controller error in checkFormStatus:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to check form status');
    }
  }
}