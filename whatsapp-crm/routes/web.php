<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\InboxController;
use App\Http\Controllers\ReminderController;
use Illuminate\Support\Facades\Route;

Route::get('/', [InboxController::class, 'index'])->name('inbox');

Route::prefix('auth')->group(function (): void {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth'])->group(function (): void {
    Route::resource('contacts', ContactController::class);
    Route::resource('reminders', ReminderController::class);
});
