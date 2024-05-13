import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
// import LocalSession from 'telegraf-session-local';f
import * as LocalSession from 'telegraf-session-local';
import { AppUpdate } from './app.update';
import { config } from 'dotenv';
config();

const session = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [session.middleware()],
      token: process.env.BOT_TOKEN,
    }),
  ],
  // controllers: [],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
