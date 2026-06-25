'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { formatDate } from '@/lib/utils';

interface GanttChartProps {
  tasks: Task[];
  projects: { id: number; name: string; planned_start_date?: string; planned_end_date?: string; status?: { color: string; name: string } }[];
}

export function GanttChart({ tasks, projects }: GanttChartProps) {
  const today = new Date();
  const [startDate] = useState(() => {
    const allDates = [...tasks, ...projects]
      .flatMap((item) => [
        item.planned_start_date ? new Date(item.planned_start_date) : null,
        item.planned_end_date ? new Date(item.planned_end_date) : null,
      ])
      .filter(Boolean) as Date[];

    if (allDates.length === 0) return new Date(today.getFullYear(), today.getMonth(), 1);
    const min = new Date(Math.min(...allDates.map((d) => d.getTime())));
    min.setDate(1);
    return min;
  });

  const [endDate] = useState(() => {
    const allDates = [...tasks, ...projects]
      .flatMap((item) => [
        item.planned_start_date ? new Date(item.planned_start_date) : null,
        item.planned_end_date ? new Date(item.planned_end_date) : null,
      ])
      .filter(Boolean) as Date[];

    if (allDates.length === 0) return new Date(today.getFullYear(), today.getMonth() + 3, 0);
    const max = new Date(Math.max(...allDates.map((d) => d.getTime())));
    max.setMonth(max.getMonth() + 1);
    return max;
  });

  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const dayWidth = Math.max(30, Math.min(60, 1200 / totalDays));

  const months: { label: string; days: number; startDay: number }[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    const startDay = Math.ceil(
      (monthStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const days = Math.min(
      monthEnd.getDate(),
      Math.ceil((endDate.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
    months.push({
      label: monthStart.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      days,
      startDay,
    });
    current.setMonth(current.getMonth() + 1);
  }

  function getBarPosition(start?: string, end?: string) {
    if (!start || !end) return null;
    const s = new Date(start);
    const e = new Date(end);
    const left =
      ((s.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) * dayWidth;
    const width =
      ((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) * dayWidth + dayWidth;
    return { left: Math.max(0, left), width: Math.max(dayWidth / 2, width) };
  }

  const todayOffset =
    ((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) * dayWidth;

  const allItems = [
    ...projects.map((p, i) => ({
      id: `project-${p.id}`,
      name: p.name,
      start: p.planned_start_date,
      end: p.planned_end_date,
      color: p.status?.color || '#3b82f6',
      type: 'project' as const,
      index: i,
    })),
    ...tasks.map((t, i) => ({
      id: `task-${t.id}`,
      name: t.title,
      start: t.planned_start_date,
      end: t.planned_end_date,
      color: t.status?.color || '#8b5cf6',
      type: 'task' as const,
      index: i,
    })),
  ];

  const rowHeight = 36;
  const headerHeight = 60;
  const labelWidth = 250;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <div style={{ minWidth: totalDays * dayWidth + labelWidth }}>
          <div className="flex" style={{ height: headerHeight }}>
            <div
              className="flex-shrink-0 border-b border-r border-gray-200 bg-gray-50 flex items-end px-3 py-2"
              style={{ width: labelWidth }}
            >
              <span className="text-xs font-semibold text-gray-500 uppercase">Item</span>
            </div>
            <div className="flex-1 relative border-b border-gray-200 bg-gray-50">
              {months.map((m, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full border-r border-gray-200 flex items-center justify-center text-xs text-gray-500"
                  style={{
                    left: m.startDay * dayWidth,
                    width: m.days * dayWidth,
                  }}
                >
                  {m.label}
                </div>
              ))}
              {todayOffset >= 0 && todayOffset <= totalDays * dayWidth && (
                <div
                  className="absolute top-0 h-full border-l-2 border-red-400"
                  style={{ left: todayOffset }}
                />
              )}
            </div>
          </div>

          {allItems.map((item) => {
            const pos = getBarPosition(item.start, item.end);
            return (
              <div key={item.id} className="flex border-b border-gray-100" style={{ height: rowHeight }}>
                <div
                  className="flex-shrink-0 border-r border-gray-200 flex items-center px-3 bg-white"
                  style={{ width: labelWidth }}
                >
                  <span className="text-xs text-gray-700 truncate">
                    {item.type === 'project' ? '📁 ' : '  📋 '}
                    {item.name}
                  </span>
                </div>
                <div className="flex-1 relative">
                  {todayOffset >= 0 && todayOffset <= totalDays * dayWidth && (
                    <div
                      className="absolute top-0 h-full border-l border-red-200"
                      style={{ left: todayOffset }}
                    />
                  )}
                  {pos && (
                    <div
                      className="absolute top-1.5 rounded-full opacity-80"
                      style={{
                        left: pos.left,
                        width: pos.width,
                        height: rowHeight - 12,
                        backgroundColor: item.color,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
          {allItems.length === 0 && (
            <div className="flex items-center justify-center py-12 text-gray-500 text-sm">
              Nenhum item com datas definidas para exibir
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
