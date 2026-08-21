import { getArchive, resetArchiveQuery, setArchiveQuery } from '@/features/archive.slice';
import { ISelectOption } from '@/interfaces/app/util.interface';
import { IArchiveQueryParams } from '@/interfaces/entities/order.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Flex, Input, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import { selectAllOption } from '../../../common/filterOptions';
import styles from './ArchiveFilters.module.scss';

export const ArchiveFilters = (): JSX.Element => {
  const archiveQuery = useAppSelector((store) => store.archive.archiveQuery);
  const isLoading = useAppSelector((store) => store.archive.isLoading);
  const departments = useAppSelector((store) => store.dictionaries.departments);
  const externalFinanceSources = useAppSelector((store) => store.dictionaries.externalFinanceSources);
  const analysisTypes = useAppSelector((store) => store.dictionaries.analysisTypes);
  const dispatch = useAppDispatch();

  const isPathology = archiveQuery.isPathology === true;
  const isNonPathology = archiveQuery.isPathology === false;
  const isDefective = archiveQuery.isDefective === true;
  const isNonDefective = archiveQuery.isDefective === false;

  const depSelectOptions = useMemo<ISelectOption[]>(() => {
    if (!departments.length) return [selectAllOption];
    return [selectAllOption, ...departments.map((dep) => ({ value: dep._id, label: dep.name }))];
  }, [departments]);

  const extFinanceSourcesSelectOptions = useMemo<ISelectOption[]>(() => {
    if (!externalFinanceSources?.length) return [selectAllOption];
    return [selectAllOption, ...externalFinanceSources.map((dep) => ({ value: dep._id, label: dep.name }))];
  }, [externalFinanceSources]);

  const analysisTypeSelectOptions = useMemo<ISelectOption[]>(() => {
    if (!analysisTypes.length) return [selectAllOption];
    return [
      selectAllOption,
      ...analysisTypes.map((analysisType) => ({
        value: analysisType._id,
        label: analysisType.name,
      })),
    ];
  }, [analysisTypes]);

  const handleFilterChange = (key: keyof IArchiveQueryParams, value: string | number) => {
    dispatch(setArchiveQuery({ [key]: value ? value : undefined }));
  };

  const handleDateChange = (key: keyof IArchiveQueryParams, value: Dayjs | null) => {
    dispatch(setArchiveQuery({ [key]: value ? value.toDate().toISOString() : undefined }));
  };

  const handleSearch = (): void => {
    dispatch(getArchive(archiveQuery));
  };

  return (
    <Flex className={styles.orderFilters}>
      <Flex vertical className={styles.filters}>
        <Flex className={styles.filterBox}>
          <Flex vertical>
            <span className={styles.filterLabel}>Дата с:</span>
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Укажите дату"
              value={archiveQuery.dateFrom ? dayjs(archiveQuery.dateFrom) : null}
              onChange={(date) => handleDateChange('dateFrom', date)}
              allowClear={false}
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
              allowClear={false}
              minDate={archiveQuery.dateFrom ? dayjs(archiveQuery.dateFrom) : undefined}
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>№ карты:</span>
            <Input
              value={archiveQuery.historyNumber}
              onChange={(e) => handleFilterChange('historyNumber', e.currentTarget.value)}
              placeholder="Номер карты"
              allowClear
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Штрихкод:</span>
            <Input
              value={archiveQuery.barcode}
              onChange={(e) => handleFilterChange('barcode', e.currentTarget.value)}
              placeholder="Штрихкод пробы"
              allowClear
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Номер пробы:</span>
            <Input
              value={archiveQuery.sampleNumber}
              onChange={(e) => handleFilterChange('sampleNumber', e.currentTarget.value)}
              placeholder="Номер пробы"
              allowClear
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Внешний источник финансирования:</span>
            <Select
              placeholder="Выберите внешний источник финансирования"
              optionFilterProp="children"
              onChange={(value) => handleFilterChange('externalFinanceSourceId', value)}
              value={archiveQuery.externalFinanceSourceId}
              options={extFinanceSourcesSelectOptions}
              className={styles.select}
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Вид исследования:</span>
            <Select
              placeholder="Выберите вид исследования"
              optionFilterProp="label"
              onChange={(value) => handleFilterChange('analysisId', value)}
              value={archiveQuery.analysisId}
              options={analysisTypeSelectOptions}
              className={styles.select}
              showSearch
            />
          </Flex>
        </Flex>

        <Flex className={styles.filterBox}>
          <Flex vertical>
            <span className={styles.filterLabel}>Фамилия:</span>
            <Input
              value={archiveQuery.lastName}
              onChange={(e) => handleFilterChange('lastName', e.currentTarget.value)}
              placeholder="Фамилия пациента"
              allowClear
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Имя:</span>
            <Input
              value={archiveQuery.firstName}
              onChange={(e) => handleFilterChange('firstName', e.currentTarget.value)}
              placeholder="Имя пациента"
              allowClear
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Отчество:</span>
            <Input
              value={archiveQuery.middleName}
              onChange={(e) => handleFilterChange('middleName', e.currentTarget.value)}
              placeholder="Отчество пациента"
              allowClear
            />
          </Flex>
          <Flex vertical>
            <span className={styles.filterLabel}>Направитель:</span>
            <Select
              placeholder="Выберите направителя"
              optionFilterProp="children"
              onChange={(value) => handleFilterChange('departmentId', value)}
              value={archiveQuery.departmentId}
              options={depSelectOptions}
              className={styles.select}
            />
          </Flex>
          <Flex>
            <Checkbox
              checked={isPathology}
              onChange={(e) =>
                dispatch(setArchiveQuery({ isPathology: e.target.checked ? true : undefined }))
              }
            >
              Патология
            </Checkbox>
          </Flex>
          <Flex>
            <Checkbox
              checked={isNonPathology}
              onChange={(e) =>
                dispatch(setArchiveQuery({ isPathology: e.target.checked ? false : undefined }))
              }
            >
              Не патология
            </Checkbox>
          </Flex>
          <Flex>
            <Checkbox
              checked={isDefective}
              onChange={(e) =>
                dispatch(setArchiveQuery({ isDefective: e.target.checked ? true : undefined }))
              }
            >
              Брак
            </Checkbox>
          </Flex>
          <Flex>
            <Checkbox
              checked={isNonDefective}
              onChange={(e) =>
                dispatch(setArchiveQuery({ isDefective: e.target.checked ? false : undefined }))
              }
            >
              Не брак
            </Checkbox>
          </Flex>
        </Flex>
      </Flex>
      <Flex className={styles.buttons}>
        <Button type="primary" disabled={isLoading} onClick={handleSearch} icon={<SearchOutlined />}>
          Поиск
        </Button>
        <Button
          type="primary"
          disabled={isLoading}
          onClick={() => dispatch(resetArchiveQuery())}
          icon={<ClearOutlined />}
        >
          Очистить
        </Button>
      </Flex>
    </Flex>
  );
};
