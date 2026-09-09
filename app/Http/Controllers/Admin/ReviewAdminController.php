<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateReviewRequest;
use App\Models\CustomerReview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ReviewAdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/reviews', [
            'reviews' => CustomerReview::query()
                ->latest()
                ->paginate(20)
                ->through(fn (CustomerReview $review) => $review->asAdminData()),
        ]);
    }

    public function update(UpdateReviewRequest $request, CustomerReview $review): RedirectResponse
    {
        $data = $request->validated();
        $data['published_at'] = $data['status'] === CustomerReview::STATUS_APPROVED
            ? ($review->published_at ?? Carbon::now())
            : null;

        $review->update($data);

        return to_route('admin.reviews.index');
    }
}
