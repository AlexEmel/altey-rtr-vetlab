import { DynamicChart } from '@/components/entities/DynamicsChart/DynamicChart';
import { DynamicsTable } from '@/components/lists/DynamicsTable/DynamicsTable';
import { GoBackButton } from '@/components/ui/buttons/GoBackButton/GoBackButton';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { getDynamics } from '@/features/dynamics.slice';
import { IDynamicParam } from '@/interfaces/entities/dynamics.interface';
import { IPatient } from '@/interfaces/entities/patient.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getPatientFullName } from '@/utils/common.util';
import { AreaChartOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Flex, Tooltip } from 'antd';
import Title from 'antd/es/typography/Title';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './DynamicsPage.module.scss';

export const DynamicsPage = (): JSX.Element => {
  const isLoading = useAppSelector((store) => store.dynamics.isLoading);
  const currentOrder = useAppSelector((store) => store.archive.currentOrder);
  const dynamics = useAppSelector((store) => store.dynamics.dynamics);
  const [chartParams, setChartParams] = useState<IDynamicParam[]>([]);
  const [mode, setMode] = useState<'list' | 'chart'>('list');
  const dispatch = useAppDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const groupId = searchParams.get('groupId');
  const patientId = searchParams.get('patientId');

  useEffect(() => {
    if (groupId && patientId) {
      dispatch(getDynamics({ patientId, groupId }));
    }
  }, [dispatch, groupId, patientId]);

  useEffect(() => {
    if (dynamics) {
      const filteredParams = dynamics.params
        .map((p) => {
          const filteredResults = p.results.filter((r) => r.valueMin === null && r.valueMax);
          return { ...p, results: filteredResults };
        })
        .filter((fp) => fp.results.length > 0);
      setChartParams(filteredParams);
    }
  }, [dynamics]);

  const getTitle = (groupName: string, patient: IPatient): string => {
    const patientFullName = getPatientFullName(patient);
    const bornDateString = new Date(patient.bornDate).toLocaleDateString();
    return `${groupName}. Пациент: ${patientFullName}, ${bornDateString} г.р.`;
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <Flex className={styles.container}>
      <Flex className={styles.header}>
        {currentOrder && dynamics && (
          <Flex className={styles.headerInfo}>
            <GoBackButton />
            <Title level={4}>{getTitle(dynamics.groupName, currentOrder.patient)}</Title>
          </Flex>
        )}
        {chartParams.length > 0 && (
          <Tooltip
            title={mode === 'list' ? 'Графическое представление' : 'Табличное представление'}
            mouseEnterDelay={0.4}
            placement="left"
          >
            <span className={styles.modeIcon}>
              {mode === 'list' ? (
                <AreaChartOutlined onClick={() => setMode('chart')} />
              ) : (
                <UnorderedListOutlined onClick={() => setMode('list')} />
              )}
            </span>
          </Tooltip>
        )}
      </Flex>
      {dynamics &&
        (mode === 'list' ? (
          <Flex className={styles.tableContainer}>
            <DynamicsTable params={dynamics.params} />
          </Flex>
        ) : (
          <Flex className={styles.chartList}>
            {chartParams.length > 0 ? (
              <>
                {chartParams.map((param) => (
                  <DynamicChart key={param._id} param={param} />
                ))}
              </>
            ) : (
              <h3>Нет данных о динамике пациента</h3>
            )}
          </Flex>
        ))}
    </Flex>
  );
};
