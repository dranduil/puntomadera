<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UpdateServiceRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $steps = $this->input('process_steps');

        if (is_string($steps)) {
            $parsed = collect(preg_split('/[\r\n]+/', $steps))
                ->map(fn ($value) => trim($value))
                ->filter()
                ->values()
                ->all();

            $this->merge([
                'process_steps' => $parsed,
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
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'summary' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:4000'],
            'process_steps' => ['nullable', 'array', 'max:20'],
            'process_steps.*' => ['string', 'max:200'],
            'default_message' => ['nullable', 'string', 'max:2000'],
            'is_published' => ['required', 'boolean'],
        ];
    }
}
