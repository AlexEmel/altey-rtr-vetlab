import { ITreatmentRoomQuota, TQuotasCalendar } from '@/interfaces/entities/treatment-room-quota.interface';
import dayjs, { Dayjs } from 'dayjs';

export const getQuotaDateKey = (date: string): string => dayjs(new Date(date).toDateString()).toISOString();

export const createQuotasMapByDate = (quotas: ITreatmentRoomQuota[]): Map<string, ITreatmentRoomQuota[]> => {
  return quotas.reduce<Map<string, ITreatmentRoomQuota[]>>((map, quota) => {
    const key = getQuotaDateKey(quota.quotaStart);

    if (map.has(key)) {
      map.get(key)!.push(quota);
    } else {
      map.set(key, [quota]);
    }

    return map;
  }, new Map());
};

export const createQuotasCalendar = (quotas: ITreatmentRoomQuota[]): TQuotasCalendar => {
  return quotas.reduce<TQuotasCalendar>((calendar, quota) => {
    const quotaDate = dayjs(quota.workDay);
    const year = quotaDate.year();
    const month = quotaDate.month();
    const day = quotaDate.date();

    if (!calendar.has(year)) {
      calendar.set(year, new Map());
    }

    const yearMap = calendar.get(year)!;

    if (!yearMap.has(month)) {
      yearMap.set(month, new Map());
    }

    const monthMap = yearMap.get(month)!;

    if (!monthMap.has(day)) {
      monthMap.set(day, []);
    }

    monthMap.get(day)!.push(quota);

    return calendar;
  }, new Map());
};


export const getFirstDateWithQuotas = (calendar: TQuotasCalendar): Dayjs | null => {
  let firstDate: Dayjs | null = null;

  for (const [year, months] of calendar) {
    for (const [month, days] of months) {
      for (const [day, quotas] of days) {
        if (quotas.length === 0) continue;

        const dateWithSlots = dayjs().year(year).month(month).date(day);
        firstDate = dateWithSlots;
        break;
      }
      if (firstDate) break; 
    }
  }

  return firstDate;
}