import { OrdersFilters } from '@/components/forms/OrdersFilters/OrdersFilters';
import { OrdersTable } from '@/components/lists/OrdersTable/OrdersTable';
import { OrderModal } from '@/components/entities/OrderModal/OrderModal';
import { getOrder, getOrders } from '@/features/orders.slice';
import { notify } from '@/common/notifications';
import { IOrder } from '@/interfaces/entities/order.interface';
import { useAppDispatch } from '@/store/store';
import { Flex } from 'antd';
import { useEffect, useState } from 'react';
import styles from './OrdersPage.module.scss';

export const OrdersPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return (
    <Flex vertical className={styles.ordersPage}>
      <OrdersFilters
        onCreateOrder={() => {
          setEditingOrder(null);
          setIsModalOpen(true);
        }}
      />
      <OrdersTable
        onEdit={(order) => {
          void dispatch(getOrder(order._id))
            .unwrap()
            .then((detailedOrder) => {
              setEditingOrder(detailedOrder);
              setIsModalOpen(true);
            })
            .catch(() => notify('error', 'Не удалось загрузить заказ для редактирования'));
        }}
      />
      <OrderModal
        open={isModalOpen}
        order={editingOrder}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOrder(null);
        }}
      />
    </Flex>
  );
};
