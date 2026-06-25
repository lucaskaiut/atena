<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies');
            $table->foreignId('project_id')->constrained('projects');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('priority')->default('medium');
            $table->foreignId('status_id')->nullable()->constrained('statuses');
            $table->foreignId('sprint_id')->nullable()->constrained('sprints');
            $table->date('start_date')->nullable();
            $table->date('expected_end_date')->nullable();
            $table->decimal('estimated_hours', 8, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
