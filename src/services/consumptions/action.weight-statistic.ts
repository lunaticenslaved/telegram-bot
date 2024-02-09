import { prisma } from '../../prisma';

import { parseDate } from './utils';

type UpsertStatisticRequest = {
  date: string;
  userId: string;
};

export async function upsertStatistic({ date, userId }: UpsertStatisticRequest) {
  const week = parseDate(date);
  const startAt = week.startOf('week').toISOString();
  const endAt = week.endOf('week').toISOString();

  const days = await prisma.day.findMany({
    where: {
      AND: [{ date: { gte: startAt } }, { date: { lte: endAt } }],
      userId,
    },
  });

  const { weight } =
    days.sort((a, b) => {
      if (!b.weight) return 1;
      if (!a.weight) return -1;

      return a.weight - b.weight;
    })[Math.floor(days.length / 2)] || {};

  await prisma.weightStatistic.upsert({
    where: {
      userId_startAt_endAt: {
        userId,
        endAt,
        startAt,
      },
    },
    create: {
      weight,
      startAt,
      endAt,
      userId,
      days: {
        connect: days.map(day => ({ id: day.id })),
      },
    },
    update: {
      weight,
      days: {
        connect: days.map(day => ({ id: day.id })),
      },
    },
  });
}
