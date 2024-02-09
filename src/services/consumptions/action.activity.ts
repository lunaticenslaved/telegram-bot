import dayjs from 'dayjs';
import { z } from 'zod';

import { prisma } from '../../prisma';

import { parseDate } from './utils';

export const AddActivitySchema = z.object({
  minutes: z.coerce.number().min(1),
  type: z.string(),
  date: z.string(),
});

type AddActivityRequest = z.infer<typeof AddActivitySchema> & {
  userId: string;
};

export async function addActivity({ date: dateStr, minutes, type, userId }: AddActivityRequest) {
  const date = parseDate(dateStr);

  await prisma.day.upsert({
    where: {
      userId_date: {
        userId,
        date: date.toISOString(),
      },
    },
    update: {
      activities: {
        create: [
          {
            minutes,
            type,
          },
        ],
      },
    },
    create: {
      userId,
      date: date.toISOString(),
      activities: {
        create: [
          {
            minutes,
            type,
          },
        ],
      },
    },
  });

  return `Saved ${minutes} min of ${type} for ${date.isSame(dayjs(), 'day') ? 'today' : date.format('L')}`;
}

export const RemoveActivitySchema = z.object({
  activityId: z.string().min(1),
});

type RemoveActivityRequest = z.infer<typeof RemoveActivitySchema> & {
  userId: string;
};

export async function removeActivity({ activityId, userId }: RemoveActivityRequest) {
  await prisma.activity.deleteMany({
    where: {
      id: activityId,
      day: {
        userId,
      },
    },
  });
}

export const ListActivitiesSchema = z.object({
  date: z.string(),
});

type ListActivitiesRequest = z.infer<typeof ListActivitiesSchema> & {
  userId: string;
};

export async function listActivities({ date: dateStr, userId }: ListActivitiesRequest) {
  const date = parseDate(dateStr);

  const day = await prisma.day.findUnique({
    where: {
      userId_date: {
        userId,
        date: date.toISOString(),
      },
    },
    select: {
      activities: true,
    },
  });

  return day?.activities || [];
}
