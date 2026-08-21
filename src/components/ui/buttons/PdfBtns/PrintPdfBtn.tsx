import { PrinterOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC } from 'react';
import styles from './PdfBtns.module.scss';

interface IProps {
  url: string;
}

export const PrintPdfBtn: FC<IProps> = ({ url }): JSX.Element => {
  const handlePrint = () => {
    const pdfWindow = window.open(url);
    if (pdfWindow) {
      pdfWindow.print();
    }
  };

  return <Button onClick={handlePrint} icon={<PrinterOutlined />} className={styles.pdfBtn} />;
};
