import { EOrderStatus } from '@/interfaces/entities/order.interface';

export const ARCHIVE_ORDER_STATUS_LABELS: Record<EOrderStatus, string> = {
  [EOrderStatus.IN_PROGRESS]: 'В РАБОТЕ',
  [EOrderStatus.RESULTS]: 'РЕЗУЛЬТАТЫ',
  [EOrderStatus.DONE]: 'ГОТОВ',
};
