'use client';

import { useState } from 'react';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { useProjects } from '@/hooks/useProjects';
import { useSprints } from '@/hooks/useSprints';
import { Select } from '@/components/ui/Select';

export default function KanbanPage() {
  const [projectId, setProjectId] = useState<number | undefined>();
  const [sprintId, setSprintId] = useState<number | undefined>();

  const { data: projectsData } = useProjects(1, '');
  const { data: sprintsData } = useSprints(1, '');

  const projectOptions =
    projectsData?.data.map((p) => ({
      value: p.id,
      label: p.name,
    })) || [];

  const sprintOptions =
    sprintsData?.data.map((s) => ({
      value: s.id,
      label: s.name,
    })) || [];

  return (
    <div className="h-[calc(100vh-112px)] flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 shrink-0">Kanban</h1>

      <div className="flex items-center gap-4 mt-6 shrink-0">
        <Select
          options={projectOptions}
          placeholderOption="Todos os projetos"
          value={String(projectId || '')}
          onChange={(e) =>
            setProjectId(e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-56"
        />
        <Select
          options={sprintOptions}
          placeholderOption="Todas as sprints"
          value={String(sprintId || '')}
          onChange={(e) =>
            setSprintId(e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-56"
        />
      </div>

      <KanbanBoard projectId={projectId} sprintId={sprintId} className="flex-1 min-h-0 mt-4" />
    </div>
  );
}
