import dayjs from 'dayjs';
import { z } from 'zod';

import { prisma } from '../../prisma';

import { parseDate } from './utils';

export const SetWeightSchema = z.object({
  weight: z.coerce.number().min(1),
  date: z.string(),
});

type SetWeightRequest = z.infer<typeof SetWeightSchema> & {
  userId: string;
};

export async function setWeight({ weight, date: dateStr, userId }: SetWeightRequest) {
  const date = parseDate(dateStr);

  await prisma.day.upsert({
    where: {
      userId_date: {
        userId,
        date: date.toISOString(),
      },
    },
    update: {
      weight,
    },
    create: {
      weight,
      userId,
      date: date.toISOString(),
    },
  });

  return `Saved ${weight} kg for ${date.isSame(dayjs(), 'day') ? 'today' : date.format('L')}`;
}
