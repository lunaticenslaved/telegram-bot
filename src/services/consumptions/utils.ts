import { dayjs } from '../../libs/dayjs';

export function parseDate(str: string) {
  if (str === 'today') {
    return dayjs().startOf('day');
  }

  if (str === 'yesterday') {
    return dayjs().subtract(1, 'day').startOf('day');
  }

  const [day, month, year = dayjs().year()] = str.split('.');

  const date = dayjs(`${day}.${month}.${year}`, 'DD.MM.YYYY').startOf('day');

  if (!date.isValid()) {
    throw new Error('Invalid date');
  }

  return date;
}
