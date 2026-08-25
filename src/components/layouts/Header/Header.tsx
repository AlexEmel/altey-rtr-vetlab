import { resetArchive } from '@/features/archive.slice';
import { logout } from '@/features/user.slice';
import { resetResultSlice } from '@/features/result.slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip } from 'antd';
import Title from 'antd/es/typography/Title';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';

export const AppHeader = (): JSX.Element => {
  const userInfo = useAppSelector((store) => store.user.userInfo);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(resetArchive());
    dispatch(resetResultSlice());
    dispatch(logout());
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  return (
    <Flex className={styles.appHeader}>
      <Flex>
        <Title level={2} className={styles.brand}>
          ВЕТЛАБ
        </Title>
      </Flex>
      <Flex className={styles.userInfo}>
        <Title level={5} className={styles.title}>
          {userInfo ? userInfo.organizationName : ''}
        </Title>
        <Tooltip placement="left" title="Профиль пользователя" mouseEnterDelay={0.4}>
          <Button icon={<UserOutlined />} className={styles.headerBtn} onClick={handleGoToProfile}></Button>
        </Tooltip>
        <Tooltip placement="left" title="Выйти" mouseEnterDelay={0.4}>
          <Button icon={<LogoutOutlined />} className={styles.headerBtn} onClick={handleLogout}></Button>
        </Tooltip>
      </Flex>
    </Flex>
  );
};
