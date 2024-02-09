import * as dotenv from 'dotenv';
import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'typegram';

import { addCommands } from './controllers';
import { createUser, getUserOrThrow } from './services/user';

dotenv.config();

const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN);

bot.start(async ctx => {
  try {
    await getUserOrThrow(ctx.from);
  } catch (e) {
    await createUser(ctx.from);
  }

  ctx.reply('Hello ' + ctx.from.first_name + '!');
});

bot.command('keyboard', ctx => {
  ctx.reply(
    'Keyboard',
    Markup.inlineKeyboard([
      Markup.button.callback('First option', 'first'),
      Markup.button.callback('Second option', 'second'),
    ]),
  );
});

addCommands(bot);

bot.telegram.setWebhook(process.env.BOT_URL, {
  secret_token: process.env.SECRET_TOKEN,
});

bot.launch();
