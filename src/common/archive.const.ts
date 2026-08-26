import { ELisOrderStatus } from '@/interfaces/entities/order.interface';

export const ARCHIVE_ORDER_STATUS_LABELS: Record<ELisOrderStatus, string> = {
  [ELisOrderStatus.IN_PROGRESS]: 'В РАБОТЕ',
  [ELisOrderStatus.RESULTS]: 'РЕЗУЛЬТАТЫ',
  [ELisOrderStatus.DONE]: 'ГОТОВ',
};
