import { OrderInfo } from '@/components/entities/OrderInfo/OrderInfo';
import { SampleInfo } from '@/components/entities/SampleInfo/SampleInfo';
import { ResultTable } from '@/components/lists/ResultTable/ResultTable';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { getArchiveOrder, setCurrentOrder } from '@/features/archive.slice';
import { getOrderResults } from '@/features/result.slice';
import { IGroupResults } from '@/interfaces/entities/result.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { AreaChartOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip } from 'antd';
import Title from 'antd/es/typography/Title';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ResultsPage.module.scss';

export const ResultsPage = (): JSX.Element => {
  const currentOrder = useAppSelector((store) => store.archive.currentOrder);
  const results = useAppSelector((store) => store.results.results);
  const isLoading = useAppSelector((store) => store.results.isLoading);
  const isOrderLoading = useAppSelector((store) => store.archive.isLoading);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [selectedResults, setSelectedResults] = useState<IGroupResults | null>(null);
  const [currentGroupIdx, setCurrentGroupIdx] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(setCurrentOrder(id));
      dispatch(getArchiveOrder(id));
      dispatch(getOrderResults(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (results && results.groupResults.length > 0) {
      setSelectedResults(results.groupResults[0]);
      setCurrentGroupIdx(0);
    }
  }, [results]);

  const handlePrevClick = (): void => {
    if (results && currentGroupIdx > 0) {
      const prevIdx = currentGroupIdx - 1;
      setCurrentGroupIdx(prevIdx);
      setSelectedResults(results.groupResults[prevIdx]);
    }
  };

  const handleNextClick = (): void => {
    if (results && currentGroupIdx < results.groupResults.length - 1) {
      const nextIdx = currentGroupIdx + 1;
      setCurrentGroupIdx(nextIdx);
      setSelectedResults(results.groupResults[nextIdx]);
    }
  };

  const handleSelectGroup = (group: IGroupResults, index: number): void => {
    setCurrentGroupIdx(index);
    setSelectedResults(group);
  };

  const goToDynamics = (groupId: string): void => {
    if (results) {
      const query = new URLSearchParams({
        groupId,
        patientId: results.patientId,
      }).toString();

      navigate(`/dynamics?${query}`);
    }
  };

  const getGroupBtnStyles = (group: IGroupResults): string => {
    const classes: string[] = [styles.btn];
    if (selectedResults && selectedResults._id === group._id) {
      classes.push(styles.active);
    }
    return classes.join(' ');
  };

  const renderPrevBtn = (): JSX.Element | null => {
    if (results && results.groupResults.length > 1) {
      const isFirstGroup = currentGroupIdx === 0;
      const prevGroupName = isFirstGroup ? '' : results.groupResults[currentGroupIdx - 1].groupName;
      return (
        <Tooltip title={prevGroupName} mouseEnterDelay={0.4} key={`prev-${currentGroupIdx}`}>
          <LeftOutlined
            className={[styles.arrow, isFirstGroup && styles.disabled].join(' ')}
            onClick={handlePrevClick}
          />
        </Tooltip>
      );
    }

    return null;
  };

  const renderNextBtn = (): JSX.Element | null => {
    if (results && results.groupResults.length > 1) {
      const isLastGroup = currentGroupIdx === results.groupResults.length - 1;
      const nextGroupName = isLastGroup ? '' : results.groupResults[currentGroupIdx + 1].groupName;
      return (
        <Tooltip title={nextGroupName} mouseEnterDelay={0.4} key={`next-${currentGroupIdx}`}>
          <RightOutlined
            className={[styles.arrow, isLastGroup && styles.disabled].join(' ')}
            onClick={handleNextClick}
          />
        </Tooltip>
      );
    }

    return null;
  };

  return isLoading || isOrderLoading ? (
    <Spinner />
  ) : (
    <Flex className={styles.page}>
      <Flex className={styles.sidebar}>
        {currentOrder && <OrderInfo order={currentOrder} />}
        {results && (
          <>
            {selectedResults && (
              <SampleInfo barcode={selectedResults.barcode} sampleNumber={selectedResults.sampleNumber} />
            )}
            <Flex className={styles.groupBtns}>
              {results.groupResults.map((group, index) => (
                <Flex
                  key={group._id}
                  className={getGroupBtnStyles(group)}
                  onClick={() => handleSelectGroup(group, index)}
                >
                  <span className={styles.btnTitle}>{group.groupName}</span>
                </Flex>
              ))}
            </Flex>
          </>
        )}
      </Flex>
      <Flex className={styles.resultTable}>
        {results && selectedResults && (
          <>
            <Flex className={styles.tableHeader}>
              <Flex className={styles.titleBox}>
                {renderPrevBtn()}
                <Title level={4} className={styles.groupTitle}>
                  {selectedResults.groupName}
                </Title>
                {renderNextBtn()}
              </Flex>
              <Button
                type="primary"
                icon={<AreaChartOutlined className={styles.dynamicsIcon} />}
                onClick={() => goToDynamics(selectedResults.groupId)}
              >
                Динамическая карта
              </Button>
            </Flex>
            <ResultTable results={selectedResults.methodResults} />
          </>
        )}
      </Flex>
    </Flex>
  );
};
