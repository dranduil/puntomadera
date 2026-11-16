<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuoteSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    public function rules(): array
    {
        return [
            'quote_terms' => ['nullable', 'string', 'max:4000'],
            'quote_validity_days' => ['required', 'integer', 'min:1', 'max:180'],
            'deposit_percent' => ['required', 'integer', 'min:0', 'max:100'],
            'iva_enabled' => ['required', 'boolean'],
            'deuna_payment_link' => ['nullable', 'url:https', 'max:255'],
            'bank_transfer_details' => ['nullable', 'string', 'max:1000'],
            'deuna_qr' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'remove_deuna_qr' => ['nullable', 'boolean'],
        ];
    }
}
