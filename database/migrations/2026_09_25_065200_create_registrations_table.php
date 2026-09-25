<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('group')->cascadeOnDelete();
            $table->foreignId('period_id')->constrained('pitching_periods')->cascadeOnDelete();
            $table->foreignId('schedule_id')->nullable()->constrained('pitching_schedules')->nullOnDelete();
            $table->string('status')->default('registered'); // 'registered', 'scheduled', 'pitched', 'passed', 'failed'
            $table->date('signing_date')->nullable();
            $table->string('signing_location')->nullable();
            $table->text('signing_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};
