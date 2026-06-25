'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TaskDetail } from '@/components/tasks/TaskDetail';
import { SubtaskList } from '@/components/tasks/SubtaskList';
import { TimeTracker } from '@/components/tasks/TimeTracker';
import { TimeEntryList } from '@/components/tasks/TimeEntryList';
import { CommentList } from '@/components/tasks/CommentList';
import { TaskHistory } from '@/components/tasks/TaskHistory';

export default function TaskDetailPage() {
  const { id } = useParams();
  const taskId = Number(id);

  return (
    <div className="space-y-6">
      <Link href="/tasks" className="text-sm text-primary hover:underline">
        ← Voltar para tarefas
      </Link>

      <TaskDetail taskId={taskId} />

      <TimeTracker taskId={taskId} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubtaskList taskId={taskId} />
        <TimeEntryList taskId={taskId} />
      </div>

      <CommentList taskId={taskId} />

      <TaskHistory taskId={taskId} />
    </div>
  );
}
