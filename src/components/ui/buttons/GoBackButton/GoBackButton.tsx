import { LeftOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './GoBackButton.module.scss';

export const GoBackButton = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Tooltip title="Назад" mouseEnterDelay={0.4}>
      <span className={styles.arrowBack}>
        <LeftOutlined onClick={() => navigate(-1)} />
      </span>
    </Tooltip>
  );
};
