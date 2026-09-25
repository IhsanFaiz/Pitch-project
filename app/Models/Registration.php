<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'period_id',
        'schedule_id',
        'status', // 'registered', 'scheduled', 'pitched', 'passed', 'failed'
        'signing_date',
        'signing_location',
        'signing_notes',
    ];

    protected function casts(): array
    {
        return [
            'signing_date' => 'date',
        ];
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(PitchingPeriod::class, 'period_id');
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(PitchingSchedule::class, 'schedule_id');
    }

    public function assessment(): HasOne
    {
        return $this->hasOne(Assessment::class, 'registration_id');
    }
}
