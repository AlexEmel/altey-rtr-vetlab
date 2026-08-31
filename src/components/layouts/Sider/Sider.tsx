import { SiderLink } from '@/components/ui/nav/SiderLink/SiderLink';
import { setIsCollapsedSidebar } from '@/features/app.slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  BarChartOutlined,
  CalendarOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  FieldTimeOutlined,
  FormOutlined,
  ReadOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Flex } from 'antd';
import { ComponentType } from 'react';
import styles from './Sider.module.scss';

export interface INavLink {
  path: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  show: boolean;
}

export const AppSider = (): JSX.Element => {
  const isSidebarCollapsed = useAppSelector((store) => store.app.ui.isSidebarCollapsed);
  const dispatch = useAppDispatch();

  const navlinks: INavLink[] = [
    { path: '/new-order', title: 'Новый заказ', icon: ShoppingCartOutlined, show: false },
    { path: '/orders', title: 'Заказы', icon: FormOutlined, show: true },
    {
      path: '/archive',
      title: 'Архив заказов',
      icon: ReadOutlined,
      show: true,
    },
    {
      path: '/appointments',
      title: 'Записи',
      icon: CalendarOutlined,
      show: true,
    },
    {
      path: '/quotas',
      title: 'Квоты',
      icon: FieldTimeOutlined,
      show: true,
    },
    { path: '/reports', title: 'Отчёты', icon: BarChartOutlined, show: false },
  ];

  const handleCollapseSidebar = (): void => {
    dispatch(setIsCollapsedSidebar(!isSidebarCollapsed));
  };

  const renderCollapseControl = (): JSX.Element => {
    return isSidebarCollapsed ? (
      <DoubleRightOutlined className={styles.collapseBtn} onClick={handleCollapseSidebar} />
    ) : (
      <DoubleLeftOutlined className={styles.collapseBtn} onClick={handleCollapseSidebar} />
    );
  };

  const getSidebarStyles = (): string => {
    return [styles.appSider, isSidebarCollapsed ? styles.collapsed : styles.expanded].join(' ');
  };

  const renderOldRtrUrl = (): JSX.Element | null => {
    const oldUrl = import.meta.env.VITE_RTR_OLD_URL;
    const linkText = isSidebarCollapsed ? 'УПК1' : 'Старая версия сайта';

    return oldUrl ? (
      <a href={oldUrl} className={styles.link}>
        {linkText}
      </a>
    ) : null;
  };

  return (
    <Flex className={getSidebarStyles()}>
      <Flex vertical flex={1} gap={20} className={styles.navigation}>
        {navlinks.map((link, i) => {
          if (link.show) {
            return <SiderLink key={i} link={link} />;
          }
        })}
      </Flex>
      <Flex className={styles.footer}>
        {renderOldRtrUrl()}
        {renderCollapseControl()}
      </Flex>
    </Flex>
  );
};
