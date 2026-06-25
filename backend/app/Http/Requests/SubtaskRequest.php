<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubtaskRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'assignee_id' => 'nullable|exists:users,id',
            'status_id' => 'nullable|exists:statuses,id',
            'estimated_hours' => 'nullable|numeric|min:0',
        ];
    }
}
