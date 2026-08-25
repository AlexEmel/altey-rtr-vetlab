import { DynamicChart } from '@/components/entities/DynamicsChart/DynamicChart';
import { DynamicsTable } from '@/components/lists/DynamicsTable/DynamicsTable';
import { GoBackButton } from '@/components/ui/buttons/GoBackButton/GoBackButton';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { getDynamics } from '@/features/dynamics.slice';
import { IDynamicGroup } from '@/interfaces/entities/dynamics.interface';
import { IPet } from '@/interfaces/entities/order.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
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
  const [chartGroups, setChartGroups] = useState<IDynamicGroup[]>([]);
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
      setChartGroups(dynamics.groupDynamics.filter((group) => group.dynamicResults.length > 0));
    }
  }, [dynamics]);

  const getTitle = (groupName: string, patient: IPet): string => {
    const patientFullName = patient.nickname;
    const bornDateString = patient.bornDate ? new Date(patient.bornDate).toLocaleDateString() : 'неизвестна';
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
            <Title level={4}>{getTitle(dynamics.groupName, currentOrder.pet)}</Title>
          </Flex>
        )}
        {chartGroups.length > 0 && (
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
            <DynamicsTable groups={dynamics.groupDynamics} />
          </Flex>
        ) : (
          <Flex className={styles.chartList}>
            {chartGroups.length > 0 ? (
              <>
                {chartGroups.map((group) => (
                  <DynamicChart key={group.testId} group={group} />
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
