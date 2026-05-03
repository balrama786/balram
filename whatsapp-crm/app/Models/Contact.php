<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Contact extends Model
{
    protected $fillable = ['user_id', 'name', 'phone', 'avatar_url', 'last_message', 'status'];

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'contact_tag')->withTimestamps();
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    public function latestReminder(): HasOne
    {
        return $this->hasOne(FollowUpReminder::class)->latestOfMany('due_at');
    }
}
