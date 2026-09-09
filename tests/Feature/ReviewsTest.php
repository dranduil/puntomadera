<?php

use App\Models\CustomerReview;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('the reviews page exposes only approved reviews and crawlable metadata', function () {
    config(['app.url' => 'https://punto-madera.com']);

    $approved = CustomerReview::query()->create([
        'name' => 'Ana Pérez',
        'location' => 'Guayaquil',
        'rating' => 5,
        'message' => 'Excelente trabajo de carpintería y muy buena atención.',
        'consent_to_publish' => true,
        'status' => CustomerReview::STATUS_APPROVED,
        'published_at' => now(),
    ]);
    CustomerReview::query()->create([
        'name' => 'Borrador privado',
        'rating' => 5,
        'message' => 'Esta opinión todavía no debe aparecer al público.',
        'consent_to_publish' => true,
        'status' => CustomerReview::STATUS_PENDING,
    ]);

    $response = $this->get(route('reviews.index'));

    $response->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reviews/index')
            ->where('reviews.0.id', $approved->id)
            ->where('reviews.0.name', 'Ana Pérez')
            ->has('captcha.question')
            ->where('seo.canonical', 'https://punto-madera.com/resenas'));

    expect($response->getContent())
        ->toContain('<title inertia>Opiniones de clientes | Punto Madera Guayaquil</title>')
        ->toContain('https://punto-madera.com/resenas')
        ->toContain('application/ld+json')
        ->toContain('Excelente trabajo de carpintería')
        ->not->toContain('Esta opinión todavía no debe aparecer');
});

test('a visitor can submit a review with up to three stored photos', function () {
    Storage::fake('local');

    $response = $this->withSession([
        'review_captcha' => [
            'question' => '¿Cuánto es 3 + 4?',
            'answer' => hash('sha256', '7'),
            'expires_at' => now()->addMinutes(5)->timestamp,
        ],
    ])->post(route('reviews.store'), [
        'name' => 'Carlos Gómez',
        'location' => 'Samborondón',
        'rating' => 5,
        'message' => 'El resultado quedó muy bonito y cumplieron los tiempos.',
        'photos' => [UploadedFile::fake()->image('closet.jpg', 1200, 800)],
        'consent_to_publish' => '1',
        'captcha_answer' => '7',
    ]);

    $response->assertRedirect(route('reviews.index'))
        ->assertSessionHas('review_status');

    $review = CustomerReview::query()->firstOrFail();

    expect($review->status)->toBe(CustomerReview::STATUS_PENDING)
        ->and($review->consent_to_publish)->toBeTrue()
        ->and($review->photos)->toHaveCount(1);

    Storage::disk('local')->assertExists($review->photos[0]);
});

test('the review form rejects an incorrect captcha and honeypot submission', function () {
    $response = $this->withSession([
        'review_captcha' => [
            'question' => '¿Cuánto es 3 + 4?',
            'answer' => hash('sha256', '7'),
            'expires_at' => now()->addMinutes(5)->timestamp,
        ],
    ])->post(route('reviews.store'), [
        'name' => 'Spam Robot',
        'rating' => 5,
        'message' => 'Este texto es suficientemente largo para validar.',
        'consent_to_publish' => '1',
        'captcha_answer' => '8',
        'website' => 'https://spam.example',
    ]);

    $response->assertSessionHasErrors(['captcha_answer', 'website']);
    expect(CustomerReview::query()->count())->toBe(0);
});

test('only approved review photos are public and admins can moderate submissions', function () {
    Storage::fake('local');

    $review = CustomerReview::query()->create([
        'name' => 'María López',
        'rating' => 4,
        'message' => 'Muy buen trabajo y excelente comunicación.',
        'consent_to_publish' => true,
        'status' => CustomerReview::STATUS_PENDING,
    ]);
    $photoPath = UploadedFile::fake()
        ->image('project.jpg', 800, 600)
        ->store("reviews/{$review->getKey()}", 'local');
    $review->update(['photos' => [$photoPath]]);

    $this->get(route('reviews.photo', [$review, basename($photoPath)]))
        ->assertNotFound();

    $admin = User::factory()->create(['is_admin' => true]);

    $this->actingAs($admin)
        ->patch(route('admin.reviews.update', $review), [
            'status' => CustomerReview::STATUS_APPROVED,
            'admin_notes' => 'Verificada con el cliente.',
        ])
        ->assertRedirect(route('admin.reviews.index'));

    $review->refresh();

    expect($review->status)->toBe(CustomerReview::STATUS_APPROVED)
        ->and($review->published_at)->not->toBeNull()
        ->and($review->admin_notes)->toBe('Verificada con el cliente.');

    $this->get(route('reviews.photo', [$review, basename($photoPath)]))
        ->assertOk();
});

test('the sitemap includes the public reviews page', function () {
    config(['app.url' => 'https://punto-madera.com']);

    $response = $this->get(route('sitemap'));

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('<loc>https://punto-madera.com/resenas</loc>');
});
