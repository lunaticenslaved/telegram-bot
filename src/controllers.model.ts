import { User } from '@prisma/client';
import { ZodSchema } from 'zod';

export interface Context<T> {
  data: T;
  user: User;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Action<TData extends Record<string, any>> = {
  command: string;
  schema: ZodSchema<TData>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  argsTransformer(args: string[]): Record<keyof TData, any>; // FIXME: use zod input type
  handler(context: Context<TData>): Promise<string>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAction<TData extends Record<string, any>>(action: Action<TData>) {
  return action;
}
