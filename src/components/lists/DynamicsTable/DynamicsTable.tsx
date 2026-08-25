import { IDynamicGroup } from '@/interfaces/entities/dynamics.interface';
import { EResultStatus } from '@/interfaces/entities/result.interface';
import { formatUnitString } from '@/utils/common.util';
import Table, { ColumnsType } from 'antd/es/table';
import { FC } from 'react';
import styles from './DynamicsTable.module.scss';

interface IDynamicsTableProps {
  groups: IDynamicGroup[];
}

interface IDynamicsTableCell {
  value: string;
  status: EResultStatus;
}

interface IDynamicsTableRow {
  key: string;
  testName: string;
  unit: string;
  totalNorm: string;
  [key: string]: string | IDynamicsTableCell | null;
}

export const DynamicsTable: FC<IDynamicsTableProps> = ({ groups }): JSX.Element => {
  const uniqueDatetimes = Array.from(
    new Set(groups.flatMap((group) => group.dynamicResults.map((result) => result.datetime))),
  ).sort();

  const dataSource = groups.map((group) => {
    const row: IDynamicsTableRow = {
      key: group.testId,
      testName: group.testName,
      unit: group.unit,
      totalNorm: `${group.normalLow}–${group.normalHigh}`,
    };

    uniqueDatetimes.forEach((datetime) => {
      const result = group.dynamicResults.find((item) => item.datetime === datetime);
      row[datetime] = result ? { value: String(result.value), status: result.status } : null;
    });

    return row;
  });

  const columns: ColumnsType<IDynamicsTableRow> = [
    {
      title: 'Параметр',
      dataIndex: 'testName',
      key: 'testName',
      fixed: 'left',
      render: (_value, record) =>
        `${record.testName}, ${record.unit && formatUnitString(record.unit)}`,
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
          <span
            className={[
              styles.value,
              cell.status !== EResultStatus.NORMAL ? styles.redValue : styles.greenValue,
            ].join(' ')}
          >
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
