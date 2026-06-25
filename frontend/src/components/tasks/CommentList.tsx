'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CommentForm } from '@/components/forms/CommentForm';
import { getInitials, formatDate } from '@/lib/utils';
import api from '@/lib/api';
import { Comment, ApiResponse } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CommentListProps {
  taskId: number;
}

export function CommentList({ taskId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsLoading(true);
    api
      .get<ApiResponse<Comment[]>>(`/tasks/${taskId}/comments`)
      .then(({ data }) => setComments(data.data))
      .finally(() => setIsLoading(false));
  }, [taskId]);

  const addComment = useMutation({
    mutationFn: async (payload: { content: string }) => {
      const { data } = await api.post<ApiResponse<Comment>>(
        `/tasks/${taskId}/comments`,
        payload
      );
      return data.data;
    },
    onSuccess: (comment) => {
      setComments((prev) => [...prev, comment]);
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
  });

  function handleDelete(commentId: number) {
    api.delete(`/tasks/${taskId}/comments/${commentId}`).then(() => {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    });
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-gray-900">
          Comentários ({comments.length})
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <CommentForm
          onSubmit={(data) => addComment.mutate(data)}
          isLoading={addComment.isPending}
        />
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Nenhum comentário ainda
          </p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 group">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {comment.user?.name ? getInitials(comment.user.name) : '?'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {comment.user?.name || 'Usuário'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.created_at, 'relative')}
                    </span>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:underline ml-auto"
                    >
                      Excluir
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
