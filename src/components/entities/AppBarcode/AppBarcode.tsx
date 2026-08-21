import { FC } from 'react';
import Barcode from 'react-barcode';

interface IAppBarcodeProps {
  value: string;
}

export const AppBarcode: FC<IAppBarcodeProps> = ({ value }): JSX.Element => {
  return <Barcode value={value} format="CODE128" height={75} fontSize={16} />;
};
