import arrowDownIcon from '@/assets/icons/down-arrow.svg';
import arrowUpIcon from '@/assets/icons/up-arrow.svg';
import { EResultStatus, IMethodNorm, IMethodResult } from '@/interfaces/entities/result.interface';
import { formatUnitString, isPathologyResult } from '@/utils/common.util';
import { Flex, Table } from 'antd';
import Column from 'antd/es/table/Column';
import { FC } from 'react';
import styles from './ResultTable.module.scss';

interface IResultTableProps {
  results: IMethodResult[];
}

export const ResultTable: FC<IResultTableProps> = ({ results }): JSX.Element => {
  const showUnitColumn = results.some((r) => Boolean(r.methodUnit));
  const showNormColumn = results.some((r) => Array.isArray(r.methodNorms) && r.methodNorms.length > 0);

  const renderNormsText = (norms: IMethodNorm[]): JSX.Element | null => {
    if (norms && Array.isArray(norms)) {
      if (norms.length === 1) {
        const text = norms.map(formatNorm).join(' ');
        return <div dangerouslySetInnerHTML={{ __html: text }}></div>;
      }

      if (norms.length > 1) {
        const normTexts: string[] = norms.map((norm) => `${norm.normTitle}: ${formatNorm(norm)}`);
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

  const formatNorm = (norm: IMethodNorm): string => {
    if (norm.normText) return norm.normText;
    const { min, max } = norm.normRange ?? {};
    if (min !== undefined && max !== undefined) return `${min}–${max}`;
    if (min !== undefined) return `от ${min}`;
    if (max !== undefined) return `до ${max}`;
    return '';
  };

  const renderUnitText = (unit: string | undefined): string => {
    return unit ? formatUnitString(unit) : '';
  };

  const renderResultValue = (result: string, methodResult: IMethodResult): JSX.Element => {
    const isNormal = methodResult.status === EResultStatus.NORMAL;

    return (
      <Flex className={styles.result}>
        <span
          className={[
            styles.value,
            !isNormal ? styles.redValue : styles.greenValue,
          ].join(' ')}
        >
          {result}
        </span>
        {renderDeviationIcon(methodResult.status)}
      </Flex>
    );
  };

  const renderDeviationIcon = (status: EResultStatus): JSX.Element | null => {
    switch (status) {
      case EResultStatus.LOW:
      case EResultStatus.CRITICAL_LOW:
        return <img src={arrowDownIcon} className={styles.arrow} alt="" />;
      case EResultStatus.HIGH:
      case EResultStatus.CRITICAL_HIGH:
        return <img src={arrowUpIcon} className={styles.arrow} alt="" />;
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
        isPathologyResult(record) ? styles.pathologyRow : 'data-row'
      }
    >
      <Column title="Наименование теста" key="testName" dataIndex="testName" />
      <Column title="Результат" key="value" dataIndex="value" render={renderResultValue} />
      {showUnitColumn && (
        <Column title="Ед. изм" key="methodUnit" dataIndex="methodUnit" render={renderUnitText} />
      )}
      {showNormColumn && (
        <Column title="Норма" key="methodNorms" dataIndex="methodNorms" render={renderNormsText} />
      )}
    </Table>
  );
};
