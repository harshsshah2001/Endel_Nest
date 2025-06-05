

import { BadRequestException, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { MailModule } from '../mail/mail.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { VisitorMailService } from './visitor-mail/visitor-mail.service';
import { MasterRecordModule } from 'src/MasterRecord/master-record.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    MailModule,
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'src/uploads'), // Align with main.ts
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        console.log('📥 Multer received file:', {
          fieldname: file.fieldname,
          mimetype: file.mimetype,
          originalname: file.originalname,
        });
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new BadRequestException('Only image files (jpg, jpeg, png) are allowed'), false);
        }
        if (!['photo', 'driverphoto'].includes(file.fieldname)) {
          return callback(new BadRequestException(`Invalid field name: ${file.fieldname}`), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
    MasterRecordModule
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService, VisitorMailService],
})
export class AppointmentModule {}