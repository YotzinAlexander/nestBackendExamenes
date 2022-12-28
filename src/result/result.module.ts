import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';

@Module({
  controllers: [ResultController],
  providers: [ResultService],
  imports: [TypeOrmModule.forFeature([Result])],
})
export class ResultModule {}
