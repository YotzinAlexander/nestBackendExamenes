//Es neceario agregar el Clas Validator
//yarn and class-validator class-transformer

import { IsString, MinLength } from 'class-validator';

export class CreateExamDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  data: string;
}
