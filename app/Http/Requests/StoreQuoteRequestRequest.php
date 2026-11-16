<?php

namespace App\Http\Requests;

use App\Models\QuoteRequest;
use App\Support\QuotePackages;
use App\Support\SimpleCaptcha;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreQuoteRequestRequest extends FormRequest
{
    public const CAPTCHA_KEY = 'quote_captcha';

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $publicItem = Rule::exists('catalog_items', 'id')->where('is_public', true)->where('is_active', true);

        return [
            'type' => ['required', Rule::in(QuoteRequest::TYPES)],
            'package' => ['nullable', Rule::in(QuotePackages::keys())],
            'services' => ['nullable', 'array', 'max:10'],
            'services.*' => ['integer', 'distinct', Rule::exists('services', 'id')->where('is_published', true)],
            'items' => ['nullable', 'array', 'max:30'],
            'items.*.catalog_item_id' => ['required', 'integer', 'distinct', $publicItem],
            'items.*.quantity' => ['required', 'numeric', 'min:0.5', 'max:500'],
            'accepted_suggestions' => ['nullable', 'array', 'max:20'],
            'accepted_suggestions.*' => ['integer', 'distinct', $publicItem],
            'message' => ['nullable', 'string', 'max:2000'],
            'photos' => ['nullable', 'array', 'max:5'],
            'photos.*' => [
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
                'dimensions:max_width=4000,max_height=4000',
            ],
            'service_zone_id' => ['required', 'integer', Rule::exists('service_zones', 'id')->where('is_active', true)],
            'sector' => ['nullable', 'string', 'max:120'],
            'name' => ['required', 'string', 'max:80'],
            'phone' => ['required', 'string', 'regex:/^\+?[\d\s\-()]{7,20}$/'],
            'email' => ['nullable', 'email', 'max:120'],
            'company' => ['nullable', 'required_if:type,empresa', 'string', 'max:120'],
            'properties_count' => ['nullable', 'integer', 'min:1', 'max:500'],
            'captcha_answer' => [
                'required',
                'string',
                'max:10',
                function (string $attribute, mixed $value, $fail): void {
                    if (! SimpleCaptcha::for(self::CAPTCHA_KEY)->passes($value)) {
                        $fail('La respuesta de seguridad no es correcta o ya expiró.');
                    }
                },
            ],
            'website' => ['nullable', 'string', 'max:0'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                // filled() treats an empty array as filled, so count the choices instead.
                $choices = count((array) $this->input('services', [])) + count((array) $this->input('items', []));

                if ($choices === 0 && ! $this->filled('package') && $this->input('type') !== 'empresa') {
                    $validator->errors()->add('services', 'Elige al menos un servicio o trabajo.');
                }
            },
        ];
    }

    /** The site runs with the English locale, so the visitor-facing messages are spelled out here. */
    public function messages(): array
    {
        $photo = 'Cada foto debe ser JPG, PNG o WEBP, de máximo 5 MB.';

        return [
            'required' => 'Este dato es obligatorio.',
            'max' => 'Es demasiado largo.',
            'in' => 'Elige una opción válida.',
            'exists' => 'Esa opción ya no está disponible. Recarga la página.',
            'integer' => 'Escribe un número.',
            'numeric' => 'Escribe un número.',
            'distinct' => 'Hay opciones repetidas.',
            'name.required' => 'Escribe tu nombre.',
            'phone.required' => 'Escribe tu número de WhatsApp.',
            'phone.regex' => 'Escribe un número de teléfono válido.',
            'email.email' => 'Escribe un correo válido.',
            'company.required_if' => 'Escribe el nombre de la empresa o negocio.',
            'service_zone_id.required' => 'Elige la zona donde es el trabajo.',
            'items.*.quantity.min' => 'La cantidad mínima es 0,5.',
            'items.*.quantity.max' => 'Para cantidades grandes, cuéntanos en el mensaje.',
            'properties_count.min' => 'Escribe al menos 1.',
            'photos.max' => 'Puedes subir hasta 5 fotos.',
            'photos.*.file' => $photo,
            'photos.*.image' => $photo,
            'photos.*.mimes' => $photo,
            'photos.*.max' => $photo,
            'photos.*.dimensions' => 'Cada foto debe medir máximo 4000 × 4000 píxeles.',
            'captcha_answer.required' => 'Responde la pregunta de seguridad.',
            'website.max' => 'No pudimos enviar tu solicitud.',
        ];
    }
}
