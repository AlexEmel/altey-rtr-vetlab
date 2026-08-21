import { FC } from 'react';
import { AppBarcode } from '../AppBarcode/AppBarcode';
import { Flex } from 'antd';
import styles from './SampleInfo.module.scss';
import Title from 'antd/es/typography/Title';

interface ISampleInfoProps {
  barcode: string;
  sampleNumber: string;
}

export const SampleInfo: FC<ISampleInfoProps> = (props: ISampleInfoProps): JSX.Element => {
  return (
    <Flex className={styles.infoGroup}>
      <Title className={styles.title} level={4}>{`Проба`}</Title>
      <Flex className={styles.barcodeBox}>
        <AppBarcode value={props.barcode} />
      </Flex>
      <Flex className={styles.infoBox}>
        <span>№ пробы:</span>
        <span className={styles.infoValue}>{props.sampleNumber}</span>
      </Flex>
    </Flex>
  );
};
