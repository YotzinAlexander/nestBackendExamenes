import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { DataSource, Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { isUUID } from 'class-validator';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ResultService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createResultDto: CreateResultDto) {
    try {
      const result = this.resultRepository.create(createResultDto);
      await this.resultRepository.save(result);

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Ayuda');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const exams = await this.resultRepository.find({
        take: limit,
        skip: offset,
      });

      return exams;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    try {
      let result: Result;
      const queryBuilder = this.resultRepository.createQueryBuilder('result');

      isUUID(id)
        ? (result = await this.resultRepository.findOneBy({ id: id }))
        : (result = await queryBuilder
            .where('result =:result', { result: id })
            .getOne());

      if (!result) {
        throw new NotFoundException(`Product with id ${id} not found!`);
      }
      return result;
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, updateResultDto: UpdateResultDto) {
    console.log('uptade');

    const { ...toUpdate } = updateResultDto;
    const resultado = await this.resultRepository.preload({ id, ...toUpdate });

    if (!resultado)
      throw new NotFoundException(`Result with id:${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //resultado.result = result;
      await queryRunner.manager.save(resultado);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      console.log('errror');
      this.handleDBExceptions(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} result`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
