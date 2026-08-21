import { ITreatmentRoomQuota } from '@/interfaces/entities/treatment-room-quota.interface';
import styles from './SlotCard.module.scss';
import { ClockCircleOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';
import { Tooltip } from 'antd';

interface ISlotCardProps {
  slot: ITreatmentRoomQuota;
  isSelected: boolean;
  disabled: boolean;
  action: () => void;
}

export default function SlotCard({ slot, isSelected, action, disabled }: ISlotCardProps): ReactNode {
  const showTooltip = !slot.isActive || slot.isReserved;

  const getCardClasses = (): string => {
    const classes: string[] = [styles.slotCard];

    if (isSelected) {
      classes.push(styles.active);
    }

    if (!slot.isActive || slot.isReserved) {
      classes.push(styles.disabled);
    }
    
    return classes.join(' ');
  };

  const getTooltipText = (): string => {
    if (!slot.isActive) {
      return 'В данный интервал прием не осуществляется. Выберите другое время';
    }

    if (slot.isReserved) {
      return 'Интервал уже зарезервирован. Выберите другое время';
    }

    return '';
  };

  const renderCard = (): ReactNode => {
    return (
      <button
        key={slot.quotaId}
        type="button"
        className={getCardClasses()}
        onClick={action}
        disabled={disabled}
      >
        <ClockCircleOutlined className={styles.slotCardIcon} />
        <span>
          {slot.quotaName}
        </span>
      </button>
    );
  };

  return showTooltip ? <Tooltip title={getTooltipText()}>{renderCard()}</Tooltip> : renderCard();
}
