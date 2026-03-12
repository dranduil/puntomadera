<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('user:make-admin {email} {--remove}', function (string $email) {
    $user = User::query()->where('email', $email)->first();

    if (! $user) {
        $this->error("User not found: {$email}");

        return 1;
    }

    $user->is_admin = ! $this->option('remove');
    $user->save();

    $state = $user->is_admin ? 'admin' : 'not admin';
    $this->info("Updated {$email}: {$state}");

    return 0;
})->purpose('Grant or remove admin access for a user');

Artisan::command('user:create-admin {email} {name} {--password=}', function (string $email, string $name) {
    $existing = User::query()->where('email', $email)->exists();

    if ($existing) {
        $this->error("User already exists: {$email}");

        return 1;
    }

    $password = (string) ($this->option('password') ?: Str::random(20));

    $user = User::query()->create([
        'name' => $name,
        'email' => $email,
        'password' => $password,
        'email_verified_at' => now(),
    ]);

    $user->is_admin = true;
    $user->save();

    $this->info("Created admin user: {$email}");

    if (! $this->option('password')) {
        $this->info("Generated password: {$password}");
    }

    return 0;
})->purpose('Create a new verified admin user');
