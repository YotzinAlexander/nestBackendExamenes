import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  // TODO; RECUERDA PONER LOS ROLES CORRESPONDIENTES
  // @Auth(ValidRoles.admin,ValidRoles.superUser)

  @Post()
  create(@Body() createExamDto: CreateExamDto) {
    console.log(createExamDto);
    return this.examService.create(createExamDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.examService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examService.update(+id, updateExamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examService.remove(+id);
  }
}
