<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Group extends Model
{
    use HasFactory;

    protected $table = 'group';

    protected $fillable = [
        'group_name',
        'business_name',
        'business_field',
        'business_category',
        'description',
        'product_service',
        'target_market',
        'status',
    ];

    public function members(): HasMany
    {
        return $this->hasMany(GroupMember::class, 'group_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_members', 'group_id', 'user_id')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function leaderMember(): HasOne
    {
        return $this->hasOne(GroupMember::class, 'group_id')->where('role', 'leader');
    }

    public function pitchingForm(): HasOne
    {
        return $this->hasOne(PitchingForm::class, 'group_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'group_id');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class, 'group_id');
    }

    public function latestRegistration(): HasOne
    {
        return $this->hasOne(Registration::class, 'group_id')->latestOfMany();
    }
}

if (! class_exists('App\Models\group', false)) {
    class_alias(Group::class, 'App\Models\group');
}
