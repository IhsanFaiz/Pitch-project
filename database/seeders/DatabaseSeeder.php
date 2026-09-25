<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $password = 'admin123';

        User::factory()->create([
            'username' => 'Faiz',
            'email' => 'faiz@example.com',
            'password' => Hash::make($password),
        ]);
    }
}
