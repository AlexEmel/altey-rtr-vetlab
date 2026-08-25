import { ARCHIVE_ORDER_STATUS_LABELS } from '@/common/archive.const';
import { AppTag } from '@/components/ui/AppTag/AppTag';
import { ETagColor, ETagSize } from '@/components/ui/AppTag/AppTag.types';
import { EOrderStatus } from '@/interfaces/entities/order.interface';
import { FC } from 'react';

interface IStatusTagProps {
  status: EOrderStatus;
  size?: ETagSize;
}

export const StatusTag: FC<IStatusTagProps> = ({ status, size }): JSX.Element => {
  const getColor = (status: EOrderStatus): ETagColor => {
    let color: ETagColor;
    switch (status) {
      case EOrderStatus.DONE:
        color = ETagColor.GREEN;
        break;
      case EOrderStatus.RESULTS:
        color = ETagColor.PURPLE;
        break;
      case EOrderStatus.IN_PROGRESS:
      default:
        color = ETagColor.BLUE;
        break;
    }
    return color;
  };
  
  return <AppTag text={ARCHIVE_ORDER_STATUS_LABELS[status]} color={getColor(status)} size={size} />;
};
