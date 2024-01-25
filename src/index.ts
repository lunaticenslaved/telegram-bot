import * as dotenv from 'dotenv'
import { Context, Markup, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { Update } from 'typegram';

dotenv.config();

const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Hello ' + ctx.from.first_name + '!');
});

bot.help((ctx) => {
  ctx.reply('Send /start to receive a greeting');
  ctx.reply('Send /keyboard to receive a message with a keyboard');
  ctx.reply('Send /quit to stop the bot');
});

bot.command('quit', (ctx) => {
  // Explicit usage
  ctx.telegram.leaveChat(ctx.message.chat.id);
    // Context shortcut
  ctx.leaveChat();
});

bot.command('keyboard', (ctx) => {
  ctx.reply(
    'Keyboard',
    Markup.inlineKeyboard([
      Markup.button.callback('First option', 'first'),
      Markup.button.callback('Second option', 'second'),
    ])
  );
});

bot.on(message('text'), (ctx) => {
  ctx.reply(
    'You choose the ' +
      (ctx.message.text === 'first' ? 'First' : 'Second') +
      ' Option!'
  );
});

bot.telegram.setWebhook(
  process.env.BOT_URL,
  {
    secret_token: process.env.SECRET_TOKEN
  }
);

bot.launch();
