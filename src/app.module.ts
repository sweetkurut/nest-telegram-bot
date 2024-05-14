import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
// import LocalSession from 'telegraf-session-local';f
import * as LocalSession from 'telegraf-session-local';
import { AppUpdate } from './app.update';
import { config } from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TaskEntity } from './task.entity';
config();

const session = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [session.middleware()],
      token: process.env.BOT_TOKEN,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'telegramBot-todo',
      entities: [join(__dirname + '/**/*.entity{.ts,.js}')],
      migrations: [join(__dirname + '/migrations/*{.ts,.js}')],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TaskEntity]),
  ],
  controllers: [],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
