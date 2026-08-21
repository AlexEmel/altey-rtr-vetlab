import { StatusTag } from '@/components/entities/OrderStatusTag/OrderStatusTag';
import { TruncatedText } from '@/components/ui/TruncatedText/TruncatedText';
import { setCurrentPage, setSelectedOrders } from '@/features/archive.slice';
import { EViewStatus, IArchiveOrderPreview, ViewStatusWeight } from '@/interfaces/entities/order.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { concatText, formatDatetime, getPatientFullName } from '@/utils/common.util';
import { FileOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Flex, Table, Tooltip } from 'antd';
import Column from 'antd/es/table/Column';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ArchiveList.module.scss';

export const ArchiveList = (): JSX.Element => {
  const { orders, currentPage, selectedOrders, isLoading } = useAppSelector((store) => store.archive);
  const resultViewRules = useAppSelector((store) => store.user.resultViewRules);
  const departments = useAppSelector((store) => store.dictionaries.departments);
  const externalFinanceSources = useAppSelector((store) => store.dictionaries.externalFinanceSources);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const openResults = (orderId: string) => navigate(`/archive/results/${orderId}`);
  const openPdf = (orderId: string) => navigate(`/archive/pdf/${orderId}`);

  const departmentMap = useMemo(() => {
    const depMap = new Map<string, string>();
    for (const dep of departments) {
      depMap.set(dep._id, dep.name);
    }
    return depMap;
  }, [departments]);

  const externalFinanceSourceMap = useMemo(() => {
    const extFinanceSourceMap = new Map<string, string>();
    for (const efs of externalFinanceSources) {
      extFinanceSourceMap.set(efs._id, efs.name);
    }
    return extFinanceSourceMap;
  }, [externalFinanceSources]);

  const getDepartmentName = (id: string) => departmentMap.get(id) ?? 'Неизвестный направитель';
  const getExternalFinanceSourceName = (id: string) => externalFinanceSourceMap.get(id) ?? '';

  const renderStatusColumn = (order: IArchiveOrderPreview): JSX.Element => {
    return (
      <Flex className={styles.statusCell}>
        <StatusTag status={order.status} />
        {order.isPrinted && (
          <Tooltip title="Результаты распечатаны" mouseEnterDelay={0.4}>
            <Flex className={styles.printerIcon}>
              <FileOutlined />
            </Flex>
          </Tooltip>
        )}
      </Flex>
    );
  };

  const renderShowPdfIcon = (order: IArchiveOrderPreview): JSX.Element => {
    return isValidStatus(order.viewStatus) ? (
      <Tooltip title="Бланки результатов" mouseEnterDelay={0.4}>
        <Flex className={styles.actionBtn}>
          <FileSearchOutlined
            onClick={(e) => {
              e.stopPropagation();
              openPdf(order._id);
            }}
          />
        </Flex>
      </Tooltip>
    ) : (
      <Flex className={styles.disabledBtn}>
        <FileSearchOutlined />
      </Flex>
    );
  };

  const renderPatientCell = (order: IArchiveOrderPreview): JSX.Element => {
    const canView = isValidStatus(order.viewStatus);
    return (
      <span
        className={canView ? styles.clickableCell : ''}
        onClick={(e) => {
          e.stopPropagation();
          if (canView) openResults(order._id);
        }}
      >
        {getPatientFullName(order.patient)}
      </span>
    );
  };

  const handlePageChange = (page: number): void => {
    dispatch(setCurrentPage(page));
  };

  const handleSelectOrders = (keys: React.Key[]): void => {
    dispatch(setSelectedOrders(keys as string[]));
  };

  const handleViewResults = (order: IArchiveOrderPreview): void => {
    if (isValidStatus(order.viewStatus)) openResults(order._id);
  };

  function isValidStatus(status: EViewStatus): boolean {
    const statusWeight = ViewStatusWeight[status];
    return statusWeight > 0 && statusWeight <= resultViewRules.view;
  }

  return (
    <Table
      dataSource={orders}
      rowSelection={{
        selectedRowKeys: selectedOrders,
        type: 'checkbox',
        onChange: handleSelectOrders,
      }}
      rowKey={'_id'}
      rowClassName={() => styles.customRow}
      onRow={(record) => ({
        onClick: () => handleViewResults(record),
      })}
      loading={isLoading}
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        current: currentPage || 1,
        onChange: handlePageChange,
      }}
      size="middle"
    >
      <Column key="actions" render={(order: IArchiveOrderPreview) => renderShowPdfIcon(order)} width={25} />
      <Column
        title="Статус"
        key="status"
        render={(order: IArchiveOrderPreview) => {
          return renderStatusColumn(order);
        }}
        width={100}
      />
      <Column
        title="Штрихкод"
        key="barcode"
        dataIndex="barcode"
        render={(barcodes) => <TruncatedText text={concatText(barcodes, ' ')} tooltip={false} />}
        width={100}
      />
      <Column title="Номер проб" key="sampleNumber" dataIndex="sampleNumber" width={100} />
      <Column title="Номер карты" key="historyNumber" dataIndex="historyNumber" width={120} />
      <Column
        title="Пациент"
        key="patientFullName"
        dataIndex="patientFullName"
        width={250}
        render={(_, record: IArchiveOrderPreview) => renderPatientCell(record)}
      />
      <Column
        title="Дата заказа"
        key="datetime"
        dataIndex="datetime"
        render={formatDatetime}
        sorter={(a: IArchiveOrderPreview, b: IArchiveOrderPreview) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        }
        width={150}
      />
      <Column
        title="Исследования"
        key="analysis"
        dataIndex="analysis"
        render={(analysis) => <TruncatedText text={concatText(analysis)} tooltip={analysis.length > 2} />}
        width={300}
      />
      <Column title="Врач" key="doctor" dataIndex="doctor" width={200} />
      <Column
        title="Направитель"
        key="department"
        dataIndex="departmentId"
        render={getDepartmentName}
        width={300}
      />
      <Column
        title="Внешний ИФ"
        key="externalFinanceSource"
        dataIndex="externalFinanceSourceId"
        render={getExternalFinanceSourceName}
        width={200}
      />
    </Table>
  );
};
