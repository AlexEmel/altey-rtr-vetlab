import { IDynamicParam } from '@/interfaces/entities/dynamics.interface';
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
  param: IDynamicParam;
}

const getThemeColor = (token: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
};

const getThemeColorWithAlpha = (token: string, alpha: number): string => {
  return `rgb(${getThemeColor(token)} / ${alpha})`;
};

export const DynamicChart: FC<IDynamicChartProps> = ({ param }): JSX.Element => {
  const successColor = getThemeColor('--color-success');
  const dangerColor = getThemeColor('--color-danger');
  const textColor = getThemeColor('--color-text');
  const primarySoft = getThemeColorWithAlpha('--color-primary-rgb', 0.2);
  const successOverlay = getThemeColorWithAlpha('--color-success-rgb', 0.125);
  const transparentSuccess = getThemeColorWithAlpha('--color-success-rgb', 0);
  const purpleOverlay = getThemeColorWithAlpha('--color-purple-rgb', 0.31);

  const chartData: ChartData<'line'> = {
    labels: param.results.map((d) => new Date(d.datetime).toLocaleDateString()),
    datasets: [
      {
        label: `${param.paramName}, ${formatUnitString(param.unit)}`,
        data: param.results.map((r) => r.valueMax),
        fill: false,
        backgroundColor: param.results.map((result) => (result.isPathology ? dangerColor : successColor)),
        borderColor: param.results.map((result) => (result.isPathology ? dangerColor : primarySoft)),
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
            yMin: param.norm.low || -Infinity,
            yMax: param.norm.high || Infinity,
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

  if (param.norm.high) {
    chartOptions.plugins!.annotation!.annotations = {
      ...chartOptions.plugins?.annotation?.annotations,
      highRangeBox: {
        type: 'box',
        yMin: param.norm.high,
        backgroundColor: purpleOverlay,
        borderColor: purpleOverlay,
        drawTime: 'beforeDatasetsDraw',
      },
    };
  }

  if (param.norm.low) {
    chartOptions.plugins!.annotation!.annotations = {
      ...chartOptions.plugins?.annotation?.annotations,
      lowRangeBox: {
        type: 'box',
        yMax: param.norm.low,
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
