<?php

namespace App\Repositories;

use App\Models\Contact;
use Illuminate\Support\Collection;

class ConversationRepository
{
    public function forUser(?int $userId): Collection
    {
        return Contact::query()
            ->where('user_id', $userId)
            ->with(['notes', 'tags', 'latestReminder'])
            ->latest('updated_at')
            ->limit(30)
            ->get();
    }
}
