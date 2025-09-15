'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './IncomeStatistics.module.scss';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '@/lib/axios';

interface Props {
  filterIndex: number;
  categoryId: number | null;
  subCategoryId: number | null;
}

interface AnalyticsItem {
  title: string;
  income: number;
  salesQuantity: number;
}

const MAX_VISIBLE_BARS = 10;

const IncomeStatistics = ({ filterIndex, categoryId, subCategoryId }: Props) => {
  const [data, setData] = useState<AnalyticsItem[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (categoryId !== null) params.append('categoryID', String(categoryId));
        if (subCategoryId !== null) params.append('subCategoryID', String(subCategoryId));
        params.append('filter', String(filterIndex));

        const res = await api.get<{ items: AnalyticsItem[] }>(
          `/api/Analytics/analytics?${params.toString()}`
        );
        setData(res.data.items ?? []);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setData([]);
      }
    };
    fetchData();
  }, [filterIndex, categoryId, subCategoryId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => setContainerWidth(Math.round(el.getBoundingClientRect().width));

    measure();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    } else {
      const resizeHandler = () => measure();
      window.addEventListener('resize', resizeHandler);
      return () => window.removeEventListener('resize', resizeHandler);
    }
  }, []);

  const effectiveCount = Math.max(1, Math.min(data.length || 1, MAX_VISIBLE_BARS));
  
  const barSize = (() => {
    const perBar = Math.max(40, Math.floor((containerWidth || 360) / effectiveCount));
    const candidate = Math.floor(perBar * 0.65);
    return Math.max(12, Math.min(48, candidate));
  })();

  const chartHeight =
    containerWidth <= 425
      ? 240
      : containerWidth <= 576
      ? 280
      : containerWidth <= 768
      ? 320
      : 400;

  const shouldRotateLabels = (containerWidth || 0) < effectiveCount * 80;
  const xTick = shouldRotateLabels
    ? { angle: -30, textAnchor: 'end', dy: 10, fontSize: 11 }
    : { fontSize: 12 };

  const LyTickStyle = { fontSize: 11, fill: '#0077B2' };
  const RyTickStyle = { fontSize: 11, fill: '#00B207' };

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <div className={styles.chartContainer} style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 12, right: 12, left: 8, bottom: 20 }}
            barCategoryGap="14%"
            barGap={6}
          >

            <XAxis dataKey="title" tick={xTick} interval={0} height={50} />

            <YAxis
              yAxisId="left"
              orientation="left"
              tick={LyTickStyle}
              axisLine={false}
              tickLine={false}
              width={60}
              tickFormatter={(v) => Number(v).toLocaleString('ka-GE')}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={RyTickStyle}
              axisLine={false}
              tickLine={false}
              width={48}
              domain={[0, 'dataMax + 1']}
            />

            <Tooltip
              formatter={(v) => Number(v).toLocaleString('ka-GE')}
              wrapperStyle={{ fontSize: 12 }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              iconType="square"
              iconSize={10}
              verticalAlign="top"
              height={36}
            />

            <Bar
              yAxisId="left"
              dataKey="income"
              name="შემოსავალი"
              fill="#0077B2"
              radius={[6, 6, 0, 0]}
              barSize={barSize}
            />
            <Bar
              yAxisId="right"
              dataKey="salesQuantity"
              name="რაოდენობა"
              fill="#00B207"
              radius={[6, 6, 0, 0]}
              barSize={barSize}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeStatistics;
