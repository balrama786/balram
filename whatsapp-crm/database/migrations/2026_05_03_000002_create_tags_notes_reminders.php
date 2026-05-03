<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('tags', function (Blueprint $table): void {$table->id();$table->string('name');$table->string('color')->default('emerald');$table->timestamps();});
        Schema::create('contact_tag', function (Blueprint $table): void {$table->foreignId('contact_id')->constrained()->cascadeOnDelete();$table->foreignId('tag_id')->constrained()->cascadeOnDelete();$table->primary(['contact_id','tag_id']);$table->timestamps();});
        Schema::create('notes', function (Blueprint $table): void {$table->id();$table->foreignId('contact_id')->constrained()->cascadeOnDelete();$table->foreignId('user_id')->constrained()->cascadeOnDelete();$table->text('body');$table->timestamps();});
        Schema::create('follow_up_reminders', function (Blueprint $table): void {$table->id();$table->foreignId('contact_id')->constrained()->cascadeOnDelete();$table->foreignId('user_id')->constrained()->cascadeOnDelete();$table->timestamp('due_at')->index();$table->string('channel')->default('whatsapp');$table->boolean('is_done')->default(false);$table->timestamps();});
    }
    public function down(): void { Schema::dropIfExists('follow_up_reminders'); Schema::dropIfExists('notes'); Schema::dropIfExists('contact_tag'); Schema::dropIfExists('tags'); }
};
