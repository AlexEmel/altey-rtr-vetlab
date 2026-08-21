import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC } from 'react';
import styles from './PdfBtns.module.scss';

interface IProps {
  url: string;
  id?: string;
}

export const DownloadPdfBtn: FC<IProps> = ({ url, id }): JSX.Element => {
  const handleDownloadPDF = (): void => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `results_${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return <Button onClick={handleDownloadPDF} icon={<DownloadOutlined />} className={styles.pdfBtn} />;
};
