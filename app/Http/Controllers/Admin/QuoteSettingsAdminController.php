<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateQuoteSettingsRequest;
use App\Models\HomeLanding;
use App\Support\QuoteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class QuoteSettingsAdminController extends Controller
{
    public function edit(): Response
    {
        $landing = HomeLanding::query()->first();

        return Inertia::render('admin/quote-settings', [
            'settings' => [
                ...QuoteSettings::current(),
                'quote_terms' => $landing?->quote_terms ?: QuoteSettings::DEFAULT_TERMS,
            ],
        ]);
    }

    public function update(UpdateQuoteSettingsRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $landing = HomeLanding::query()->firstOrNew();
        $qrPath = $landing->deuna_qr_path;

        if ($request->boolean('remove_deuna_qr') && $qrPath) {
            Storage::disk('local')->delete($qrPath);
            $qrPath = null;
        }

        if ($request->hasFile('deuna_qr')) {
            if ($qrPath) {
                Storage::disk('local')->delete($qrPath);
            }

            $qrPath = $request->file('deuna_qr')->store('quote-settings', 'local');
        }

        $landing->fill([
            ...collect($data)->except(['deuna_qr', 'remove_deuna_qr'])->all(),
            'deuna_qr_path' => $qrPath,
        ])->save();

        return back()->with('status', 'Ajustes guardados.');
    }

    /** The Deuna QR is meant to be scanned by clients, so it is served publicly. */
    public function qr(): StreamedResponse
    {
        $path = HomeLanding::query()->value('deuna_qr_path');

        abort_unless($path && Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->response($path, null, ['Cache-Control' => 'public, max-age=300']);
    }
}
