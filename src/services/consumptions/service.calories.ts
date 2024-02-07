import dayjs from 'dayjs';
import { z } from 'zod';

import { createAction } from '../../controllers.model';
import { prisma } from '../../prisma';

import { parseDate } from './utils';

export const setCalories = createAction({
  command: 'setCalories',
  schema: z.object({
    date: z.string(),
    calories: z.coerce.number().min(1),
  }),
  argsTransformer: args => ({
    calories: args[0],
    date: args[1] || 'today',
  }),
  async handler({ data: { date: dateStr, calories }, user }) {
    const date = parseDate(dateStr);

    await prisma.consumption.upsert({
      where: {
        userId_date: {
          date: date.toISOString(),
          userId: user.id,
        },
      },
      update: {
        calories,
      },
      create: {
        calories,
        date: date.toISOString(),
        userId: user.id,
      },
    });

    return `Saved ${calories} kcal for ${date.isSame(dayjs(), 'day') ? 'today' : date.format('L')}`;
  },
});
