import { EOrderStatus } from '@/interfaces/entities/order.interface';

export const ORDER_STATUS_LABELS: Record<EOrderStatus, string> = {
  [EOrderStatus.CREATED]: 'СОЗДАН',
  [EOrderStatus.ACCEPTED]: 'ПРИНЯТ',
};
