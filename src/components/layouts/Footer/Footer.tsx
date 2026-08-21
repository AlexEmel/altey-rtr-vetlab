import { Flex } from 'antd';
import styles from './Footer.module.scss';

export const Footer = (): JSX.Element => {
  return (
    <Flex className={styles.footer}>
      <span className={styles.text}>© 1996 - 2025 ООО «Группа АЛТЭЙ»</span>
    </Flex>
  );
};
