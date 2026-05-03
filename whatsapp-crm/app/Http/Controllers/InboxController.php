<?php

namespace App\Http\Controllers;

use App\Repositories\ConversationRepository;
use Inertia\Inertia;
use Inertia\Response;

class InboxController extends Controller
{
    public function __construct(private readonly ConversationRepository $conversations) {}

    public function index(): Response
    {
        return Inertia::render('inbox-page', [
            'conversations' => $this->conversations->forUser(auth()->id()),
        ]);
    }
}
