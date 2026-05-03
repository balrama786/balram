<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SupabaseClient
{
    public function __construct(
        private readonly string $baseUrl,
        private readonly string $serviceRoleKey,
    ) {}

    public function from(string $table, array $query = []): array
    {
        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/rest/v1/{$table}", $query)
            ->throw();

        return $response->json();
    }

    public function insert(string $table, array $payload): array
    {
        $response = Http::withHeaders($this->headers())
            ->post("{$this->baseUrl}/rest/v1/{$table}", $payload)
            ->throw();

        return $response->json();
    }

    private function headers(): array
    {
        return [
            'apikey' => $this->serviceRoleKey,
            'Authorization' => "Bearer {$this->serviceRoleKey}",
            'Content-Type' => 'application/json',
            'Prefer' => 'return=representation',
        ];
    }
}
