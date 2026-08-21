import { useAppSelector } from '@/store/store';
import { Flex } from 'antd';
import styles from './Profile.module.scss';

export const ProfileInfo = (): JSX.Element => {
  const userInfo = useAppSelector((store) => store.user.userInfo);
  
  return (
    <Flex className={styles.container}>
      <Flex className={styles.infoGroup}>
        <span>Пользователь:</span>
        <span className={styles.infoValue}>{userInfo?.username}</span>
      </Flex>
      <Flex className={styles.infoGroup}>
        <span>Организация:</span>
        <span className={styles.infoValue}>{userInfo?.organizationName}</span>
      </Flex>
    </Flex>
  );
};
