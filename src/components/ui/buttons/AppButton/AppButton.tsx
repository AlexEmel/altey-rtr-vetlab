import { FC, MouseEventHandler } from 'react';
import styles from './AppButton.module.scss';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex } from 'antd';

interface IAppButtonProps {
  text: string;
  disabled: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const AppButton: FC<IAppButtonProps> = ({ text, onClick, disabled }): JSX.Element => {
  return (
    <button disabled={disabled} onClick={onClick} className={styles.appButton}>
      {disabled ? (
        <Flex className={styles.contentBox}>
          <LoadingOutlined className={styles.spinner} />
          <span>ПОДОЖДИТЕ...</span>
        </Flex>
      ) : (
        text
      )}
    </button>
  );
};
