import dayjs from 'dayjs';
import { User } from 'telegraf/typings/core/types/typegram';

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

export async function addWeight(args: string[], from: User): Promise<string> {
  const user = await getUserOrThrow(from);

  if (!args.length) {
    throw new Error('Pass args like <weight> <date?>');
  }

  const weightArg = args[0];
  const dateStr = args[1];

  const weight = parseFloat(weightArg);

  if (isNaN(weight)) {
    throw new Error('Weight is not in right format. Use 50.5 format');
  }

  const date = dayjs(dateStr).startOf('day');

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
