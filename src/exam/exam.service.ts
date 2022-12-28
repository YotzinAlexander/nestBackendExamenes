import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}

  async create(createExamDto: CreateExamDto) {
    try {
      const exam = this.examRepository.create(createExamDto);
      await this.examRepository.save(exam);
      return exam;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Ayuda');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const exams = await this.examRepository.find({
        take: limit,
        skip: offset,
      });

      return exams;
    } catch (error) {
      console.log(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} exam`;
  }

  update(id: number, updateExamDto: UpdateExamDto) {
    return `This action updates a #${id} exam`;
  }

  remove(id: number) {
    return `This action removes a #${id} exam`;
  }
}
