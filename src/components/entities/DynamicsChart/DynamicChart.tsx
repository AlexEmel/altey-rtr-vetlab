import { IDynamicGroup } from '@/interfaces/entities/dynamics.interface';
import { EResultStatus } from '@/interfaces/entities/result.interface';
import { formatUnitString } from '@/utils/common.util';
import { Flex } from 'antd';
import Chart from 'chart.js/auto';
import { CategoryScale, ChartData, ChartOptions } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { FC } from 'react';
import { Line } from 'react-chartjs-2';
import styles from './DynamicChart.module.scss';

Chart.register(CategoryScale, annotationPlugin);

interface IDynamicChartProps {
  group: IDynamicGroup;
}

const getThemeColor = (token: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
};

const getThemeColorWithAlpha = (token: string, alpha: number): string => {
  return `rgb(${getThemeColor(token)} / ${alpha})`;
};

export const DynamicChart: FC<IDynamicChartProps> = ({ group }): JSX.Element => {
  const successColor = getThemeColor('--color-success');
  const dangerColor = getThemeColor('--color-danger');
  const textColor = getThemeColor('--color-text');
  const primarySoft = getThemeColorWithAlpha('--color-primary-rgb', 0.2);
  const successOverlay = getThemeColorWithAlpha('--color-success-rgb', 0.125);
  const transparentSuccess = getThemeColorWithAlpha('--color-success-rgb', 0);
  const purpleOverlay = getThemeColorWithAlpha('--color-purple-rgb', 0.31);

  const chartData: ChartData<'line'> = {
    labels: group.dynamicResults.map((result) => new Date(result.datetime).toLocaleDateString()),
    datasets: [
      {
        label: `${group.testName}, ${formatUnitString(group.unit)}`,
        data: group.dynamicResults.map((result) => result.value),
        fill: false,
        backgroundColor: group.dynamicResults.map((result) =>
          result.status !== EResultStatus.NORMAL ? dangerColor : successColor,
        ),
        borderColor: group.dynamicResults.map((result) =>
          result.status !== EResultStatus.NORMAL ? dangerColor : primarySoft,
        ),
        tension: 0.4,
        pointHoverRadius: 7,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        onClick: () => {},
        labels: {
          boxWidth: 0,
          font: {
            size: 14,
          },
          color: textColor,
        },
      },
      annotation: {
        annotations: {
          normalRangeBox: {
            type: 'box',
            yMin: group.normalLow,
            yMax: group.normalHigh,
            backgroundColor: successOverlay,
            borderColor: transparentSuccess,
            drawTime: 'beforeDatasetsDraw',
          },
        },
      },
    },
    transitions: {
      zoom: {
        animation: {
          duration: 500,
          easing: 'easeOutCubic',
        },
      },
    },
  };

  if (Number.isFinite(group.normalHigh)) {
    chartOptions.plugins!.annotation!.annotations = {
      ...chartOptions.plugins?.annotation?.annotations,
      highRangeBox: {
        type: 'box',
        yMin: group.normalHigh,
        backgroundColor: purpleOverlay,
        borderColor: purpleOverlay,
        drawTime: 'beforeDatasetsDraw',
      },
    };
  }

  if (Number.isFinite(group.normalLow)) {
    chartOptions.plugins!.annotation!.annotations = {
      ...chartOptions.plugins?.annotation?.annotations,
      lowRangeBox: {
        type: 'box',
        yMax: group.normalLow,
        backgroundColor: purpleOverlay,
        borderColor: purpleOverlay,
        drawTime: 'beforeDatasetsDraw',
      },
    };
  }

  return (
    <Flex className={styles.chartContainer}>
      <Line data={chartData} options={chartOptions} />
    </Flex>
  );
};
