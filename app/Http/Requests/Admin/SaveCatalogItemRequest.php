<?php

namespace App\Http\Requests\Admin;

use App\Models\CatalogItem;
use App\Support\Money;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveCatalogItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    protected function prepareForValidation(): void
    {
        foreach (['price_min', 'price_max', 'cost'] as $field) {
            if (is_string($this->input($field))) {
                $value = trim(str_replace(['$', ' '], '', $this->input($field)));
                $this->merge([$field => $value === '' ? null : str_replace(',', '.', $value)]);
            }
        }

        foreach (['service_id', 'partner_id'] as $field) {
            if ($this->input($field) === '' || $this->input($field) === 'none') {
                $this->merge([$field => null]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'kind' => ['required', Rule::in(CatalogItem::KINDS)],
            'service_id' => ['nullable', 'integer', 'exists:services,id'],
            'partner_id' => ['nullable', 'integer', 'exists:partners,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'unit' => ['required', Rule::in(CatalogItem::UNITS)],
            'price_min' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'price_max' => ['nullable', 'numeric', 'min:0', 'max:100000', 'gte:price_min'],
            'cost' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'includes_material' => ['required', 'boolean'],
            'is_public' => ['required', 'boolean'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    /**
     * Validated data in storage shape: money in cents, percentages as-is.
     *
     * @return array<string, mixed>
     */
    public function catalogData(): array
    {
        $data = $this->validated();
        $toStorage = fn ($value) => $value === null
            ? null
            : ($data['unit'] === 'porcentaje' ? (int) round((float) $value) : Money::toCents($value));

        return [
            ...collect($data)->except(['price_min', 'price_max', 'cost'])->all(),
            'price_min_cents' => $toStorage($data['price_min'] ?? null) ?? 0,
            'price_max_cents' => $toStorage($data['price_max'] ?? null),
            'cost_cents' => $toStorage($data['cost'] ?? null),
        ];
    }
}
