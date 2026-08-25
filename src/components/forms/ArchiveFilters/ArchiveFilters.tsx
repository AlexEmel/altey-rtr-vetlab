import { getArchive, resetArchiveQuery, setArchiveQuery } from '@/features/archive.slice';
import { ISelectOption } from '@/interfaces/app/util.interface';
import { IArchiveQueryParams } from '@/interfaces/entities/order.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Flex, Input, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import { selectAllOption } from '../../../common/filterOptions';
import styles from './ArchiveFilters.module.scss';

export const ArchiveFilters = (): JSX.Element => {
  const archiveQuery = useAppSelector((store) => store.archive.archiveQuery);
  const isLoading = useAppSelector((store) => store.archive.isLoading);
  const species = useAppSelector((store) => store.dictionaries.species);
  const breeds = useAppSelector((store) => store.dictionaries.breeds);
  const clients = useAppSelector((store) => store.dictionaries.clients);
  const dispatch = useAppDispatch();

  const speciesOptions = useMemo<ISelectOption[]>(
    () => [selectAllOption, ...species.map((item) => ({ value: item._id, label: item.name }))],
    [species],
  );
  const breedOptions = useMemo<ISelectOption[]>(() => {
    const availableBreeds = archiveQuery.speciesId
      ? breeds.filter((item) => item.speciesId === archiveQuery.speciesId)
      : breeds;
    return [selectAllOption, ...availableBreeds.map((item) => ({ value: item._id, label: item.name }))];
  }, [archiveQuery.speciesId, breeds]);
  const clientOptions = useMemo<ISelectOption[]>(
    () => [selectAllOption, ...clients.map((item) => ({ value: item._id, label: item.name }))],
    [clients],
  );

  const handleFilterChange = (key: keyof IArchiveQueryParams, value: string | undefined): void => {
    dispatch(setArchiveQuery({ [key]: value || undefined }));
  };

  const handleDateChange = (key: 'dateFrom' | 'dateTo', value: Dayjs | null): void => {
    dispatch(setArchiveQuery({ [key]: value?.toDate().toISOString() }));
  };

  const handleSpeciesChange = (value: string | undefined): void => {
    dispatch(setArchiveQuery({ speciesId: value || undefined, breedId: undefined }));
  };

  return (
    <Flex className={styles.orderFilters}>
      <Flex vertical className={styles.filters}>
        <Flex className={styles.filterBox} wrap="wrap">
          <Flex vertical>
            <span className={styles.filterLabel}>Дата с:</span>
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Укажите дату"
              value={archiveQuery.dateFrom ? dayjs(archiveQuery.dateFrom) : null}
              onChange={(date) => handleDateChange('dateFrom', date)}
              maxDate={archiveQuery.dateTo ? dayjs(archiveQuery.dateTo) : undefined}
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Дата по:</span>
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Укажите дату"
              value={archiveQuery.dateTo ? dayjs(archiveQuery.dateTo) : null}
              onChange={(date) => handleDateChange('dateTo', date)}
              minDate={archiveQuery.dateFrom ? dayjs(archiveQuery.dateFrom) : undefined}
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Штрихкод:</span>
            <Input
              value={archiveQuery.barcode}
              onChange={(event) => handleFilterChange('barcode', event.currentTarget.value)}
              placeholder="Штрихкод заказа"
              allowClear
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Номер пробы:</span>
            <Input
              value={archiveQuery.sampleNumber}
              onChange={(event) => handleFilterChange('sampleNumber', event.currentTarget.value)}
              placeholder="Номер пробы"
              allowClear
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Кличка:</span>
            <Input
              value={archiveQuery.nickname}
              onChange={(event) => handleFilterChange('nickname', event.currentTarget.value)}
              placeholder="Кличка питомца"
              allowClear
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Биологический вид:</span>
            <Select
              placeholder="Выберите вид"
              optionFilterProp="label"
              value={archiveQuery.speciesId}
              options={speciesOptions}
              onChange={handleSpeciesChange}
              className={styles.select}
              showSearch
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Порода:</span>
            <Select
              placeholder="Выберите породу"
              optionFilterProp="label"
              value={archiveQuery.breedId}
              options={breedOptions}
              onChange={(value) => handleFilterChange('breedId', value)}
              className={styles.select}
              showSearch
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Владелец:</span>
            <Input
              value={archiveQuery.ownerLastName}
              onChange={(event) => handleFilterChange('ownerLastName', event.currentTarget.value)}
              placeholder="Фамилия владельца"
              allowClear
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Контрагент:</span>
            <Select
              placeholder="Выберите контрагента"
              optionFilterProp="label"
              value={archiveQuery.clientId}
              options={clientOptions}
              onChange={(value) => handleFilterChange('clientId', value)}
              className={styles.select}
              showSearch
            />
          </Flex>
        </Flex>
      </Flex>
      <Flex className={styles.buttons}>
        <Button type="primary" disabled={isLoading} onClick={() => dispatch(getArchive(archiveQuery))} icon={<SearchOutlined />}>
          Поиск
        </Button>
        <Button type="primary" disabled={isLoading} onClick={() => dispatch(resetArchiveQuery())} icon={<ClearOutlined />}>
          Очистить
        </Button>
      </Flex>
    </Flex>
  );
};
