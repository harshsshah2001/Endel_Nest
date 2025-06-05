import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visitor } from './visitor.entity';
import { VisitorService } from './visitor.service';
import { VisitorController } from './visitor.controller';
import { VisitorMailModule } from './mail/visitormail.module';
import { MasterRecordModule } from 'src/MasterRecord/master-record.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Visitor]),
    VisitorMailModule,
    MasterRecordModule // Use the new mail module
  ],
  providers: [VisitorService],
  controllers: [VisitorController],
})
export class VisitorModule { }
