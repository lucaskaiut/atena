<?php

namespace App\Enums;

enum TaskStatusEnum: string
{
    case BACKLOG = 'backlog';
    case TODO = 'todo';
    case IN_PROGRESS = 'in_progress';
    case REVIEW = 'review';
    case APPROVAL = 'approval';
    case DONE = 'done';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match($this) {
            self::BACKLOG => 'Backlog',
            self::TODO => 'A Fazer',
            self::IN_PROGRESS => 'Em Andamento',
            self::REVIEW => 'Revisão',
            self::APPROVAL => 'Aprovação',
            self::DONE => 'Concluído',
            self::CANCELLED => 'Cancelado',
        };
    }
}
