'use client';

import { useTimeEntries, useStartTimeEntry, useStopTimeEntry } from '@/hooks/useTimeEntries';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, Pause } from 'lucide-react';
import { formatHours } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface TimeTrackerProps {
  taskId: number;
}

export function TimeTracker({ taskId }: TimeTrackerProps) {
  const { data: entries = [] } = useTimeEntries(taskId);
  const startEntry = useStartTimeEntry();
  const stopEntry = useStopTimeEntry();
  const [description, setDescription] = useState('');
  const [elapsed, setElapsed] = useState(0);

  const runningEntry = entries.find((e) => e.is_running);

  useEffect(() => {
    if (!runningEntry) {
      setElapsed(0);
      return;
    }
    const startTime = new Date(runningEntry.start_time).getTime();
    const initial = Math.floor((Date.now() - startTime) / 1000);
    setElapsed(initial);

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [runningEntry]);

  function handleStart() {
    startEntry.mutate({ task_id: taskId, description });
    setDescription('');
  }

  function handleStop() {
    if (runningEntry) {
      stopEntry.mutate(runningEntry.id);
    }
  }

  const elapsedHours = elapsed / 3600;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {runningEntry ? (
            <>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">
                    Em andamento: {runningEntry.description || 'Sem descrição'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatHours(elapsedHours)}
                </p>
              </div>
              <Button variant="danger" onClick={handleStop} isLoading={stopEntry.isPending}>
                <Pause className="h-4 w-4" />
                Parar
              </Button>
            </>
          ) : (
            <>
              <div className="flex-1">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="O que você está fazendo?"
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <Button onClick={handleStart} isLoading={startEntry.isPending}>
                <Play className="h-4 w-4" />
                Iniciar
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
