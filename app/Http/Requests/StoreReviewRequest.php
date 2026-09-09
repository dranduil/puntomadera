<?php

namespace App\Http\Requests;

use App\Support\SimpleCaptcha;
use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:80'],
            'location' => ['nullable', 'string', 'max:100'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'message' => ['required', 'string', 'min:15', 'max:2000'],
            'photos' => ['nullable', 'array', 'max:3'],
            'photos.*' => [
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
                'dimensions:max_width=4000,max_height=4000',
            ],
            'consent_to_publish' => ['accepted'],
            'captcha_answer' => [
                'required',
                'string',
                'max:10',
                function (string $attribute, mixed $value, $fail): void {
                    if (! app(SimpleCaptcha::class)->passes($value)) {
                        $fail('La respuesta de seguridad no es correcta o ya expiró.');
                    }
                },
            ],
            'website' => ['nullable', 'string', 'max:0'],
        ];
    }
}
