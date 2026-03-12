<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateServiceBookingRequest;
use App\Models\ServiceBooking;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServiceBookingAdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/bookings', [
            'bookings' => ServiceBooking::query()
                ->latest()
                ->paginate(20)
                ->withQueryString(),
        ]);
    }

    public function update(UpdateServiceBookingRequest $request, ServiceBooking $booking): RedirectResponse
    {
        $booking->update($request->validated());

        return to_route('admin.bookings.index');
    }
}
