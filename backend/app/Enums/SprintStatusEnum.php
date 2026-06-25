<?php

namespace App\Enums;

enum SprintStatusEnum: string
{
    case PLANNING = 'planning';
    case ACTIVE = 'active';
    case COMPLETED = 'completed';

    public function label(): string
    {
        return match($this) {
            self::PLANNING => 'Planejamento',
            self::ACTIVE => 'Ativo',
            self::COMPLETED => 'Concluído',
        };
    }
}
