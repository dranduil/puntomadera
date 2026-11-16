const fallbackWhatsappNumber = '593998897813';

/**
 * Business WhatsApp number as digits only. The build-time env value wins over
 * the number saved in the admin, matching the behaviour the public pages had.
 */
export function resolveWhatsAppNumber(landingNumber?: string | null): string {
    const envNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.trim();
    const raw = envNumber || landingNumber?.trim() || fallbackWhatsappNumber;

    return raw.replace(/\D/g, '') || fallbackWhatsappNumber;
}

export function buildWhatsAppHref(number: string, message?: string): string {
    const digits = number.replace(/\D/g, '');

    return message
        ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
        : `https://wa.me/${digits}`;
}

/** "+593 998 897 813" for Ecuadorian mobile numbers, "+<digits>" otherwise. */
export function formatWhatsAppNumber(number: string): string {
    const digits = number.replace(/\D/g, '');

    return digits.length === 12
        ? `+${digits.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')}`
        : `+${digits}`;
}
