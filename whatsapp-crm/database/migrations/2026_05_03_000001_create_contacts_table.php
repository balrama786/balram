<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('contacts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('phone')->index();
            $table->string('avatar_url')->nullable();
            $table->string('last_message')->nullable();
            $table->string('status')->default('lead');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('contacts'); }
};
