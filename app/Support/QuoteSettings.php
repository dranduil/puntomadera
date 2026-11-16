<?php

namespace App\Support;

use App\Models\HomeLanding;

/**
 * Business-wide quote settings stored on the single HomeLanding row, with the
 * defaults the business agreed on when nothing has been saved yet.
 */
final class QuoteSettings
{
    public const DEFAULT_TERMS = 'Precios en USD. Pueden cambiar sin previo aviso según el costo de materiales y combustible. '
        .'La mano de obra no incluye materiales salvo que diga "material incluido". '
        .'Trabajos a medida: anticipo y saldo a la entrega. '
        .'Si al desmontar aparece daño oculto (humedad, comején), el precio se ajusta antes de continuar. '
        .'Garantía: 3 meses en instalaciones y reparaciones, 1 año en muebles fabricados.';

    /**
     * @return array{terms: string, validity_days: int, deposit_percent: int, iva_enabled: bool, deuna_payment_link: ?string, deuna_qr_url: ?string, bank_transfer_details: ?string, whatsapp_number: string}
     */
    public static function current(): array
    {
        $landing = HomeLanding::query()->first();

        return [
            'terms' => trim((string) $landing?->quote_terms) ?: self::DEFAULT_TERMS,
            'validity_days' => $landing?->quote_validity_days ?: 15,
            'deposit_percent' => $landing?->deposit_percent ?? 50,
            'iva_enabled' => (bool) $landing?->iva_enabled,
            'deuna_payment_link' => $landing?->deuna_payment_link ?: null,
            'deuna_qr_url' => $landing?->deuna_qr_path ? route('quote-settings.qr') : null,
            'bank_transfer_details' => $landing?->bank_transfer_details ?: null,
            'whatsapp_number' => self::whatsappNumber($landing),
        ];
    }

    public static function whatsappNumber(?HomeLanding $landing = null): string
    {
        $landing ??= HomeLanding::query()->first();

        return preg_replace('/\D/', '', (string) (config('services.whatsapp.number') ?: $landing?->whatsapp_number ?: '593998897813'));
    }

    public static function whatsappHref(string $number, string $message): string
    {
        return 'https://wa.me/'.preg_replace('/\D/', '', $number).'?text='.rawurlencode($message);
    }
}
