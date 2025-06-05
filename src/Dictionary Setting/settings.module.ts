import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gender } from './gender/gender.entity';
import { GenderService } from './gender/gender.service';
import { GenderController } from './gender/gender.controller';
import { TimeDurationUnit } from './time-duration-unit/time-duration-unit.entity';
import { TimeDurationUnitService } from './time-duration-unit/time-duration-unit.service';
import { TimeDurationUnitController } from './time-duration-unit/time-duration-unit.controller';
import { VisitorType } from './visitor-type/visitor-type.entity';
import { VisitorTypeService } from './visitor-type/visitor-type.service';
import { VisitorTypeController } from './visitor-type/visitor-type.controller';
import { PurposeOfVisit } from './purpose-of-visit/purpose-of-visit.entity';
import { PurposeOfVisitService } from './purpose-of-visit/purpose-of-visit.service';
import { PurposeOfVisitController } from './purpose-of-visit/purpose-of-visit.controller';
import { Department } from './Department/department.entity';
import { DepartmentService } from './Department/department.service';
import { DepartmentController } from './Department/department.controller';
import { Designation } from './Designation/designation.entity';
import { DesignationService } from './Designation/designation.service';
import { DesignationController } from './Designation/designation.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Gender,
      TimeDurationUnit,
      VisitorType,
      PurposeOfVisit,
      Department,
      Designation
    ]),
  ],
  providers: [
    GenderService,
    TimeDurationUnitService,
    VisitorTypeService,
    PurposeOfVisitService,
    DepartmentService,
    DesignationService
  ],
  controllers: [
    GenderController,
    TimeDurationUnitController,
    VisitorTypeController,
    PurposeOfVisitController,
    DepartmentController,
    DesignationController
  ],
})
export class SettingsModule {}