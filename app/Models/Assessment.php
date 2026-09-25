<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_id',
        'lecturer_id',
        'score_business_idea',
        'score_innovation',
        'score_market_analysis',
        'score_financial_plan',
        'score_presentation',
        'total_score',
        'comments',
        'recommendation',
        'status', // 'draft', 'submitted'
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'score_business_idea' => 'decimal:2',
            'score_innovation' => 'decimal:2',
            'score_market_analysis' => 'decimal:2',
            'score_financial_plan' => 'decimal:2',
            'score_presentation' => 'decimal:2',
            'total_score' => 'decimal:2',
            'submitted_at' => 'datetime',
        ];
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class, 'registration_id');
    }

    public function lecturer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }
}
