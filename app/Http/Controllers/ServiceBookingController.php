<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceBookingRequest;
use App\Models\ServiceBooking;
use Illuminate\Http\RedirectResponse;

class ServiceBookingController extends Controller
{
    public function store(StoreServiceBookingRequest $request): RedirectResponse
    {
        ServiceBooking::query()->create($request->validated());

        return redirect('/#booking')->with('booking_status', 'Solicitud enviada. Te contactaremos pronto.');
    }
}
