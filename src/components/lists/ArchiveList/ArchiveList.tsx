import { StatusTag } from '@/components/entities/OrderStatusTag/OrderStatusTag';
import { TruncatedText } from '@/components/ui/TruncatedText/TruncatedText';
import { setCurrentPage, setSelectedOrders } from '@/features/archive.slice';
import { IArchiveOrderPreview, IOwner } from '@/interfaces/entities/order.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { concatText, formatDatetime } from '@/utils/common.util';
import { FileSearchOutlined } from '@ant-design/icons';
import { Flex, Table, Tooltip } from 'antd';
import Column from 'antd/es/table/Column';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ArchiveList.module.scss';

const getOwnerName = (owner: IOwner): string =>
  [owner.lastName, owner.firstName, owner.middleName].filter(Boolean).join(' ');

export const ArchiveList = (): JSX.Element => {
  const { orders, currentPage, selectedOrders, isLoading } = useAppSelector((store) => store.archive);
  const species = useAppSelector((store) => store.dictionaries.species);
  const breeds = useAppSelector((store) => store.dictionaries.breeds);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const speciesMap = useMemo(() => new Map(species.map((item) => [item._id, item.name])), [species]);
  const breedMap = useMemo(() => new Map(breeds.map((item) => [item._id, item.name])), [breeds]);

  const handlePageChange = (page: number): void => {
    dispatch(setCurrentPage(page));
  };

  const handleSelectOrders = (keys: React.Key[]): void => {
    dispatch(setSelectedOrders(keys as string[]));
  };

  const renderFormsButton = (order: IArchiveOrderPreview): JSX.Element => (
    <Tooltip title="Просмотр бланков результатов" mouseEnterDelay={0.4}>
      <Flex className={styles.actionBtn}>
        <FileSearchOutlined
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/archive/pdf/${order._id}`);
          }}
        />
      </Flex>
    </Tooltip>
  );

  return (
    <Table
      dataSource={orders}
      rowSelection={{
        selectedRowKeys: selectedOrders,
        type: 'checkbox',
        onChange: handleSelectOrders,
      }}
      rowKey="_id"
      rowClassName={() => styles.customRow}
      loading={isLoading}
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        current: currentPage || 1,
        onChange: handlePageChange,
      }}
      scroll={{ x: 1450 }}
      size="middle"
    >
      <Column key="forms" render={(order: IArchiveOrderPreview) => renderFormsButton(order)} width={54} />
      <Column title="Статус" key="status" render={(order: IArchiveOrderPreview) => <StatusTag status={order.status} />} width={130} />
      <Column title="Штрихкод" key="barcode" dataIndex="barcode" width={150} />
      <Column
        title="Дата заказа"
        key="datetime"
        dataIndex="datetime"
        render={formatDatetime}
        sorter={(left: IArchiveOrderPreview, right: IArchiveOrderPreview) =>
          new Date(left.datetime).getTime() - new Date(right.datetime).getTime()
        }
        width={165}
      />
      <Column title="Владелец" key="owner" render={(order: IArchiveOrderPreview) => getOwnerName(order.owner)} width={220} />
      <Column title="Кличка" key="nickname" render={(order: IArchiveOrderPreview) => order.pet.nickname} width={150} />
      <Column
        title="Биологический вид"
        key="species"
        render={(order: IArchiveOrderPreview) => speciesMap.get(order.pet.speciesId) ?? 'Не указан'}
        width={190}
      />
      <Column
        title="Порода"
        key="breed"
        render={(order: IArchiveOrderPreview) =>
          order.pet.breedId ? breedMap.get(order.pet.breedId) ?? 'Не указана' : 'Не указана'
        }
        width={180}
      />
      <Column title="Возраст" key="age" render={(order: IArchiveOrderPreview) => order.pet.age ?? 'Не указан'} width={120} />
      <Column
        title="Исследования"
        key="analysis"
        dataIndex="analysis"
        render={(analysis: string[]) => <TruncatedText text={concatText(analysis)} tooltip={analysis.length > 2} />}
        width={300}
      />
      <Column title="Врач" key="doctor" dataIndex="doctor" width={220} />
    </Table>
  );
};
