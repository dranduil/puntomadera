<?php

namespace App\Http\Requests\Admin;

use App\Models\QuoteRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateQuoteRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    protected function prepareForValidation(): void
    {
        if (in_array($this->input('referred_partner_id'), ['', 'none'], true)) {
            $this->merge(['referred_partner_id' => null]);
        }
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(QuoteRequest::STATUSES)],
            'referred_partner_id' => ['nullable', 'required_if:status,derivado', 'integer', 'exists:partners,id'],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'referred_partner_id.required_if' => 'Elige a qué aliado le pasaste el trabajo.',
        ];
    }
}
