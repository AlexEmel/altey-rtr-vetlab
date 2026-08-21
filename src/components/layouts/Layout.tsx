import { Flex } from 'antd';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './Header/Header';
import { AppSider } from './Sider/Sider';
import styles from './Layout.module.scss';
import { Footer } from './Footer/Footer';

export const AppLayout = (): JSX.Element => {
  return (
    <Flex className={styles.container}>
      <AppSider />
      <Flex className={styles.contentBox}>
        <AppHeader />
        <Flex className={styles.content}>
          <Outlet />
          <Footer />
        </Flex>
      </Flex>
    </Flex>
  );
};
