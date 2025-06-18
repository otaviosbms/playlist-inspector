import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpotifyModule } from './spotify/spotify.module';
import { AnalysisModule } from './analysis/analysis.module';
import { OpenaiModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const parsed = envSchema.safeParse(config);

        if (!parsed.success) {
          console.error('Erro ao validar variáveis de ambiente:');
          console.error(parsed.error.format());
          process.exit(1);
        }

        return parsed.data;
      },
    }),
    SpotifyModule, AnalysisModule, OpenaiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
