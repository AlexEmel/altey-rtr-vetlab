import { ArchiveFilters } from '@/components/forms/ArchiveFilters/ArchiveFilters';
import { ArchiveList } from '@/components/lists/ArchiveList/ArchiveList';
import { Flex } from 'antd';
import styles from './ArchivePage.module.scss';

export const ArchivePage = (): JSX.Element => {
  return (
    <Flex vertical className={styles.ordersPage}>
      <ArchiveFilters />
      <ArchiveList />
    </Flex>
  );
};
