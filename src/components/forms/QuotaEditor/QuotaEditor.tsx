import SlotCard from '@/components/entities/SlotCard/SlotCard';
import AppCalendar from '@/components/ui/AppCalendar/AppCalendar';
import {
  disableQuotas,
  enableQuotas,
  getTreatmentRoomsQuotas,
  resetTreatmentRoomQuotas,
} from '@/features/appointments.slice';
import { getTreatmentRooms } from '@/features/dictionary.slice';
import { ISelectOption } from '@/interfaces/app/util.interface';
import { TQuotasCalendar } from '@/interfaces/entities/treatment-room-quota.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { createQuotasCalendar } from '@/utils/quotas.util';
import { CheckCircleOutlined, ClearOutlined, SelectOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Flex, Popconfirm, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import styles from './QuotaEditor.module.scss';

export default function QuotaEditor(): ReactNode {
  const treatmentRooms = useAppSelector((store) => store.dictionaries.treatmentRooms);
  const treatmentRoomQuotas = useAppSelector((store) => store.appointments.treatmentRoomQuotas);
  const [selectedTroomId, setSelectedTroomId] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedQuotasIds, setSelectedQuotasIds] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const treatmentRoomSelectOptions = useMemo<ISelectOption[]>(() => {
    if (!treatmentRooms?.length) return [];

    return treatmentRooms.map((troom) => ({
      value: troom._id,
      label: troom.name,
    }));
  }, [treatmentRooms]);

  const quotasCalendar = useMemo<TQuotasCalendar>(() => {
    return createQuotasCalendar(treatmentRoomQuotas);
  }, [treatmentRoomQuotas]);

  const selectedDateQuotas =
    selectedDate &&
    quotasCalendar.get(selectedDate.year())?.get(selectedDate.month())?.get(selectedDate.date());

  useEffect(() => {
    if (treatmentRooms.length === 0) {
      dispatch(getTreatmentRooms());
    }
  }, [dispatch, treatmentRooms.length]);

  useEffect(() => {
    if (selectedTroomId) {
      dispatch(getTreatmentRoomsQuotas(selectedTroomId));
    } else {
      dispatch(resetTreatmentRoomQuotas());
    }
  }, [dispatch, selectedTroomId]);

  useEffect(() => {
    setSelectedQuotasIds([]);
  }, [selectedTroomId]);

  const handleSelectQuota = (id: string): void => {
    if (selectedQuotasIds.includes(id)) {
      setSelectedQuotasIds(selectedQuotasIds.filter((qid) => qid !== id));
    } else {
      setSelectedQuotasIds([...selectedQuotasIds, id]);
    }
  };

  const handleSelectDateQuotas = (): void => {
    if (selectedDate && selectedDateQuotas && selectedDateQuotas.length > 0) {
      setSelectedQuotasIds(selectedDateQuotas.map((q) => q.quotaId));
    }
  };

  const handleDisableQuotas = async (): Promise<void> => {
    if (selectedTroomId && selectedQuotasIds.length > 0) {
      await dispatch(disableQuotas(selectedQuotasIds));
      await dispatch(getTreatmentRoomsQuotas(selectedTroomId));
      setSelectedQuotasIds([]);
    }
  };

  const handleEnableQuotas = async (): Promise<void> => {
    if (selectedTroomId && selectedQuotasIds.length > 0) {
      await dispatch(enableQuotas(selectedQuotasIds));
      await dispatch(getTreatmentRoomsQuotas(selectedTroomId));
      setSelectedQuotasIds([]);
    }
  };

  return (
    <Flex className={styles.editor}>
      <Flex vertical className={styles.troomWrapper}>
        <div>
          <h3 className={styles.selectTitle}>Процедурный кабинет</h3>
          <Select
            placeholder="Выберите процедурный кабинет"
            optionFilterProp="children"
            options={treatmentRoomSelectOptions}
            style={{ width: '100%' }}
            value={selectedTroomId}
            onChange={(value) => setSelectedTroomId(value)}
          />
        </div>
        <AppCalendar mode="slotpicker" slotCalendar={quotasCalendar} onDateClick={setSelectedDate} />
      </Flex>
      <Flex className={styles.slotContainer}>
        <Flex className={styles.slotHeader}>
          <h3>Доступные интервалы</h3>
          <Button
            type="primary"
            icon={<SelectOutlined />}
            onClick={handleSelectDateQuotas}
            disabled={!selectedTroomId}
          >
            Выбрать все
          </Button>
          <Button
            type="primary"
            icon={<ClearOutlined />}
            onClick={() => setSelectedQuotasIds([])}
            disabled={!selectedTroomId}
          >
            Очистить
          </Button>
          <Popconfirm
            title="Отключить интервалы"
            description="Вы уверены, что хотите отключить выбранные интервалы процедурного кабинета для приема пациентов?"
            okText="Да"
            cancelText="Нет"
            onConfirm={handleDisableQuotas}
          >
            <Button type="primary" danger icon={<StopOutlined />} disabled={!selectedTroomId}>
              Отключить интервалы
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Включить интервалы"
            description="Вы уверены, что хотите включить выбранные интервалы процедурного кабинета для приема пациентов?"
            okText="Да"
            cancelText="Нет"
            onConfirm={handleEnableQuotas}
          >
            <Button type="primary" icon={<CheckCircleOutlined />} disabled={!selectedTroomId}>
              Включить интервалы
            </Button>
          </Popconfirm>
        </Flex>
        <div className={styles.slotGrid}>
          {selectedDateQuotas &&
            selectedDateQuotas.map((q) => (
              <SlotCard
                key={q.quotaId}
                slot={q}
                isSelected={selectedQuotasIds.includes(q.quotaId)}
                action={() => handleSelectQuota(q.quotaId)}
                disabled={false}
              />
            ))}
        </div>
      </Flex>
    </Flex>
  );
}
