'use client';

import { useState, useEffect } from 'react';
import { GanttChart } from '@/components/gantt/GanttChart';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Select } from '@/components/ui/Select';
import api from '@/lib/api';
import { Task, Project, ApiResponse } from '@/types';

interface GanttProject {
  id: number;
  name: string;
  planned_start_date?: string;
  planned_end_date?: string;
  status?: { color: string; name: string };
}

export default function GanttPage() {
  const [projects, setProjects] = useState<GanttProject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectId, setProjectId] = useState<number | undefined>();

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.get<ApiResponse<GanttProject[]>>(
        `/gantt/projects${projectId ? `?project_id=${projectId}` : ''}`
      ),
      api.get<ApiResponse<Task[]>>(
        `/gantt/tasks${projectId ? `?project_id=${projectId}` : ''}`
      ),
    ])
      .then(([projRes, taskRes]) => {
        setProjects(projRes.data.data || []);
        setTasks(taskRes.data.data || []);
      })
      .catch(() => {
        setProjects([]);
        setTasks([]);
      })
      .finally(() => setIsLoading(false));
  }, [projectId]);

  // Also load projects list for filter
  const [projectList, setProjectList] = useState<Project[]>([]);
  useEffect(() => {
    api.get<{ data: Project[] }>('/projects?per_page=100').then(({ data }) =>
      setProjectList(data.data || [])
    );
  }, []);

  const projectOptions = projectList.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  if (isLoading) return <LoadingSpinner size="lg" className="py-12" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gantt</h1>
        <Select
          options={projectOptions}
          placeholderOption="Todos os projetos"
          value={String(projectId || '')}
          onChange={(e) =>
            setProjectId(e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-56"
        />
      </div>

      <GanttChart tasks={tasks} projects={projects} />
    </div>
  );
}
