import {
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { AppService } from './app.service';
import { actionButtons } from './app.button';
import { Context } from './context.interface';
import { showList } from './app.utils';

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

  @Hears('📌 Создать задачу')
  async createTask(@Ctx() ctx: Context) {
    await ctx.reply('Опиши задачу');
    ctx.session.type = 'create';
  }

  @Hears('📋 Список задач')
  async listTask(@Ctx() ctx: Context) {
    const todos = await this.appService.getAll();
    await ctx.reply(showList(todos));
  }

  @Hears('✅ Завершить')
  async doneTask(@Ctx() ctx: Context) {
    await ctx.reply('Напишите ID задачи: ');
    ctx.session.type = 'done';
  }

  @Hears('🖋️ Редактирование')
  async editTask(@Ctx() ctx: Context) {
    ctx.session.type = 'edit';
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      'Напишите ID и новое название задачи: \n\n' +
        'В формате - <b>1 | Новое название</b>',
    );
  }

  @Hears('❌ Удаление')
  async deleteTask(@Ctx() ctx: Context) {
    await ctx.reply('Напишите ID задачи: ');
    ctx.session.type = 'remove';
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    console.log('Received message:', message); // Логирование для отладки
    let todos;

    try {
      if (ctx.session.type === 'create') {
        todos = await this.appService.createTask(message);
      } else if (ctx.session.type === 'done') {
        todos = await this.appService.doneTask(Number(message));
      } else if (ctx.session.type === 'edit') {
        const [taskId, taskName] = message.split(' | ');
        todos = await this.appService.editTask(Number(taskId), taskName);
      } else if (ctx.session.type === 'remove') {
        todos = await this.appService.deleteTask(Number(message));
      }

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Задача с таким ID не найдена');
      } else {
        console.log('Todos after operation:', todos); // Логирование для отладки
        await ctx.reply(showList(todos));
      }
    } catch (error) {
      console.error('Error handling message:', error);
      await ctx.reply(
        'Произошла ошибка при обработке задачи. Пожалуйста, попробуйте еще раз.',
      );
    }

    ctx.session.type = undefined;
  }
}
