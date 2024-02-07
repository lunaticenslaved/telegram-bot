import dayjs from 'dayjs';

export function parseDate(str: string) {
  if (str === 'today') {
    return dayjs().startOf('day');
  }

  if (str === 'yesterday') {
    return dayjs().subtract(1, 'day').startOf('day');
  }

  const date = dayjs(str).startOf('day');

  if (!date.isValid()) {
    throw new Error('Invalid date');
  }

  return date;
}
