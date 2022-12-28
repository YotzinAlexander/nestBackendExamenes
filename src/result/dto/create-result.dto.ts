import { IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

export class CreateResultDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  result?: number;

  @IsString()
  idExamen: string;

  @IsString()
  idusuario: string;
}
