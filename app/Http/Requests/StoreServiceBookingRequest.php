<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'phone' => [
                'required',
                'string',
                'max:30',
                'regex:/^[0-9+\\s()\\-]{7,30}$/',
            ],
            'service' => [
                'required',
                'string',
                Rule::in([
                    'muebles-a-medida',
                    'cocinas-anaqueles',
                    'closets',
                    'puertas',
                    'reparacion',
                    'ebanisteria',
                ]),
            ],
            'preferred_date' => ['nullable', 'date'],
            'preferred_time' => ['nullable', 'string', 'max:30'],
            'message' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
