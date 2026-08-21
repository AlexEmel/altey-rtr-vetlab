import { IDynamicParam } from '@/interfaces/entities/dynamics.interface';
import { formatUnitString } from '@/utils/common.util';
import Table, { ColumnsType } from 'antd/es/table';
import { FC } from 'react';
import styles from './DynamicsTable.module.scss';

interface IDynamicsTableProps {
  params: IDynamicParam[];
}

interface IDynamicsTableCell {
  value: string;
  isPathology: boolean;
}

interface IDynamicsTableRow {
  key: string;
  paramName: string;
  unit: string;
  totalNorm: string;
  [key: string]: string | IDynamicsTableCell | null;
}

export const DynamicsTable: FC<IDynamicsTableProps> = ({ params }): JSX.Element => {
  const uniqueDatetimes = Array.from(new Set(params.flatMap((p) => p.results.map((r) => r.datetime)))).sort();

  const dataSource = params.map((param) => {
    const row: IDynamicsTableRow = {
      key: param._id,
      paramName: param.paramName,
      unit: param.unit,
      totalNorm: param.norm.totalNorm,
    };

    uniqueDatetimes.forEach((datetime) => {
      const res = param.results.find((r) => r.datetime === datetime);
      row[datetime] = res ? { value: res.valueString, isPathology: res.isPathology } : null;
    });

    return row;
  });

  const columns: ColumnsType<IDynamicsTableRow> = [
    {
      title: 'Параметр',
      dataIndex: 'paramName',
      key: 'paramName',
      fixed: 'left',
      render: (_value, record) =>
        `${record.paramName}, ${record.unit && formatUnitString(record.unit)}`,
    },
    {
      title: 'Норма',
      dataIndex: 'totalNorm',
      key: 'totalNorm',
    },
    ...uniqueDatetimes.map((datetime) => ({
      title: (
        <>
          {new Date(datetime).toLocaleDateString()}
          <br />
          <span className={styles.time}>
            {new Date(datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </>
      ),
      dataIndex: datetime,
      key: datetime,
      render: (cell: IDynamicsTableCell | null) => {
        if (!cell) return null;
        return (
          <span className={[styles.value, cell.isPathology ? styles.redValue : styles.greenValue].join(' ')}>
            {cell.value}
          </span>
        );
      },
    })),
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      size="small"
      scroll={{ x: 'max-content' }}
      bordered
    />
  );
};
