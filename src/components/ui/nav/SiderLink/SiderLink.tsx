import { INavLink } from '@/components/layouts/Sider/Sider';
import { useAppSelector } from '@/store/store';
import { Tooltip } from 'antd';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './SiderLink.module.scss';

interface ISiderLinkProps {
  link: INavLink;
}

export const SiderLink: FC<ISiderLinkProps> = ({ link }): JSX.Element => {
  const isSidebarCollapsed = useAppSelector((store) => store.app.ui.isSidebarCollapsed);

  const Icon = link.icon;

  return (
    <NavLink to={link.path} className={styles.siderLink}>
      {isSidebarCollapsed ? (
        <Tooltip title={link.title} mouseEnterDelay={1}>
          <Icon className={styles.icon} />
        </Tooltip>
      ) : (
        <Icon className={styles.icon} />
      )}
      <span className={isSidebarCollapsed ? styles.collapsedTitle : styles.expandedTitle}>{link.title}</span>
    </NavLink>
  );
};
