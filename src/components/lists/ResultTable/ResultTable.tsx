import arrowDownIcon from '@/assets/icons/down-arrow.svg';
import arrowUpIcon from '@/assets/icons/up-arrow.svg';
import { IMethodNorm, IMethodResult } from '@/interfaces/entities/result.interface';
import { formatUnitString, isPathologyByIndex } from '@/utils/common.util';
import { Flex, Table } from 'antd';
import Column from 'antd/es/table/Column';
import { FC } from 'react';
import styles from './ResultTable.module.scss';

interface IResultTableProps {
  results: IMethodResult[];
}

enum EPathology {
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  HIGH = 'HIGH',
}

export const ResultTable: FC<IResultTableProps> = ({ results }): JSX.Element => {
  const showUnitColumn = results.some((r) => Boolean(r.methodUnit));
  const showNormColumn = results.some((r) => Array.isArray(r.methodNorms) && r.methodNorms.length > 0);

  const renderNormsText = (norms: IMethodNorm[]): JSX.Element | null => {
    if (norms && Array.isArray(norms)) {
      if (norms.length === 1) {
        const text = norms.map((norm) => norm.normText).join(' ');
        return <div dangerouslySetInnerHTML={{ __html: text }}></div>;
      }

      if (norms.length > 1) {
        const normTexts: string[] = norms.map((norm) => `${norm.normTitle}: ${norm.normText}`);
        return (
          <Flex vertical>
            {normTexts.map((text, index) => (
              <span key={index}>{text}</span>
            ))}
          </Flex>
        );
      }
    }

    return null;
  };

  const renderUnitText = (unit: string | undefined): string => {
    return unit ? formatUnitString(unit) : '';
  };

  const renderResultValue = (result: string, methodResult: IMethodResult): JSX.Element => {
    let pathologyFlag: EPathology = EPathology.NORMAL;

    if (methodResult.pathologyIndex) {
      if (methodResult.pathologyIndex >= 1.01) {
        pathologyFlag = EPathology.HIGH;
      } else if (methodResult.pathologyIndex <= -1.01) {
        pathologyFlag = EPathology.LOW;
      }
    }

    return (
      <Flex className={styles.result}>
        <span
          className={[
            styles.value,
            pathologyFlag !== EPathology.NORMAL ? styles.redValue : styles.greenValue,
          ].join(' ')}
        >
          {result}
        </span>
        {!Number.isNaN(Number(result)) && renderDeviationIcon(pathologyFlag)}
      </Flex>
    );
  };

  const renderDeviationIcon = (pathology: EPathology): JSX.Element | null => {
    switch (pathology) {
      case EPathology.LOW:
        return <img src={arrowDownIcon} className={styles.arrow} alt="" />;
      case EPathology.HIGH:
        return <img src={arrowUpIcon} className={styles.arrow} alt="" />;
      case EPathology.NORMAL:
      default:
        return null;
    }
  };

  return (
    <Table
      dataSource={results}
      rowKey="_id"
      size="small"
      pagination={false}
      scroll={{ y: 750 }}
      rowClassName={(record: IMethodResult) =>
        isPathologyByIndex(record) ? styles.pathologyRow : 'data-row'
      }
    >
      <Column title="Наименование теста" key="paramName" dataIndex="paramName" />
      <Column title="Результат" key="resultString" dataIndex="resultString" render={renderResultValue} />
      {showUnitColumn && (
        <Column title="Ед. изм" key="methodUnit" dataIndex="methodUnit" render={renderUnitText} />
      )}
      {showNormColumn && (
        <Column title="Норма" key="methodNorms" dataIndex="methodNorms" render={renderNormsText} />
      )}
    </Table>
  );
};
