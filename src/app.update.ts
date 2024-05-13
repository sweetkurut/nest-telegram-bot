import {
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { AppService } from './app.service';
import { actionButtons } from './app.button';

const todos = [
  {
    id: 1,
    title: 'Go to walk',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'Do homework',
    isCompleted: false,
  },
  {
    id: 3,
    title: 'Go to GYM 💪',
    isCompleted: true,
  },
];

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi Friend ✌️');
    await ctx.reply('Что ты хочешь сделать?', actionButtons());
  }

  @Hears('📋 Список задач')
  async listTask(@Ctx() ctx: Context) {
    await ctx.reply(`Ваш список задач \n\n${todos.map((todo) => (todo.isCompleted ? '✅' : '❌') + ' ' + todo.title + '\n\n').join(' ')}
    `);
  }
  @Hears('✅ Завершить')
  async doneTask(@Ctx() ctx: Context) {
    await ctx.reply('Напишите ID задачи: ');
  }

  @On('text')
  async getIdtask(@Message('text') idTask: string, ctx: Context) {
    
  }
}
