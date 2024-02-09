import { User } from '@prisma/client';
import { Context as BaseContext, NarrowedContext } from 'telegraf';
import { Message, Update } from 'telegraf/typings/core/types/typegram';
import { ZodSchema } from 'zod';

export interface Context<T> {
  data: T;
  user: User;
}

type TelegramContext = NarrowedContext<
  BaseContext<Update>,
  {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
  }
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Action<TData extends Record<string, any>> = {
  command: string;
  schema: ZodSchema<TData>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  argsTransformer(args: string[]): Record<keyof TData, any>; // FIXME: use zod input type
  handler(ctx: TelegramContext, args: Context<TData>): Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAction<TData extends Record<string, any>>(action: Action<TData>) {
  return action;
}
