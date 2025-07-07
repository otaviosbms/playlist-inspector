import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { SpotifyModule } from '../spotify/spotify.module';
import { OpenaiModule } from '../openai/openai.module';
import { TempData } from '../models/entities/temp-data.entity';

@Module({
  imports: [
    SpotifyModule,
    OpenaiModule,
    TypeOrmModule.forFeature([TempData]),
  ],
  providers: [AnalysisService],
  controllers: [AnalysisController],
})
export class AnalysisModule { }
