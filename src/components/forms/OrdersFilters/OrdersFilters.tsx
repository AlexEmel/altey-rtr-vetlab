import { ORDER_STATUS_LABELS } from '@/common/orders.const';
import { selectAllOption } from '@/common/filterOptions';
import { getOrders, resetOrdersQuery, setOrdersQuery } from '@/features/orders.slice';
import { ISelectOption } from '@/interfaces/app/util.interface';
import { EOrderStatus, IOrdersQueryParams } from '@/interfaces/entities/order.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { ClearOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Flex, Input, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import styles from './OrdersFilters.module.scss';

interface IOrdersFiltersProps {
  onCreateOrder: () => void;
}

export const OrdersFilters = ({ onCreateOrder }: IOrdersFiltersProps): JSX.Element => {
  const { ordersQuery, isLoading } = useAppSelector((store) => store.orders);
  const { species, breeds, clients } = useAppSelector((store) => store.dictionaries);
  const dispatch = useAppDispatch();

  const speciesOptions = useMemo<ISelectOption[]>(
    () => [selectAllOption, ...species.map((item) => ({ value: item._id, label: item.name }))],
    [species],
  );
  const breedOptions = useMemo<ISelectOption[]>(() => {
    const availableBreeds = ordersQuery.speciesId
      ? breeds.filter((item) => item.speciesId === ordersQuery.speciesId)
      : breeds;
    return [selectAllOption, ...availableBreeds.map((item) => ({ value: item._id, label: item.name }))];
  }, [breeds, ordersQuery.speciesId]);
  const clientOptions = useMemo<ISelectOption[]>(
    () => [selectAllOption, ...clients.map((item) => ({ value: item._id, label: item.name }))],
    [clients],
  );
  const statusOptions = useMemo<ISelectOption[]>(
    () => [
      selectAllOption,
      ...Object.values(EOrderStatus).map((status) => ({
        value: status,
        label: ORDER_STATUS_LABELS[status],
      })),
    ],
    [],
  );

  const setTextFilter = (key: keyof IOrdersQueryParams, value?: string): void => {
    dispatch(setOrdersQuery({ [key]: value || undefined }));
  };

  const setDateFilter = (key: 'dateFrom' | 'dateTo', value: Dayjs | null): void => {
    dispatch(setOrdersQuery({ [key]: value?.toDate().toISOString() }));
  };

  const handleSpeciesChange = (value?: string): void => {
    dispatch(setOrdersQuery({ speciesId: value || undefined, breedId: undefined }));
  };

  const handleReset = (): void => {
    dispatch(resetOrdersQuery());
    dispatch(getOrders());
  };

  return (
    <Flex vertical className={styles.orderFilters}>
      <Flex className={styles.filters} wrap="wrap">
        <Flex vertical>
          <span className={styles.filterLabel}>Дата с:</span>
          <DatePicker
            format="DD-MM-YYYY"
            placeholder="Укажите дату"
            value={ordersQuery.dateFrom ? dayjs(ordersQuery.dateFrom) : null}
            onChange={(value) => setDateFilter('dateFrom', value)}
            maxDate={ordersQuery.dateTo ? dayjs(ordersQuery.dateTo) : undefined}
          />
        </Flex>
        <Flex vertical>
          <span className={styles.filterLabel}>Дата по:</span>
          <DatePicker
            format="DD-MM-YYYY"
            placeholder="Укажите дату"
            value={ordersQuery.dateTo ? dayjs(ordersQuery.dateTo) : null}
            onChange={(value) => setDateFilter('dateTo', value)}
            minDate={ordersQuery.dateFrom ? dayjs(ordersQuery.dateFrom) : undefined}
          />
        </Flex>
        <Flex vertical>
          <span className={styles.filterLabel}>Штрихкод:</span>
          <Input
            value={ordersQuery.barcode}
            placeholder="Штрихкод заказа"
            onChange={(event) => setTextFilter('barcode', event.currentTarget.value)}
            allowClear
          />
        </Flex>
        <Flex vertical>
          <span className={styles.filterLabel}>Номер пробы:</span>
          <Input
            value={ordersQuery.sampleNumber}
            placeholder="Номер пробы"
            onChange={(event) => setTextFilter('sampleNumber', event.currentTarget.value)}
            allowClear
          />
        </Flex>
        <Flex vertical>
          <span className={styles.filterLabel}>Кличка:</span>
          <Input
            value={ordersQuery.nickname}
            placeholder="Кличка питомца"
            onChange={(event) => setTextFilter('nickname', event.currentTarget.value)}
            allowClear
          />
        </Flex>
        <Flex vertical>
          <span className={styles.filterLabel}>Биологический вид:</span>
          <Select
            className={styles.select}
            value={ordersQuery.speciesId}
            options={speciesOptions}
            placeholder="Выберите вид"
            optionFilterProp="label"
            onChange={handleSpeciesChange}
            showSearch
          />
        </Flex>
        <Flex vertical>
          <span className={styles.filterLabel}>Порода:</span>
          <Select
            className={styles.select}
            value={ordersQuery.breedId}
            options={breedOptions}
            placeholder="Выберите породу"
            optionFilterProp="label"
            onChange={(value) => setTextFilter('breedId', value)}
            showSearch
          />
        </Flex>
        <Flex vertical>
          <span className={styles.filterLabel}>Владелец:</span>
          <Input
            value={ordersQuery.ownerLastName}
            placeholder="Фамилия владельца"
            onChange={(event) => setTextFilter('ownerLastName', event.currentTarget.value)}
            allowClear
          />
        </Flex>
        <Flex vertical>
          <span className={styles.filterLabel}>Контрагент:</span>
          <Select
            className={styles.select}
            value={ordersQuery.clientId}
            options={clientOptions}
            placeholder="Выберите контрагента"
            optionFilterProp="label"
            onChange={(value) => setTextFilter('clientId', value)}
            showSearch
          />
        </Flex>
        <Flex vertical>
          <span className={styles.filterLabel}>Статус:</span>
          <Select
            className={styles.selectSmall}
            value={ordersQuery.status}
            options={statusOptions}
            placeholder="Выберите статус"
            onChange={(value) => dispatch(setOrdersQuery({ status: value || undefined }))}
          />
        </Flex>
      </Flex>
      <Flex className={styles.buttons}>
        <Flex gap={8}>
          <Button type="primary" disabled={isLoading} icon={<SearchOutlined />} onClick={() => dispatch(getOrders())}>
            Поиск
          </Button>
          <Button type="primary" disabled={isLoading} icon={<ClearOutlined />} onClick={handleReset}>
            Очистить
          </Button>
        </Flex>
        <Button type="primary" disabled={isLoading} icon={<PlusOutlined />} onClick={onCreateOrder}>
          Новый заказ
        </Button>
      </Flex>
    </Flex>
  );
};
