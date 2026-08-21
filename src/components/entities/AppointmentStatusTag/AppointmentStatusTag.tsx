import { AppTag } from '@/components/ui/AppTag/AppTag';
import { ETagColor, ETagSize } from '@/components/ui/AppTag/AppTag.types';
import { EAppointmentStatus, TAppointmentStatus } from '@/interfaces/entities/appointment.interface';
import { FC } from 'react';

interface IAppointmentStatusTagProps {
  status: TAppointmentStatus;
  size?: ETagSize;
}

const getAppointmentStatusMeta = (
  status: TAppointmentStatus,
): { text: string; color: ETagColor } => {
  switch (status) {
    case EAppointmentStatus.CONFIRMED:
      return { text: 'Подтверждена', color: ETagColor.GREEN };
    case EAppointmentStatus.UNCONFIRMED:
    default:
      return { text: 'Не подтверждена', color: ETagColor.GRAY };
  }
};

export const AppointmentStatusTag: FC<IAppointmentStatusTagProps> = ({ status, size }): JSX.Element => {
  const meta = getAppointmentStatusMeta(status);
  return <AppTag text={meta.text} color={meta.color} size={size} />;
};
