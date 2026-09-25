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
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained('registrations')->cascadeOnDelete();
            $table->foreignId('lecturer_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('score_business_idea', 5, 2)->nullable(); // Bobot 20
            $table->decimal('score_innovation', 5, 2)->nullable(); // Bobot 20
            $table->decimal('score_market_analysis', 5, 2)->nullable(); // Bobot 20
            $table->decimal('score_financial_plan', 5, 2)->nullable(); // Bobot 20
            $table->decimal('score_presentation', 5, 2)->nullable(); // Bobot 20
            $table->decimal('total_score', 5, 2)->nullable();
            $table->text('comments')->nullable();
            $table->text('recommendation')->nullable();
            $table->string('status')->default('draft'); // 'draft', 'submitted'
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
