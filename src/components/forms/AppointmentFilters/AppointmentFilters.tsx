import { ISelectOption } from '@/interfaces/app/util.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useMemo } from 'react';
import { selectAllOption } from '../../../common/filterOptions';
import { EAppointmentStatus, IGetAppointmentsQueryParams } from '@/interfaces/entities/appointment.interface';
import { getAppointments, setAppointmentsQuery, resetAppointmentsQuery } from '@/features/appointments.slice';
import dayjs, { Dayjs } from 'dayjs';
import { Button, DatePicker, Flex, Input, Select } from 'antd';
import styles from './AppointmentFilters.module.scss';
import { ClearOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { addRussianPhonePrefix } from '@/utils/common.util';

interface IAppointmentFilter {
  onCreateAppointment: () => void;
}

export const AppointmentFilters = ({ onCreateAppointment }: IAppointmentFilter): JSX.Element => {
  const appointmentsQuery = useAppSelector((store) => store.appointments.appointmentsQuery);
  const isLoading = useAppSelector((store) => store.appointments.isLoading);
  const treatmentRooms = useAppSelector((store) => store.dictionaries.treatmentRooms);
  const departments = useAppSelector((store) => store.dictionaries.departments);
  const insuranceTypes = useAppSelector((store) => store.dictionaries.insuranceTypes);
  const dispatch = useAppDispatch();

  const treatmentRoomSelectOptions = useMemo<ISelectOption[]>(() => {
    if (!treatmentRooms || !treatmentRooms.length) return [selectAllOption];
    return [
      selectAllOption,
      ...treatmentRooms.map((troom) => ({
        value: troom._id,
        label: troom.name,
      })),
    ];
  }, [treatmentRooms]);

  const departmentSelectOptions = useMemo<ISelectOption[]>(() => {
    if (!departments.length) return [selectAllOption];
    return [
      selectAllOption,
      ...departments.map((department) => ({ value: department._id, label: department.name })),
    ];
  }, [departments]);

  const insuranceTypeSelectOptions = useMemo<ISelectOption[]>(() => {
    if (!insuranceTypes.length) return [selectAllOption];
    return [
      selectAllOption,
      ...insuranceTypes.map((insuranceType) => ({
        value: insuranceType._id,
        label: insuranceType.name,
      })),
    ];
  }, [insuranceTypes]);

  const statusSelectOptions = () => {
    return [
      selectAllOption,
      { label: 'Неподтверждена', value: EAppointmentStatus.UNCONFIRMED },
      { label: 'Подтверждена', value: EAppointmentStatus.CONFIRMED },
    ];
  };

  const handleFilterChange = (key: keyof IGetAppointmentsQueryParams, value: string | number) => {
    dispatch(setAppointmentsQuery({ [key]: value ? value : undefined }));
  };

  const handleDateChange = (key: keyof IGetAppointmentsQueryParams, value: Dayjs | null) => {
    dispatch(setAppointmentsQuery({ [key]: value ? value.toDate().toISOString() : undefined }));
  };

  const handleSearch = (): void => {
    dispatch(getAppointments());
  };

  return (
    <Flex className={styles.appointmentFilters}>
      <Flex vertical className={styles.filters}>
        <Flex className={styles.filterBox}>
          <Flex vertical>
            <span className={styles.filterLabel}>Дата с:</span>
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Укажите дату"
              value={appointmentsQuery.dateFrom ? dayjs(appointmentsQuery.dateFrom) : null}
              onChange={(date) => handleDateChange('dateFrom', date)}
              allowClear={false}
              maxDate={appointmentsQuery.dateTo ? dayjs(appointmentsQuery.dateTo) : undefined}
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Дата по:</span>
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Укажите дату"
              value={appointmentsQuery.dateTo ? dayjs(appointmentsQuery.dateTo) : null}
              onChange={(date) => handleDateChange('dateTo', date)}
              allowClear={false}
              minDate={appointmentsQuery.dateFrom ? dayjs(appointmentsQuery.dateFrom) : undefined}
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Процедурный кабинет:</span>
            <Select
              placeholder="Выберите Процедурный кабинет"
              optionFilterProp="children"
              onChange={(value) => handleFilterChange('troomId', value)}
              value={appointmentsQuery.troomId}
              options={treatmentRoomSelectOptions}
              className={styles.select}
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Направитель:</span>
            <Select
              placeholder="Выберите направителя"
              optionFilterProp="label"
              onChange={(value) => handleFilterChange('departmentId', value)}
              value={appointmentsQuery.departmentId}
              options={departmentSelectOptions}
              className={styles.select}
              showSearch
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Вид обслуживания:</span>
            <Select
              placeholder="Выберите вид обслуживания"
              optionFilterProp="label"
              onChange={(value) => handleFilterChange('insuranceTypeId', value)}
              value={appointmentsQuery.insuranceTypeId}
              options={insuranceTypeSelectOptions}
              className={styles.select}
              showSearch
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Статус:</span>
            <Select
              placeholder="Выберите Статус записи"
              optionFilterProp="children"
              onChange={(value) => handleFilterChange('status', value)}
              value={appointmentsQuery.status}
              options={statusSelectOptions()}
              className={styles.select}
            />
          </Flex>
        </Flex>
        <Flex className={styles.filterBox}>
          <Flex vertical>
            <span className={styles.filterLabel}>Номер телефона:</span>
            <span className={styles.filterLabel}>Номер телефона:</span>
            <Input
              value={appointmentsQuery.phone}
              onChange={(e) =>
                handleFilterChange('phone', addRussianPhonePrefix(e.currentTarget.value))
              }
              placeholder="+7..."
              allowClear
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Фамилия:</span>
            <Input
              value={appointmentsQuery.lastName}
              onChange={(e) => handleFilterChange('lastName', e.currentTarget.value)}
              placeholder="Фамилия"
              allowClear
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Имя:</span>
            <Input
              value={appointmentsQuery.firstName}
              onChange={(e) => handleFilterChange('firstName', e.currentTarget.value)}
              placeholder="Имя"
              allowClear
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Отчество:</span>
            <Input
              value={appointmentsQuery.middleName}
              onChange={(e) => handleFilterChange('middleName', e.currentTarget.value)}
              placeholder="Отчество"
              allowClear
            />
          </Flex>
        </Flex>
        <Flex className={styles.buttons}>
          <Button type="primary" disabled={isLoading} onClick={handleSearch} icon={<SearchOutlined />}>
            Поиск
          </Button>
          <Button
            type="primary"
            disabled={isLoading}
            onClick={() => dispatch(resetAppointmentsQuery())}
            icon={<ClearOutlined />}
          >
            Очистить
          </Button>
          <Button
            className={styles.buttonAdd}
            type="primary"
            disabled={isLoading}
            onClick={() => onCreateAppointment()}
            icon={<PlusOutlined />}
          >
            Создать запись
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
