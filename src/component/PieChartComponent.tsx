import React, { useEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { useMediaQuery } from 'react-responsive';

interface PieChartComponentProps {
  data: {
    label: string;
    sales: number;
  }[];
}

export const PieChartComponent: React.FC<PieChartComponentProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    let root: am5.Root;

    if (chartRef.current !== null) {
      root = am5.Root.new(chartRef.current);
      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(am5percent.PieChart.new(root, {
        radius: am5.percent(90),
        innerRadius: am5.percent(50),
      }));

      const series = chart.series.push(am5percent.PieSeries.new(root, {
        name: 'Series',
        valueField: 'sales',
        categoryField: 'label',
      }));

      series.data.setAll(data);

      series.adapters.add('tooltipText', (text, target) => {
        if (target.dataItem) {
          const { label } = target.dataItem.dataContext as { label: string };
          return `[bold]{category}: {value.percent.formatNumber('#.#')}%[/]\n${label}`;
        }
        return text;
      });

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
          y: am5.percent(50),
        }),
      );

      legend.valueLabels.template.setAll({ textAlign: 'right' });
      legend.labels.template.setAll({
        maxWidth: 140,
        width: 140,
        oversizedBehavior: 'wrap',
        fontSize: 15,
        fontWeight: 'bold',
      });

 // Legend responsive mobile and desktop
      if (isMobile) {
        legend.set('layout', root.verticalLayout);
        legend.set('centerY', am5.percent(50));
        legend.set('y', am5.percent(50));
        legend.set('x', am5.percent(50));
        legend.set('width', am5.percent(90));
        
      }
      else {
        legend.set('layout', root.horizontalLayout);
        legend.set('centerX', am5.percent(50));
        legend.set('x', am5.percent(50));
        legend.set('y', am5.percent(90));
        legend.set('width', am5.percent(90));
      }


      legend.data.setAll(series.dataItems);

      series.appear(1000, 100);
    }

    return () => {
      if (root) {
        root.dispose();
      }
    };
  }, [data, isMobile]);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
        maxHeight: '1000px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
      className="pie-chart-container"
    ></div>
  );
};