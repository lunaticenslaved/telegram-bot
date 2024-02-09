import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

import { commands } from './services';
import { getUserOrThrow } from './services/user';

export function addCommands(bot: Telegraf<Context<Update>>) {
  for (const { command, schema, argsTransformer, handler } of commands) {
    bot.command(command, async ctx => {
      try {
        const args = ctx.update.message.text.split(' ').slice(1);
        const data = schema.parse(argsTransformer(args));
        const user = await getUserOrThrow(ctx.from);

        await handler(ctx, { data, user });
      } catch (error) {
        ctx.reply((error as Error).message);
      }
    });
  }
}
