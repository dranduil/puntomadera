<?php

namespace App\Http\Requests\Admin;

use App\Models\CatalogItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Quote builder payload. Money arrives in integer cents from the builder. */
class SaveQuoteRequest extends FormRequest
{
    private const MAX_CENTS = 10_000_000;

    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    public function rules(): array
    {
        $cents = ['required', 'integer', 'min:0', 'max:'.self::MAX_CENTS];

        return [
            'quote_request_id' => ['nullable', 'integer', 'exists:quote_requests,id'],
            'client_name' => ['required', 'string', 'max:120'],
            'client_phone' => ['nullable', 'string', 'max:30'],
            'service_zone_id' => ['nullable', 'integer', 'exists:service_zones,id'],
            'travel_fee_cents' => $cents,
            'visit_fee_cents' => $cents,
            'discount_cents' => $cents,
            'iva_percent' => ['required', 'integer', Rule::in([0, 15])],
            'deposit_percent' => ['required', 'integer', 'min:0', 'max:100'],
            'valid_until' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'terms' => ['nullable', 'string', 'max:4000'],
            'payment_link' => ['nullable', 'url:https', 'max:255'],
            'items' => ['required', 'array', 'min:1', 'max:60'],
            'items.*.catalog_item_id' => ['nullable', 'integer', 'exists:catalog_items,id'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.unit' => ['required', Rule::in(CatalogItem::UNITS)],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01', 'max:100000'],
            'items.*.unit_price_cents' => $cents,
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Agrega al menos un ítem.',
            'items.min' => 'Agrega al menos un ítem.',
            'client_name.required' => 'Escribe el nombre del cliente.',
        ];
    }
}
