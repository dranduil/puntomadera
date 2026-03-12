<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageAdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/contacts', [
            'contacts' => ContactMessage::query()
                ->latest()
                ->paginate(20)
                ->withQueryString(),
        ]);
    }

    public function update(UpdateContactMessageRequest $request, ContactMessage $contact): RedirectResponse
    {
        $contact->update($request->validated());

        return to_route('admin.contacts.index');
    }
}
