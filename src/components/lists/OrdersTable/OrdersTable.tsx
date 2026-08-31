import { ORDER_STATUS_LABELS } from '@/common/orders.const';
import { AppTag } from '@/components/ui/AppTag/AppTag';
import { ETagColor } from '@/components/ui/AppTag/AppTag.types';
import { TruncatedText } from '@/components/ui/TruncatedText/TruncatedText';
import { setCurrentPage } from '@/features/orders.slice';
import { EOrderStatus, IOrder, IOwner } from '@/interfaces/entities/order.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { concatText, formatDatetime } from '@/utils/common.util';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tooltip } from 'antd';
import Column from 'antd/es/table/Column';
import { useMemo } from 'react';
import styles from './OrdersTable.module.scss';

const getOwnerName = (owner?: IOwner): string =>
  owner ? [owner.lastName, owner.firstName, owner.middleName].filter(Boolean).join(' ') : 'Не указан';

const getStatusColor = (status: EOrderStatus): ETagColor =>
  status === EOrderStatus.ACCEPTED ? ETagColor.GREEN : ETagColor.BLUE;

interface IOrdersTableProps {
  onEdit: (order: IOrder) => void;
  onDelete: (order: IOrder) => void;
}

export const OrdersTable = ({ onEdit, onDelete }: IOrdersTableProps): JSX.Element => {
  const { orders, currentPage, isLoading } = useAppSelector((store) => store.orders);
  const species = useAppSelector((store) => store.dictionaries.species);
  const breeds = useAppSelector((store) => store.dictionaries.breeds);
  const dispatch = useAppDispatch();

  const speciesMap = useMemo(() => new Map(species.map((item) => [item._id, item.name])), [species]);
  const breedMap = useMemo(() => new Map(breeds.map((item) => [item._id, item.name])), [breeds]);

  return (
    <Table
      dataSource={orders}
      rowKey="_id"
      rowClassName={() => styles.row}
      onRow={(order) => ({
        onClick: () => onEdit(order),
      })}
      loading={isLoading}
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        current: currentPage || 1,
        onChange: (page) => dispatch(setCurrentPage(page)),
      }}
      scroll={{ x: 1650 }}
      size="middle"
    >
      <Column
        title="Статус"
        key="status"
        width={120}
        render={(order: IOrder) => (
          <AppTag text={ORDER_STATUS_LABELS[order.status]} color={getStatusColor(order.status)} />
        )}
      />
      <Column title="Штрихкод" key="barcode" dataIndex="barcode" width={100} />
      <Column
        title="Дата заказа"
        key="datetime"
        dataIndex="datetime"
        width={165}
        render={formatDatetime}
        sorter={(left: IOrder, right: IOrder) =>
          new Date(left.datetime).getTime() - new Date(right.datetime).getTime()
        }
      />
      <Column title="Владелец" key="owner" width={220} render={(order: IOrder) => getOwnerName(order.owner)} />
      <Column title="Кличка" key="nickname" width={150} render={(order: IOrder) => order.pet?.nickname ?? 'Не указана'} />
      <Column
        title="Биологический вид"
        key="species"
        width={150}
        render={(order: IOrder) =>
          order.pet ? speciesMap.get(order.pet.speciesId) ?? 'Не указан' : 'Не указан'
        }
      />
      <Column
        title="Порода"
        key="breed"
        width={180}
        render={(order: IOrder) =>
          order.pet?.breedId ? breedMap.get(order.pet.breedId) ?? 'Не указана' : 'Не указана'
        }
      />
      <Column
        title="Исследования"
        key="analysis"
        width={300}
        render={(order: IOrder) => {
          const analysis = order.analysis ?? [];
          return <TruncatedText text={concatText(analysis)} tooltip={analysis.length > 2} />;
        }}
      />
      <Column title="Врач" key="doctor" dataIndex="doctor" width={200} />
      <Column title="Контрагент" key="clientName" dataIndex="clientName" width={220} />
      <Column
        key="actions"
        width={96}
        fixed="right"
        render={(order: IOrder) => (
          <Space size={0} onClick={(event) => event.stopPropagation()}>
            <Tooltip title="Редактировать заказ">
              <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(order)} />
            </Tooltip>
            <Popconfirm
              title="Удалить заказ?"
              description="Это действие нельзя отменить."
              okText="Удалить"
              cancelText="Отмена"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDelete(order)}
            >
              <Tooltip title="Удалить заказ">
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </Space>
        )}
      />
    </Table>
  );
};
