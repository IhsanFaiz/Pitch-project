<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PitchingSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'period_id',
        'lecturer_id',
        'date',
        'start_time',
        'end_time',
        'room',
        'is_booked',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'is_booked' => 'boolean',
        ];
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(PitchingPeriod::class, 'period_id');
    }

    public function lecturer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class, 'schedule_id');
    }
}
