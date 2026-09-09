<?php

namespace App\Http\Requests\Admin;

use App\Models\CustomerReview;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                Rule::in([
                    CustomerReview::STATUS_PENDING,
                    CustomerReview::STATUS_APPROVED,
                    CustomerReview::STATUS_REJECTED,
                ]),
            ],
            'admin_notes' => ['nullable', 'string', 'max:4000'],
        ];
    }
}
