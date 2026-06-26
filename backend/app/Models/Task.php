<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'project_id',
        'title',
        'description',
        'priority',
        'status_id',
        'sprint_id',
        'start_date',
        'expected_end_date',
        'estimated_hours',
    ];

    protected $casts = [
        'start_date' => 'date',
        'expected_end_date' => 'date',
        'estimated_hours' => 'decimal:2',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    public function sprint(): BelongsTo
    {
        return $this->belongsTo(Sprint::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_user');
    }

    public function subtasks(): HasMany
    {
        return $this->hasMany(Subtask::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(TaskHistory::class);
    }

    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
    }

    public function getWorkedHoursAttribute(): float
    {
        return round($this->timeEntries()->sum('duration_minutes') / 60, 2);
    }

    public function getProgressAttribute(): float
    {
        $total = $this->subtasks()->count();
        if ($total === 0) {
            return 0;
        }
        $completed = $this->subtasks()->where('status_id', function($query) {
            $query->select('id')->from('statuses')->where('name', 'done')->limit(1);
        })->count();

        // Alternative: check if subtasks have a completed boolean
        $completed = $this->subtasks()->where('is_completed', true)->count();
        return round(($completed / $total) * 100, 2);
    }
}
