import { FC } from 'react';
import { Tooltip } from 'antd';
import styles from './TruncatedText.module.scss';

interface ITruncTextProps {
  text: string;
  tooltip?: boolean;
}

export const TruncatedText: FC<ITruncTextProps> = ({ text, tooltip = true }) => {
  const content = <div className={styles.truncateTwoLines}>{text}</div>;

  return tooltip ? <Tooltip title={text}>{content}</Tooltip> : content;
};