<?php

namespace App\Http\Controllers;

use App\Models\CustomerReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReviewPhotoController extends Controller
{
    public function show(Request $request, CustomerReview $review, string $photo): BinaryFileResponse
    {
        abort_unless(
            $review->status === CustomerReview::STATUS_APPROVED
                || $request->user()?->is_admin,
            404,
        );

        $path = collect($review->photos ?? [])
            ->first(fn ($path) => is_string($path) && basename($path) === $photo);

        abort_unless(is_string($path) && Storage::disk('local')->exists($path), 404);

        return response()->file(Storage::disk('local')->path($path), [
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }
}
