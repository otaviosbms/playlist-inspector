import { Module } from '@nestjs/common';
import { SpotifyModule } from './spotify/spotify.module';
import { AnalysisModule } from './analysis/analysis.module';
import { OpenaiModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.validation';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AppController as AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempData } from './models/entities/temp-data.entity';

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
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'playlist_inspector',
      entities: [TempData],
      synchronize: true, // use apenas em desenvolvimento
    }),
    SpotifyModule, AnalysisModule, OpenaiModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
