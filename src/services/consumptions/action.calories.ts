import dayjs from 'dayjs';
import { z } from 'zod';

import { prisma } from '../../prisma';

import { parseDate } from './utils';

export const SetCaloriesSchema = z.object({
  date: z.string(),
  calories: z.coerce.number().min(1),
});

type SetCaloriesRequest = z.infer<typeof SetCaloriesSchema> & {
  userId: string;
};

export async function setCalories({ date: dateStr, calories, userId }: SetCaloriesRequest) {
  const date = parseDate(dateStr);

  await prisma.day.upsert({
    where: {
      userId_date: {
        userId,
        date: date.toISOString(),
      },
    },
    update: {
      calories,
    },
    create: {
      calories,
      userId,
      date: date.toISOString(),
    },
  });

  return `Saved ${calories} kcal for ${date.isSame(dayjs(), 'day') ? 'today' : date.format('L')}`;
}
