import { TQuotasCalendar } from '@/interfaces/entities/treatment-room-quota.interface';
import { getFirstDateWithQuotas } from '@/utils/quotas.util';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './AppCalendar.module.scss';

const weekdays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

interface IAppCalendarProps {
  mode: 'slotpicker' | 'datepicker';
  selectedDate?: Dayjs;
  slotCalendar: TQuotasCalendar;
  onDateClick: (date: Dayjs | null) => unknown;
}

export default function AppCalendar(props: IAppCalendarProps): ReactNode {
  const { selectedDate, slotCalendar, onDateClick, mode = 'datepicker' } = props;
  const [selectedYear, setSelectedYear] = useState<number>(selectedDate?.year() || dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState<number>(selectedDate?.month() || dayjs().month());
  const [selectedDay, setSelectedDay] = useState<number | null>(selectedDate?.date() || dayjs().date());
  const isMountedRef = useRef<boolean>(false);

  const selectedMonthName = dayjs().month(selectedMonth).format('MMMM').toUpperCase();
  const monthDate = dayjs().year(selectedYear).month(selectedMonth).startOf('month');
  const daysInMonth = monthDate.daysInMonth();
  const firstDateWeekday = (monthDate.day() + 6) % 7;
  const days = Array.from({ length: daysInMonth }, (_, idx) => idx + 1);

  useEffect(() => {
    if (selectedDay) {
      const date = dayjs().year(selectedYear).month(selectedMonth).date(selectedDay);
      onDateClick(date);
    } else {
      onDateClick(null);
    }
  }, [onDateClick, selectedMonth, selectedDay, selectedYear]);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    setSelectedDay(null);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (mode === 'slotpicker' && !selectedDate) {
      const firstDateWithSlots = getFirstDateWithQuotas(slotCalendar);
      if (firstDateWithSlots) {
        setSelectedYear(firstDateWithSlots.year());
        setSelectedMonth(firstDateWithSlots.month());
        setSelectedDay(firstDateWithSlots.date());
      }
    }
  }, [mode, selectedDate, slotCalendar]);

  useEffect(() => {
    if (selectedDate) {
      setSelectedYear(selectedDate.year());
      setSelectedMonth(selectedDate.month());
      setSelectedDay(selectedDate.date());
    }
  }, [selectedDate]);

  const handleSetPrevYear = (): void => {
    setSelectedYear((prevYear) => prevYear - 1);
  };

  const handleSetNextYear = (): void => {
    setSelectedYear((prevYear) => prevYear + 1);
  };

  const handleSetPrevMonth = (): void => {
    const prevMonth = selectedMonth - 1;
    if (prevMonth === -1) {
      setSelectedYear((prevYear) => prevYear - 1);
      setSelectedMonth(11);
      return;
    }

    setSelectedMonth(prevMonth);
  };

  const handleSetNextMonth = (): void => {
    const nextMonth = selectedMonth + 1;
    if (nextMonth === 12) {
      setSelectedYear((prevYear) => prevYear + 1);
      setSelectedMonth(0);
      return;
    }

    setSelectedMonth(nextMonth);
  };

  return (
    <Flex className={styles.calendarWrapper}>
      <Flex className={styles.year}>
        <LeftOutlined onClick={handleSetPrevYear} />
        <h2>{selectedYear}</h2>
        <RightOutlined onClick={handleSetNextYear} />
      </Flex>
      <Flex className={styles.year}>
        <LeftOutlined onClick={handleSetPrevMonth} />
        <h3>{selectedMonthName}</h3>
        <RightOutlined onClick={handleSetNextMonth} />
      </Flex>
      <div className={styles.calendar}>
        {weekdays.map((wd) => (
          <div key={wd} className={styles.weekday}>
            {wd}
          </div>
        ))}
        {days.map((day, index) => {
          const hasSlots = slotCalendar.get(selectedYear)?.get(selectedMonth)?.has(day);
          const isSelected = selectedDate ? selectedDate.date() === day : hasSlots && selectedDay === day;

          return (
            <button
              type="button"
              key={day}
              className={[styles.day, isSelected && styles.selected].join(' ')}
              disabled={!hasSlots}
              onClick={() => setSelectedDay(day)}
              style={{
                gridColumnStart: index === 0 ? firstDateWeekday + 1 : undefined,
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </Flex>
  );
}
