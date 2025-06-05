import { Controller, Post, Body, UploadedFiles, UseInterceptors, BadRequestException, Get, Param, Patch, Delete, NotFoundException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './CreateVisitor.dto';
import { extname } from 'path';
import { Visitor } from './visitor.entity';

@Controller('visitors')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photoFile', maxCount: 1 },
      { name: 'driverPhotoFile', maxCount: 1 },
    ], {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const prefix = file.fieldname === 'photoFile' ? 'photo' : 'driverphoto';
          cb(null, `${prefix}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFiles() files: { photoFile?: Express.Multer.File[]; driverPhotoFile?: Express.Multer.File[] },
  ) {
    console.log('Received body (raw):', body);
    const firstname = body.firstname || body.Firstname || '';

    console.log('Received files:', {
      photoFile: files.photoFile?.map(f => f.filename),
      driverPhotoFile: files.driverPhotoFile?.map(f => f.filename),
    });

    const visitorData: CreateVisitorDto = {
      firstname: firstname,
      lastname: body.lastname,
      gender: body.gender,
      contactnumber: body.contactnumber,
      email: body.email,
      date: body.date,
      time: body.time,
      nationalid: body.nationalid,
      photo: files.photoFile && files.photoFile[0] ? files.photoFile[0].filename : body.photo,
      visit: body.visit,
      personname: body.personname,
      department: body.department,
      durationtime: body.durationtime,
      durationunit: body.durationunit,
      visitortype: body.visitortype,
      vehicletype: body.vehicletype,
      vehiclenumber: body.vehiclenumber,
      drivername: body.drivername,
      drivermobile: body.drivermobile,
      drivernationalid: body.drivernationalid,
      driverphoto: files.driverPhotoFile && files.driverPhotoFile[0] ? files.driverPhotoFile[0].filename : body.driverphoto,
      notes: body.notes,
      isApproved: body.isApproved === 'true' || false,
      inprogress: body.inprogress === 'true' || false,
      complete: body.complete === 'true' || false,
      exit: body.exit === 'true' || false,
    };

    console.log('Mapped DTO:', visitorData);

    if (!visitorData.firstname || visitorData.firstname.trim() === '') {
      throw new BadRequestException('Firstname is required');
    }
    if (!visitorData.email || visitorData.email.trim() === '') {
      throw new BadRequestException('Email is required');
    }
    if (!visitorData.photo || visitorData.photo.trim() === '') {
      throw new BadRequestException('Photo is required');
    }

    return this.visitorService.create(visitorData);
  }

  @Get()
  async findAll() {
    return this.visitorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.visitorService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photoFile', maxCount:1 },
      { name: 'driverPhotoFile', maxCount: 1 },
    ], {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const prefix = file.fieldname === 'photoFile' ? 'photo' : 'driverphoto';
          const originalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
          cb(null, `${prefix}-${uniqueSuffix}-${originalName}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() body: Partial<CreateVisitorDto>,
    @UploadedFiles() files: { photoFile?: Express.Multer.File[]; driverPhotoFile?: Express.Multer.File[] },
  ) {
    console.log('Received body for PATCH:', body);
    console.log('Received files for PATCH:', {
      photoFile: files.photoFile?.map(f => f.filename),
      driverPhotoFile: files.driverPhotoFile?.map(f => f.filename),
    });

    const existingVisitor = await this.visitorService.findOne(id);

    const visitorData: Partial<CreateVisitorDto> = {
      ...body,
      photo: files.photoFile && files.photoFile[0] ? files.photoFile[0].filename : body.photo || existingVisitor.photo,
      driverphoto: files.driverPhotoFile && files.driverPhotoFile[0] ? files.driverPhotoFile[0].filename : (body.driverphoto || ((body as any).driverToggle === 'true' ? existingVisitor.driverphoto : undefined)),
      isApproved: body.isApproved !== undefined ? (typeof body.isApproved === 'string' ? body.isApproved === 'true' : body.isApproved) : existingVisitor.isApproved,
      inprogress: body.inprogress !== undefined ? (typeof body.inprogress === 'string' ? body.inprogress === 'true' : body.inprogress) : existingVisitor.inprogress,
      complete: body.complete !== undefined ? (typeof body.complete === 'string' ? body.complete === 'true' : body.complete) : existingVisitor.complete,
      exit: body.exit !== undefined ? (typeof body.exit === 'string' ? body.exit === 'true' : body.exit) : existingVisitor.exit,
    };

    console.log('Mapped DTO for PATCH:', visitorData);

    if (!Object.keys(body).length && !files.photoFile && !files.driverPhotoFile) {
      throw new BadRequestException('At least one field must be provided for update');
    }

    return this.visitorService.update(id, visitorData);
  }

  @Patch(':id/status/:status')
  async updateStatus(@Param('id') id: number, @Param('status') status: string) {
    return this.visitorService.updateStatus(id, status);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.visitorService.remove(id);
  }

  @Get('nationalid/:nationalid')
  async findByNationalId(@Param('nationalid') nationalid: string): Promise<Visitor> {
    try {
      return await this.visitorService.findByNationalId(nationalid);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Failed to fetch visitor with national ID ${nationalid}`);
    }
  }
}