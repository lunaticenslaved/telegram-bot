import * as dotenv from 'dotenv';
import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'typegram';

import { addWeight } from './weight';

dotenv.config();

console.log(process.env.BOT_URL, process.env.SECRET_TOKEN);

const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => {
  ctx.reply('Hello ' + ctx.from.first_name + '!');
});

bot.help(ctx => {
  ctx.reply('Send /start to receive a greeting');
  ctx.reply('Send /keyboard to receive a message with a keyboard');
  ctx.reply('Send /quit to stop the bot');
});

bot.command('quit', ctx => {
  // Explicit usage
  ctx.telegram.leaveChat(ctx.message.chat.id);
  // Context shortcut
  ctx.leaveChat();
});

bot.command('addWeight', async ctx => {
  const args = ctx.update.message.text.split(' ').slice(1);

  try {
    const response = await addWeight(args, ctx.update.message.from);
    ctx.reply(response);
  } catch (error) {
    ctx.reply((error as Error).message);
  }
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

bot.telegram.setWebhook(process.env.BOT_URL, {
  secret_token: process.env.SECRET_TOKEN,
});

bot.launch();
