import { ORDER_STATUS_LABELS } from '@/common/orders.const';
import { AppTag } from '@/components/ui/AppTag/AppTag';
import { ETagColor } from '@/components/ui/AppTag/AppTag.types';
import { setCurrentPage } from '@/features/orders.slice';
import { EOrderStatus, ESex, IOrder, IOwner } from '@/interfaces/entities/order.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { formatDatetime } from '@/utils/common.util';
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
        onKeyDown: (event) => {
          if (event.target !== event.currentTarget || !['Enter', ' '].includes(event.key)) return;
          event.preventDefault();
          onEdit(order);
        },
        tabIndex: 0,
      })}
      loading={isLoading}
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        current: currentPage || 1,
        onChange: (page) => dispatch(setCurrentPage(page)),
      }}
      size="middle"
    >
      <Column
        title="Статус"
        key="status"
        width={105}
        render={(order: IOrder) => (
          <AppTag text={ORDER_STATUS_LABELS[order.status]} color={getStatusColor(order.status)} />
        )}
      />
      <Column title="Штрихкод" key="barcode" dataIndex="barcode" width={90} />
      <Column
        title="Дата заказа"
        key="datetime"
        dataIndex="datetime"
        width={155}
        render={formatDatetime}
        sorter={(left: IOrder, right: IOrder) =>
          new Date(left.datetime).getTime() - new Date(right.datetime).getTime()
        }
      />
      <Column
        title="Владелец"
        key="owner"
        width={260}
        render={(order: IOrder) => getOwnerName(order.owner)}
      />
      <Column title="Телефон" key="phone" dataIndex={['owner', 'phone']} width={200} />
      <Column
        title="Питомец"
        key="pet"
        width={240}
        render={(order: IOrder) => {
          if (!order.pet) return 'Не указан';
          const breedName = order.pet.breedId ? breedMap.get(order.pet.breedId) : undefined;
          const breedOrSpecies = breedName ?? speciesMap.get(order.pet.speciesId);

          return (
            <>
              <span className={styles.petNickname}>{order.pet.nickname}</span>
              {`, ${(breedOrSpecies ?? 'не указан').toLocaleLowerCase('ru-RU')}, ${
                order.pet.sex === ESex.MALE ? 'самец' : 'самка'
              }`}
            </>
          );
        }}
      />
      <Column
        title="Возраст"
        key="age"
        width={100}
        render={(order: IOrder) => order.pet?.age || 'Не указан'}
      />
      <Column title="Врач" key="doctor" dataIndex="doctor" width={170} />
      <Column title="Контрагент" key="clientName" dataIndex="clientName" width={190} />
      <Column
        key="actions"
        width={80}
        render={(order: IOrder) => (
          <Space
            size={0}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <Tooltip
              mouseEnterDelay={0.4}
              title={
                order.status === EOrderStatus.ACCEPTED
                  ? 'Принятый заказ нельзя редактировать'
                  : 'Редактировать заказ'
              }
            >
              <Button
                type="text"
                disabled={order.status === EOrderStatus.ACCEPTED}
                icon={<EditOutlined />}
                onClick={() => onEdit(order)}
              />
            </Tooltip>
            <Popconfirm
              disabled={order.status === EOrderStatus.ACCEPTED}
              title="Удалить заказ?"
              description="Это действие нельзя отменить."
              okText="Удалить"
              cancelText="Отмена"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDelete(order)}
            >
              <Tooltip
                mouseEnterDelay={0.4}
                title={
                  order.status === EOrderStatus.ACCEPTED ? 'Принятый заказ нельзя удалить' : 'Удалить заказ'
                }
              >
                <span>
                  <Button
                    type="text"
                    danger
                    disabled={order.status === EOrderStatus.ACCEPTED}
                    icon={<DeleteOutlined />}
                  />
                </span>
              </Tooltip>
            </Popconfirm>
          </Space>
        )}
      />
    </Table>
  );
};
