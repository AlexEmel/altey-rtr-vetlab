import { ResultViewRules } from '@/components/forms/ResultViewRules/ResultViewRules';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Flex, Tabs } from 'antd';
import styles from './ProfilePage.module.scss';
import { ProfileInfo } from '@/components/entities/ProfileInfo/ProfileInfo';

export const ProfilePage = (): JSX.Element => {
  const items = [
    {
      key: '1',
      label: (
        <span className={styles.tabHeader}>
          <UserOutlined />
          Профиль
        </span>
      ),
      children: <ProfileInfo />,
    },
    {
      key: '2',
      label: (
        <span className={styles.tabHeader}>
          <SettingOutlined />
          Просмотр результатов
        </span>
      ),
      children: <ResultViewRules />,
    },
  ];

  return (
    <Flex className={styles.container}>
      <Tabs defaultActiveKey="1" tabPosition="top" items={items} />
    </Flex>
  );
};
