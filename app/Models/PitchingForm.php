<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PitchingForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'logo',
        'problem',
        'solution',
        'product_advantage',
        'target_consumer',
        'marketing_strategy',
        'distribution_channel',
        'initial_capital',
        'estimated_cost',
        'selling_price',
        'profit_target',
    ];

    protected function casts(): array
    {
        return [
            'initial_capital' => 'decimal:2',
            'estimated_cost' => 'decimal:2',
            'selling_price' => 'decimal:2',
            'profit_target' => 'decimal:2',
        ];
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'group_id');
    }
}
