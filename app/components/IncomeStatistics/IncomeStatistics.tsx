'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './IncomeStatistics.module.scss';
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

const ITEM_WIDTH = 160;
const AXIS_LEFT_WIDTH = 70;
const AXIS_RIGHT_WIDTH = 55;
const DEFAULT_HEIGHT = 400;
const MARGIN = { top: 12, right: 8, left: 8, bottom: 50 };

function generateTicks(max: number, count = 5) {
  if (!max || max <= 0) return [0];
  const step = max / (count - 1);
  const out: number[] = [];
  for (let i = 0; i < count; i++) out.push(Math.round(step * i));
  return out;
}

function formatNumber(v: number) {
  return new Intl.NumberFormat('ka-GE').format(Math.round(v));
}

export default function IncomeStatistics({ filterIndex, categoryId, subCategoryId }: Props) {
  const [data, setData] = useState<AnalyticsItem[]>([]);
  const [maximumDiagram, setMaximumDiagram] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [chartHeight, setChartHeight] = useState(DEFAULT_HEIGHT);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; item?: AnalyticsItem } | null>(null);

  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    function handleResizeHeight() {
      const w = window.innerWidth;
      if (w <= 425) setChartHeight(240);
      else if (w <= 576) setChartHeight(280);
      else if (w <= 768) setChartHeight(320);
      else setChartHeight(DEFAULT_HEIGHT);
    }
    handleResizeHeight();
    window.addEventListener('resize', handleResizeHeight);
    return () => window.removeEventListener('resize', handleResizeHeight);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth || 0);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (categoryId !== null) params.append('categoryID', String(categoryId));
        if (subCategoryId !== null) params.append('subCategoryID', String(subCategoryId));
        params.append('filter', String(filterIndex));
        const res = await api.get<{ items: AnalyticsItem[]; maximumDiagram?: number }>(
          `/api/Analytics/analytics?${params.toString()}`
        );


        setData(res.data.items);
        setMaximumDiagram(res.data.maximumDiagram ?? null);
      } catch (err) {
        console.log(err)
        setData([]);
        setMaximumDiagram(null);
      }
    };
    fetchData();
  }, [filterIndex, categoryId, subCategoryId]);

  const requiredChartWidth = Math.max(ITEM_WIDTH * Math.max(1, data.length), ITEM_WIDTH);
  const svgWidth = Math.max(requiredChartWidth, containerWidth || 0);

  const innerWidth = Math.max(0, svgWidth - MARGIN.left - MARGIN.right);
  const innerHeight = Math.max(20, chartHeight - MARGIN.top - MARGIN.bottom);

  const leftMax = useMemo(() => {
    if (maximumDiagram && maximumDiagram > 0) return maximumDiagram;
    return Math.max(...data.map((d) => d.income), 0);
  }, [data, maximumDiagram]);

  const rightMax = useMemo(() => Math.max(...data.map((d) => d.salesQuantity), 0), [data]);

  const leftTicks = useMemo(() => generateTicks(leftMax), [leftMax]);
  const rightTicks = useMemo(() => generateTicks(rightMax), [rightMax]);

  const valueToYLeft = (v: number) => {
    const max = leftMax > 0 ? leftMax : 1;
    return MARGIN.top + (1 - v / max) * innerHeight;
  };

  const valueToYRight = (v: number) => {
    const max = rightMax > 0 ? rightMax : 1;
    return MARGIN.top + (1 - v / max) * innerHeight;
  };

  const bandWidth = data.length > 0 ? innerWidth / data.length : innerWidth;
  const barInnerWidth = Math.max(12, Math.min(ITEM_WIDTH * 0.5, bandWidth * 0.5));
  const gapBetweenBars = Math.max(6, Math.min(14, bandWidth * 0.1));

  const onBarEnter = (e: React.MouseEvent, item: AnalyticsItem) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;

    const margin = 12;
    let x = e.clientX - rect.left + 8;
    let y = e.clientY - rect.top - 8;

    const maxX = rect.width - 220;
    if (x > maxX) x = Math.max(margin, maxX);
    if (x < margin) x = margin;
    if (y < 40) y = 40;

    setTooltip({ visible: true, x, y, item });
  };

  const onBarLeave = () => setTooltip(null);

  const legendTop = chartHeight + 8;
  const wrapperMinHeight = chartHeight + 80; 

  return (
    <div className={styles.wrapper} ref={wrapperRef} style={{ minHeight: wrapperMinHeight }}>
      <div className={styles.axisLeft} style={{ width: AXIS_LEFT_WIDTH, height: chartHeight }}>
        {leftTicks.map((t) => (
          <div
            key={t}
            className={styles.axisLabel}
            style={{ top: valueToYLeft(t), right: 6, transform: 'translateY(-50%)', color: '#0077B2' }}
          >
            {formatNumber(t)}
          </div>
        ))}
      </div>

      <div className={styles.axisRight} style={{ width: AXIS_RIGHT_WIDTH, height: chartHeight }}>
        {rightTicks.map((t) => (
          <div
            key={t}
            className={styles.axisLabel}
            style={{ top: valueToYRight(t), left: 6, transform: 'translateY(-50%)', color: '#00B207' }}
          >
            {formatNumber(t)}
          </div>
        ))}
      </div>

      <div
        className={styles.scrollArea}
        ref={scrollRef}
        style={{
          position: 'absolute',
          left: AXIS_LEFT_WIDTH,
          right: AXIS_RIGHT_WIDTH,
          top: 0,
          height: chartHeight,
        }}
      >
        <svg width={svgWidth} height={chartHeight} style={{ minWidth: '100%', display: 'block' }}>
          {leftTicks.map((t, idx) => {
            const y = valueToYLeft(t);
            return <line key={`g-${idx}`} x1={MARGIN.left} x2={svgWidth - MARGIN.right} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" />;
          })}

          {data.map((d, i) => {
            const cx = MARGIN.left + i * bandWidth + bandWidth / 2;
            const groupWidth = barInnerWidth * 2 + gapBetweenBars;

            const incomeHeight = innerHeight * (d.income / (leftMax || 1));
            const salesHeight = innerHeight * (d.salesQuantity / (rightMax || 1));

            return (
              <g key={d.title} onMouseMove={(e) => onBarEnter(e, d)} onMouseLeave={onBarLeave}>
                <rect
                  x={cx - groupWidth / 2 + 12}
                  y={MARGIN.top + innerHeight - incomeHeight}
                  width={60}
                  height={incomeHeight}
                  rx={6}
                  fill="#0077B2"
                />
                <rect
                  x={cx - groupWidth / 2 + barInnerWidth + gapBetweenBars - 12}
                  y={MARGIN.top + innerHeight - salesHeight}
                  width={60}
                  height={salesHeight}
                  rx={6}
                  fill="#00B207"
                />
                <text x={cx} y={chartHeight - MARGIN.bottom + 20} fontSize={12} textAnchor="middle">
                  {d.title}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div
        className={styles.legend}
        style={{
          position: 'absolute',
          left: AXIS_LEFT_WIDTH,
          right: AXIS_RIGHT_WIDTH,
          top: legendTop,
          gap: 16,
        }}
      >
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#0077B2' }} />
          <span>შემოსავლი</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#00B207' }} />
          <span>რაოდენობა</span>
        </div>
      </div>

      {tooltip?.visible && tooltip.item && (
        <div className={styles.tooltip} style={{ left: tooltip.x, top: tooltip.y }}>
          <div className={styles.tooltipTitle}>{tooltip.item.title}</div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipDot} style={{ background: '#0077B2' }} />
            შემოსავალი: {formatNumber(tooltip.item.income)}
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipDot} style={{ background: '#00B207' }} />
            რაოდენობა: {formatNumber(tooltip.item.salesQuantity)}
          </div>
        </div>
      )}
    </div>
  );
}
