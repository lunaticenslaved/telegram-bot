import { User } from '@prisma/client';
import { User as TgUser } from 'telegraf/typings/core/types/typegram';

import { prisma } from '../../prisma';

export async function createUser(user: TgUser): Promise<void> {
  if (user.is_bot) {
    throw new Error('Bots not allowed');
  }

  await prisma.user.create({
    data: {
      telegramId: user.id,
    },
  });
}

export async function getUserOrThrow(user: TgUser): Promise<User> {
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
