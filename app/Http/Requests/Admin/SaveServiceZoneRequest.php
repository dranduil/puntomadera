<?php

namespace App\Http\Requests\Admin;

use App\Support\Money;
use Illuminate\Foundation\Http\FormRequest;

class SaveServiceZoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('neighborhoods'))) {
            $this->merge(['neighborhoods' => collect(preg_split('/[,\r\n]+/', $this->input('neighborhoods')))
                ->map(fn ($value) => trim($value))->filter()->values()->all()]);
        }

        foreach (['travel_fee', 'visit_fee'] as $field) {
            if (is_string($this->input($field))) {
                $value = trim(str_replace(['$', ' '], '', $this->input($field)));
                $this->merge([$field => $value === '' ? null : str_replace(',', '.', $value)]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'neighborhoods' => ['nullable', 'array', 'max:40'],
            'neighborhoods.*' => ['string', 'max:100'],
            'travel_fee' => ['nullable', 'numeric', 'min:0', 'max:1000'],
            'visit_fee' => ['nullable', 'numeric', 'min:0', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:10000'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    /** @return array<string, mixed> */
    public function zoneData(): array
    {
        $data = $this->validated();

        return [
            'name' => $data['name'],
            'neighborhoods' => $data['neighborhoods'] ?? [],
            'travel_fee_cents' => isset($data['travel_fee']) ? Money::toCents($data['travel_fee']) : null,
            'visit_fee_cents' => isset($data['visit_fee']) ? Money::toCents($data['visit_fee']) : null,
            'sort_order' => $data['sort_order'] ?? 0,
            'is_active' => $data['is_active'],
        ];
    }
}
