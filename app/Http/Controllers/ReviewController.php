<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\CustomerReview;
use App\Support\SimpleCaptcha;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $siteUrl = rtrim((string) config('app.url', 'http://localhost'), '/') ?: 'http://localhost';
        $canonicalUrl = "{$siteUrl}/resenas";
        $seoTitle = 'Opiniones de clientes | Punto Madera Guayaquil';
        $seoDescription = 'Lee opiniones de clientes de Punto Madera en Guayaquil y comparte tu experiencia con muebles, puertas, closets y carpintería a medida.';
        $reviews = CustomerReview::query()
            ->approved()
            ->orderByDesc('published_at')
            ->latest()
            ->get();

        $reviewItems = $reviews->values()->map(fn (CustomerReview $review, int $index) => [
            '@type' => 'ListItem',
            'position' => $index + 1,
            'item' => [
                '@type' => 'Review',
                'author' => [
                    '@type' => 'Person',
                    'name' => $review->name,
                ],
                'datePublished' => ($review->published_at ?? $review->created_at)?->toDateString(),
                'reviewBody' => $review->message,
                'reviewRating' => [
                    '@type' => 'Rating',
                    'ratingValue' => (string) $review->rating,
                    'bestRating' => '5',
                ],
                'itemReviewed' => [
                    '@type' => 'LocalBusiness',
                    'name' => 'Punto Madera',
                    'url' => $siteUrl,
                ],
            ],
        ])->all();

        return Inertia::render('reviews/index', [
            'landing' => [
                'whatsapp_number' => null,
            ],
            'reviews' => $reviews->map->asPublicData()->values()->all(),
            'captcha' => app(SimpleCaptcha::class)->challenge(),
            'reviewStatus' => $request->session()->get('review_status'),
            'seo' => [
                'title' => $seoTitle,
                'description' => $seoDescription,
                'canonical' => $canonicalUrl,
                'jsonLd' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'CollectionPage',
                    '@id' => "{$canonicalUrl}#page",
                    'url' => $canonicalUrl,
                    'name' => $seoTitle,
                    'description' => $seoDescription,
                    'inLanguage' => 'es-EC',
                    'mainEntity' => [
                        '@type' => 'ItemList',
                        'numberOfItems' => count($reviewItems),
                        'itemListElement' => $reviewItems,
                    ],
                ],
            ],
        ]);
    }

    public function store(StoreReviewRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $review = CustomerReview::query()->create([
            'name' => $data['name'],
            'location' => $data['location'] ?? null,
            'rating' => $data['rating'],
            'message' => $data['message'],
            'consent_to_publish' => true,
            'status' => CustomerReview::STATUS_PENDING,
        ]);
        $storedPaths = [];

        $photos = $request->file('photos', []);
        $photos = is_array($photos) ? $photos : [$photos];

        try {
            foreach ($photos as $photo) {
                if ($photo instanceof UploadedFile) {
                    $storedPaths[] = $photo->store("reviews/{$review->getKey()}", 'local');
                }
            }
        } catch (\Throwable $exception) {
            Storage::disk('local')->delete($storedPaths);
            $review->delete();

            throw $exception;
        }

        if ($storedPaths !== []) {
            $review->update(['photos' => $storedPaths]);
        }

        app(SimpleCaptcha::class)->clear();

        return to_route('reviews.index')->with(
            'review_status',
            'Gracias por compartir tu experiencia. La revisaremos antes de publicarla.',
        );
    }
}
