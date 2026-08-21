import { ETagSize } from '@/components/ui/AppTag/AppTag.types';
import { setArchiveQuery } from '@/features/archive.slice';
import { IArchiveOrderPreview } from '@/interfaces/entities/order.interface';
import { useAppDispatch } from '@/store/store';
import { formatDatetime, getPatientFullName } from '@/utils/common.util';
import { SearchOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusTag } from '../OrderStatusTag/OrderStatusTag';
import styles from './OrderInfo.module.scss';
import { GoBackButton } from '@/components/ui/buttons/GoBackButton/GoBackButton';

interface IOrderInfoProps {
  order: IArchiveOrderPreview;
}

export const OrderInfo: FC<IOrderInfoProps> = ({ order }): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fillSearchWithPatientData = (order: IArchiveOrderPreview): void => {
    dispatch(
      setArchiveQuery({
        dateFrom: order.datetime,
        dateTo: order.datetime,
        historyNumber: order.historyNumber,
        lastName: order.patient.lastName,
        firstName: order.patient.firstName,
        middleName: order.patient.middleName,
      }),
    );
    navigate('/archive');
  };

  return (
    <Flex className={styles.orderInfo}>
      <Flex className={styles.infoGroup}>
        <Flex className={styles.infoGroupHeader}>
          <GoBackButton />
          <Title className={styles.title} level={4}>{`Пациент`}</Title>
        </Flex>
        <Flex className={styles.infoBox}>
          <span>№ ИБ:</span>
          <span className={styles.infoValue}>{order.historyNumber}</span>
        </Flex>
        <Flex className={styles.infoBox}>
          <span>ФИО:</span>
          <span className={styles.infoValue}>{getPatientFullName(order.patient)}</span>
          <SearchOutlined
            title="Заполнить поисковый фильтр данными пациента"
            onClick={() => fillSearchWithPatientData(order)}
          />
        </Flex>
        <Flex className={styles.infoBox}>
          <span>Дата рождения:</span>
          <span className={styles.infoValue}>
            {order.patient.bornDate ? new Date(order.patient.bornDate).toLocaleDateString() : 'неизвестна'}
          </span>
        </Flex>
      </Flex>
      <Flex className={styles.infoGroup}>
        <Title className={styles.title} level={4}>{`Заказ`}</Title>
        <Flex className={styles.infoBox}>
          <span>Дата:</span>
          <span className={styles.infoValue}>{formatDatetime(order.datetime)}</span>
        </Flex>
        <Flex className={styles.infoBox}>
          <span>Врач:</span>
          <span className={styles.infoValue}>{order.doctor}</span>
        </Flex>
        <Flex className={styles.infoBox}>
          <span>Статус:</span>
          <StatusTag status={order.status} size={ETagSize.MEDIUM} />
        </Flex>
      </Flex>
      <span className={styles.link} onClick={() => navigate(`/archive/pdf/${order._id}`)}>
        Бланки результатов
      </span>
    </Flex>
  );
};
