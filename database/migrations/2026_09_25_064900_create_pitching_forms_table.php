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
        Schema::create('pitching_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->unique()->constrained('group')->cascadeOnDelete();
            $table->string('logo')->nullable();
            $table->text('problem')->nullable();
            $table->text('solution')->nullable();
            $table->text('product_advantage')->nullable();
            $table->text('target_consumer')->nullable();
            $table->text('marketing_strategy')->nullable();
            $table->text('distribution_channel')->nullable();
            $table->decimal('initial_capital', 15, 2)->nullable();
            $table->decimal('estimated_cost', 15, 2)->nullable();
            $table->decimal('selling_price', 15, 2)->nullable();
            $table->decimal('profit_target', 15, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pitching_forms');
    }
};
