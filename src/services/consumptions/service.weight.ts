import dayjs from 'dayjs';
import { z } from 'zod';

import { createAction } from '../../controllers.model';
import { prisma } from '../../prisma';

import { parseDate } from './utils';

export const setWeight = createAction({
  command: 'setWeight',
  schema: z.object({
    weight: z.coerce.number().min(1),
    date: z.string(),
  }),
  argsTransformer: args => ({
    weight: args[0],
    date: args[1] || 'today',
  }),
  async handler({ data: { date: dateStr, weight }, user }) {
    const date = parseDate(dateStr);

    await prisma.consumption.upsert({
      where: {
        userId_date: {
          date: date.toISOString(),
          userId: user.id,
        },
      },
      update: {
        weight,
      },
      create: {
        weight,
        date: date.toISOString(),
        userId: user.id,
      },
    });

    return `Saved ${weight} kg for ${date.isSame(dayjs(), 'day') ? 'today' : date.format('L')}`;
  },
});
