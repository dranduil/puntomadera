<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreWorkRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $images = $this->input('images');

        if (is_string($images)) {
            $parsed = collect(preg_split('/[\r\n,]+/', $images))
                ->map(fn ($value) => trim($value))
                ->filter()
                ->values()
                ->all();

            $this->merge([
                'images' => $parsed,
            ]);
        }

        $slug = $this->input('slug');
        if (is_string($slug)) {
            $slug = trim($slug);
            $this->merge([
                'slug' => $slug === '' ? null : Str::slug($slug),
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
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'description' => ['nullable', 'string', 'max:4000'],
            'worked_on' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'images' => ['nullable', 'array', 'max:30'],
            'images.*' => ['string', 'url', 'max:2048'],
            'is_published' => ['required', 'boolean'],
        ];
    }
}
