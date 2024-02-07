import dayjs from 'dayjs';
import { User } from 'telegraf/typings/core/types/typegram';
import { z } from 'zod';

import { prisma } from './prisma';

export async function getUserOrThrow(user: User) {
  const savedUser = await prisma.user.findUnique({
    where: {
      telegramId: user.id,
    },
  });

  if (!savedUser) {
    throw new Error('User not found!');
  }

  return savedUser;
}

export async function createUser(user: User) {
  if (user.is_bot) {
    throw new Error('Bots not allowed');
  }

  await prisma.user.create({
    data: {
      telegramId: user.id,
    },
  });
}

const schema = z.object({
  weight: z.coerce.number().min(1),
  date: z.string(),
});

function parseDate(str: string) {
  if (str === 'today') {
    return dayjs();
  }

  if (str === 'yesterday') {
    return dayjs().subtract(1, 'day');
  }

  const date = dayjs(str);

  if (!date.isValid()) {
    throw new Error('Invalid date');
  }

  return date;
}

export async function addWeight(args: string[], from: User): Promise<string> {
  const user = await getUserOrThrow(from);

  if (!args.length) {
    throw new Error('Pass args like <weight> <date?>');
  }

  const { weight, date: dateStr } = schema.parse({
    weight: args[0],
    date: args[1] || 'today',
  });

  const date = parseDate(dateStr).startOf('day');

  await prisma.weight.upsert({
    where: {
      userId_date: {
        date: date.toISOString(),
        userId: user.id,
      },
    },
    update: {
      value: weight,
    },
    create: {
      value: weight,
      date: date.toISOString(),
      userId: user.id,
    },
  });

  return `Saved ${weight} kg for ${date.isSame(dayjs(), 'day') ? 'today' : date.format('L')}`;
}
