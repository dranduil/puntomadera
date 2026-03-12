<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHomeLandingRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $areas = $this->input('areas_served');

        if (is_string($areas)) {
            $parsed = collect(explode(',', $areas))
                ->map(fn ($value) => trim($value))
                ->filter()
                ->values()
                ->all();

            $this->merge([
                'areas_served' => $parsed,
            ]);
        }
    }

    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    public function rules(): array
    {
        return [
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_subtitle' => ['nullable', 'string', 'max:2000'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:300'],
            'whatsapp_number' => ['nullable', 'string', 'max:40'],
            'contact_email' => ['nullable', 'string', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:40'],
            'areas_served' => ['nullable', 'array', 'max:20'],
            'areas_served.*' => ['string', 'max:80'],
        ];
    }
}
