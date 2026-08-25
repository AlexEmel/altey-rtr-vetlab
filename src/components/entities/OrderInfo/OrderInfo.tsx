import { GoBackButton } from '@/components/ui/buttons/GoBackButton/GoBackButton';
import { ETagSize } from '@/components/ui/AppTag/AppTag.types';
import { setArchiveQuery } from '@/features/archive.slice';
import { ESex, IArchiveOrderPreview } from '@/interfaces/entities/order.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { formatDatetime } from '@/utils/common.util';
import { SearchOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusTag } from '../OrderStatusTag/OrderStatusTag';
import styles from './OrderInfo.module.scss';

interface IOrderInfoProps {
  order: IArchiveOrderPreview;
}

export const OrderInfo: FC<IOrderInfoProps> = ({ order }): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const species = useAppSelector((store) => store.dictionaries.species);
  const breeds = useAppSelector((store) => store.dictionaries.breeds);
  const ownerName = [order.owner?.lastName, order.owner?.firstName, order.owner?.middleName]
    .filter(Boolean)
    .join(' ') || 'не указан';
  const speciesName = species.find((item) => item._id === order.pet.speciesId)?.name ?? 'не указан';
  const breedName = breeds.find((item) => item._id === order.pet.breedId)?.name ?? 'не указана';

  const fillSearchWithPetData = (): void => {
    dispatch(
      setArchiveQuery({
        dateFrom: order.datetime,
        dateTo: order.datetime,
        nickname: order.pet.nickname,
        speciesId: order.pet.speciesId,
        breedId: order.pet.breedId ?? undefined,
        ownerLastName: order.owner?.lastName,
      }),
    );
    navigate('/archive');
  };

  return (
    <Flex className={styles.orderInfo}>
      <Flex className={styles.infoGroup}>
        <Flex className={styles.infoGroupHeader}>
          <GoBackButton />
          <Title className={styles.title} level={4}>Питомец</Title>
        </Flex>
        <Flex className={styles.infoBox}>
          <span>Кличка:</span>
          <span className={styles.infoValue}>{order.pet.nickname}</span>
          <SearchOutlined title="Заполнить поиск данными питомца" onClick={fillSearchWithPetData} />
        </Flex>
        <Flex className={styles.infoBox}>
          <span>Владелец:</span>
          <span className={styles.infoValue}>{ownerName}</span>
        </Flex>
        <Flex className={styles.infoBox}>
          <span>Биологический вид:</span>
          <span className={styles.infoValue}>{speciesName}</span>
        </Flex>
        <Flex className={styles.infoBox}>
          <span>Порода:</span>
          <span className={styles.infoValue}>{breedName}</span>
        </Flex>
        <Flex className={styles.infoBox}>
          <span>Пол:</span>
          <span className={styles.infoValue}>{order.pet.sex === ESex.MALE ? 'самец' : 'самка'}</span>
        </Flex>
        <Flex className={styles.infoBox}>
          <span>Дата рождения:</span>
          <span className={styles.infoValue}>
            {order.pet.bornDate ? new Date(order.pet.bornDate).toLocaleDateString() : 'неизвестна'}
          </span>
        </Flex>
        <Flex className={styles.infoBox}>
          <span>Возраст:</span>
          <span className={styles.infoValue}>{order.pet.age ?? 'не указан'}</span>
        </Flex>
        <Flex className={styles.infoBox}>
          <span>Стерилизация:</span>
          <span className={styles.infoValue}>{order.pet.isSterilized ? 'да' : 'нет'}</span>
        </Flex>
      </Flex>
      <Flex className={styles.infoGroup}>
        <Title className={styles.title} level={4}>Заказ</Title>
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
