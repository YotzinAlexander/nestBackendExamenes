import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';

@Module({
  controllers: [ExamController],
  providers: [ExamService],
  imports: [TypeOrmModule.forFeature([Exam])], //importar siempre la entidad para que se cree la Tabla
  exports: [ExamService, TypeOrmModule],
})
export class ExamModule {}
