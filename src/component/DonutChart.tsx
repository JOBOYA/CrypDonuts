import React, { useEffect, useRef } from 'react';

import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

interface PieChartComponentProps {
  data: {
    country: string;
    sales: number;
  }[];
}

export const PieChartComponent: React.FC<PieChartComponentProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let root: am5.Root;

    if (chartRef.current !== null) {
      root = am5.Root.new(chartRef.current);
      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(am5percent.PieChart.new(root, {
        radius: am5.percent(90),
        innerRadius: am5.percent(50),
        layout: root.horizontalLayout,
      }));

      const series = chart.series.push(am5percent.PieSeries.new(root, {
        name: 'Series',
        valueField: 'sales',
        categoryField: 'country',
      }));

      series.data.setAll(data);

      series.labels.template.set('visible', false);
      series.ticks.template.set('visible', false);

      series.slices.template.set('strokeOpacity', 0);
      series.slices.template.set(
        'fillGradient',
        am5.RadialGradient.new(root, {
          stops: [
            { brighten: -0.8 },
            { brighten: -0.8 },
            { brighten: -0.5 },
            { brighten: 0 },
            { brighten: -0.5 },
          ],
        }),
      );

      const legend = chart.children.push(
        am5.Legend.new(root, {
          centerY: am5.percent(50),
          y: am5.percent(50),
          layout: root.verticalLayout,
        }),
      );

      legend.valueLabels.template.setAll({ textAlign: 'right' });
      legend.labels.template.setAll({
        maxWidth: 140,
        width: 140,
        oversizedBehavior: 'wrap',
      });

      legend.data.setAll(series.dataItems);

      series.appear(1000, 100);
    }

    return () => {
      if (root) {
        root.dispose();
      }
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }}></div>;
};
