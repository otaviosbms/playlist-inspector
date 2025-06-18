import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { SpotifyModule } from '../spotify/spotify.module';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  providers: [AnalysisService],
  controllers: [AnalysisController],
  imports: [SpotifyModule, OpenaiModule]
})
export class AnalysisModule {}
