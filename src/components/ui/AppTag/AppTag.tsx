import { Flex } from 'antd';
import { FC } from 'react';
import { ETagColor, ETagSize } from './AppTag.types';
import styles from './AppTag.module.scss';

interface IAppTagProps {
  text: string;
  color: ETagColor;
  size?: ETagSize;
}

export const AppTag: FC<IAppTagProps> = ({ text, color, size = ETagSize.SMALL }): JSX.Element => {
  const getTagStyles = (): string => {
    const classes: string[] = [styles.tag];

    switch (color) {
      case ETagColor.GREEN:
        classes.push(styles.green);
        break;
      case ETagColor.GRAY:
        classes.push(styles.gray);
        break;
      case ETagColor.ORANGE:
        classes.push(styles.orange);
        break;
      case ETagColor.PURPLE:
        classes.push(styles.purple);
        break;
      case ETagColor.BLUE:
      default:
        classes.push(styles.blue);
        break;
    }

    switch (size) {
      case ETagSize.SMALL:
        classes.push(styles.small);
        break;
      case ETagSize.MEDIUM:
        classes.push(styles.medium);
        break;
      case ETagSize.LARGE:
        classes.push(styles.large);
        break;
    }

    return classes.join(' ');
  };

  return (
    <Flex className={getTagStyles()}>
      <span>{text}</span>
    </Flex>
  );
};

export { ETagColor, ETagSize };
