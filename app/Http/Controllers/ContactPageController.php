<?php

namespace App\Http\Controllers;

use App\Models\HomeLanding;
use Inertia\Inertia;
use Inertia\Response;

class ContactPageController extends Controller
{
    public function show(): Response
    {
        $landing = HomeLanding::query()->first();

        return Inertia::render('contact/index', [
            'landing' => $landing?->toArray() ?? [
                'whatsapp_number' => null,
                'contact_email' => null,
                'contact_phone' => null,
            ],
        ]);
    }
}
