import { Form, Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    MessageCircle,
    Printer,
    Wallet,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { FlashStatus } from '@/components/flash-status';
import InputError from '@/components/input-error';
import { SeoHead } from '@/components/seo-head';
import type { Seo } from '@/components/seo-head';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCents } from '@/lib/money';
import { accept, payment as reportPayment } from '@/routes/quotes/public';

type QuoteItem = {
    description: string;
    unit: string;
    unit_label: string;
    quantity: number;
    unit_price_cents: number;
    total_cents: number;
};

type Props = {
    token: string;
    quote: {
        number: string;
        client_name: string;
        status: string;
        created_at: string;
        valid_until: string | null;
        expired: boolean;
        items: QuoteItem[];
        travel_fee_cents: number;
        visit_fee_cents: number;
        discount_cents: number;
        subtotal_cents: number;
        iva_percent: number;
        iva_cents: number;
        total_cents: number;
        deposit_percent: number;
        deposit_cents: number;
        notes: string | null;
        terms: string | null;
        accepted: boolean;
        payment_reported: boolean;
        paid: boolean;
    };
    payment: {
        deuna_link: string | null;
        deuna_qr_url: string | null;
        bank_transfer_details: string | null;
    };
    whatsapp: {
        paid_href: string;
        question_href: string;
        renew_href: string;
    };
    seo: Seo;
};

function quantityLabel(item: QuoteItem): string {
    if (item.unit === 'porcentaje') {
        return `${item.quantity}%`;
    }

    if (item.unit === 'servicio') {
        return '1 servicio';
    }

    const amount = Number.isInteger(item.quantity)
        ? String(item.quantity)
        : item.quantity.toLocaleString('es-EC');

    return item.unit === 'unidad'
        ? `${amount} × ${formatCents(item.unit_price_cents)}`
        : `${amount} ${item.unit_label} × ${formatCents(item.unit_price_cents)}`;
}

export default function QuoteShow({
    token,
    quote,
    payment,
    whatsapp,
    seo,
}: Props) {
    const { errors } = usePage<{ errors: Record<string, string> }>().props;
    const itemsTotal = quote.items.reduce(
        (sum, item) => sum + item.total_cents,
        0,
    );
    const rows: [string, number][] = [
        ['Trabajos y materiales', itemsTotal],
        ['Movilización', quote.travel_fee_cents],
        ['Visita técnica', quote.visit_fee_cents],
        ['Descuento', -quote.discount_cents],
    ];
    const hasPaymentOptions = Boolean(
        payment.deuna_link ||
        payment.deuna_qr_url ||
        payment.bank_transfer_details,
    );

    return (
        <>
            <SeoHead seo={seo} />

            <div className="min-h-screen bg-background text-foreground print:bg-white">
                <header className="border-b border-border/60 bg-card print:border-0">
                    <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5 sm:px-6">
                        <Link
                            href="/"
                            className="flex items-center gap-3 text-primary"
                        >
                            <AppLogoIcon
                                className="size-10 text-primary"
                                aria-hidden="true"
                            />
                            <span className="leading-none">
                                <span className="block text-sm font-light tracking-[0.38em] lowercase">
                                    punto madera
                                </span>
                                <span className="mt-1 block text-[0.58rem] tracking-[0.32em] text-muted-foreground uppercase">
                                    Guayaquil, Ecuador
                                </span>
                            </span>
                        </Link>
                    </div>
                </header>

                <main className="mx-auto grid max-w-3xl gap-6 px-4 py-8 sm:px-6 sm:py-10">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <div className="text-sm text-muted-foreground">
                                Cotización
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                {quote.number}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Para {quote.client_name} · {quote.created_at}
                                {quote.valid_until &&
                                    ` · válida hasta el ${quote.valid_until}`}
                            </p>
                        </div>
                        {quote.paid ? (
                            <Badge>Pagada</Badge>
                        ) : quote.accepted ? (
                            <Badge>Aceptada</Badge>
                        ) : quote.expired ? (
                            <Badge variant="destructive">Vencida</Badge>
                        ) : null}
                    </div>

                    <div className="print:hidden">
                        <FlashStatus />
                        <InputError message={errors.quote} />
                    </div>

                    <Card className="shadow-none">
                        <CardContent className="p-0">
                            <ul className="divide-y">
                                {quote.items.map((item, position) => (
                                    <li
                                        key={`${item.description}-${position}`}
                                        className="flex items-start justify-between gap-4 p-4"
                                    >
                                        <div className="min-w-0">
                                            <div className="font-medium">
                                                {item.description}
                                            </div>
                                            <div className="mt-0.5 text-sm text-muted-foreground">
                                                {quantityLabel(item)}
                                            </div>
                                        </div>
                                        <div className="shrink-0 font-medium tabular-nums">
                                            {formatCents(item.total_cents)}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="grid gap-2 border-t bg-muted/30 p-4 text-sm tabular-nums">
                                {rows
                                    .filter(([, cents]) => cents !== 0)
                                    .map(([label, cents]) => (
                                        <div
                                            key={label}
                                            className="flex justify-between"
                                        >
                                            <span className="text-muted-foreground">
                                                {label}
                                            </span>
                                            <span>{formatCents(cents)}</span>
                                        </div>
                                    ))}
                                {quote.iva_percent > 0 && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                Subtotal
                                            </span>
                                            <span>
                                                {formatCents(
                                                    quote.subtotal_cents,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                IVA {quote.iva_percent}%
                                            </span>
                                            <span>
                                                {formatCents(quote.iva_cents)}
                                            </span>
                                        </div>
                                    </>
                                )}
                                <div className="mt-1 flex justify-between border-t pt-3 text-lg font-semibold">
                                    <span>Total</span>
                                    <span>
                                        {formatCents(quote.total_cents)}
                                    </span>
                                </div>
                                {quote.deposit_cents > 0 && (
                                    <div className="flex justify-between font-medium text-primary">
                                        <span>
                                            Anticipo para empezar (
                                            {quote.deposit_percent}%)
                                        </span>
                                        <span>
                                            {formatCents(quote.deposit_cents)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {quote.notes && (
                        <p className="text-sm leading-6 whitespace-pre-wrap">
                            {quote.notes}
                        </p>
                    )}

                    <div className="grid gap-3 print:hidden">
                        {quote.expired && !quote.accepted && (
                            <Card className="border-destructive/40 shadow-none">
                                <CardContent className="grid gap-3 p-5">
                                    <div className="flex items-center gap-2 font-medium">
                                        <Clock className="size-5" />
                                        Esta cotización venció
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Los precios de materiales cambian.
                                        Pídenos una versión actualizada.
                                    </p>
                                    <Button asChild className="w-fit">
                                        <a
                                            href={whatsapp.renew_href}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <MessageCircle />
                                            Pedir actualización
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {!quote.expired && !quote.accepted && (
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Form
                                    {...accept.form(token)}
                                    options={{ preserveScroll: true }}
                                >
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={processing}
                                            className="h-12 w-full sm:w-auto"
                                        >
                                            <CheckCircle2 />
                                            Aceptar cotización
                                        </Button>
                                    )}
                                </Form>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="h-12"
                                >
                                    <a
                                        href={whatsapp.question_href}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <MessageCircle />
                                        Tengo una pregunta
                                    </a>
                                </Button>
                            </div>
                        )}

                        {quote.accepted && !quote.paid && (
                            <Card className="border-primary/30 shadow-none">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Wallet className="size-5 text-primary" />
                                        Paga el anticipo de{' '}
                                        {formatCents(quote.deposit_cents)} para
                                        agendar
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-5">
                                    {payment.deuna_link && (
                                        <Button
                                            asChild
                                            size="lg"
                                            className="h-12 w-full sm:w-auto"
                                        >
                                            <a
                                                href={payment.deuna_link}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Pagar con Deuna
                                            </a>
                                        </Button>
                                    )}
                                    {payment.deuna_qr_url && (
                                        <div className="grid justify-items-start gap-2">
                                            <div className="text-sm font-medium">
                                                O escanea el QR desde tu app del
                                                banco
                                            </div>
                                            <img
                                                src={payment.deuna_qr_url}
                                                alt="Código QR de Deuna para pagar a Punto Madera"
                                                className="size-48 rounded-md border bg-white object-contain p-2"
                                            />
                                        </div>
                                    )}
                                    {payment.bank_transfer_details && (
                                        <div className="grid gap-2">
                                            <div className="text-sm font-medium">
                                                Transferencia bancaria
                                            </div>
                                            <p className="rounded-md bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                                                {payment.bank_transfer_details}
                                            </p>
                                        </div>
                                    )}
                                    {!hasPaymentOptions && (
                                        <p className="text-sm text-muted-foreground">
                                            Te enviamos los datos de pago por
                                            WhatsApp.
                                        </p>
                                    )}

                                    {quote.payment_reported ? (
                                        <p className="flex items-start gap-2 text-sm text-primary">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                                            Gracias. Revisamos tu pago y te
                                            confirmamos la fecha por WhatsApp.
                                        </p>
                                    ) : (
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-fit"
                                        >
                                            <a
                                                href={whatsapp.paid_href}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={() =>
                                                    router.post(
                                                        reportPayment.url(
                                                            token,
                                                        ),
                                                        {},
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                            >
                                                <MessageCircle />
                                                Ya pagué: enviar comprobante
                                            </a>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {quote.paid && (
                            <p className="flex items-center gap-2 text-sm font-medium text-primary">
                                <CheckCircle2 className="size-5" />
                                Pago recibido. ¡Gracias por confiar en Punto
                                Madera!
                            </p>
                        )}

                        <Button
                            type="button"
                            variant="ghost"
                            className="w-fit px-0"
                            onClick={() => window.print()}
                        >
                            <Printer />
                            Descargar o imprimir (PDF)
                        </Button>
                    </div>

                    {quote.terms && (
                        <section className="border-t pt-5 text-xs leading-5 whitespace-pre-wrap text-muted-foreground">
                            <div className="mb-1 font-medium text-foreground">
                                Condiciones
                            </div>
                            {quote.terms}
                        </section>
                    )}
                </main>
            </div>
        </>
    );
}
