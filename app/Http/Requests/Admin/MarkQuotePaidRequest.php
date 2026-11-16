<?php

namespace App\Http\Requests\Admin;

use App\Models\Quote;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MarkQuotePaidRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    public function rules(): array
    {
        return [
            'paid_amount_cents' => ['required', 'integer', 'min:1', 'max:10000000'],
            'payment_method' => ['required', Rule::in(Quote::PAYMENT_METHODS)],
        ];
    }
}
