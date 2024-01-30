import dayjs from 'dayjs';
import { User } from 'telegraf/typings/core/types/typegram';

export async function addWeight(args: string[], user: User): Promise<string> {
  if (user.is_bot) {
    return 'Bots not allowes';
  }

  if (!args.length) {
    throw new Error('Pass args like <weight> <date?>');
  }

  const weightArg = args[0];
  const dateStr = args[1];

  const weight = parseFloat(weightArg);

  if (isNaN(weight)) {
    throw new Error('Weight is not in right format. Use 50.5 format');
  }

  if (!dateStr) {
    return `Saved ${weight} kg for today`;
  }

  const date = dayjs(dateStr);

  return `Saved ${weight} kg for ${date.format('L')}`;
}
