import { Head, Link } from '@inertiajs/react';
import { ExternalLink, Plus } from 'lucide-react';
import { FlashStatus } from '@/components/flash-status';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatCents } from '@/lib/money';
import { create, edit, index } from '@/routes/admin/quotes';
import type { BreadcrumbItem } from '@/types';

type QuoteRow = {
    id: number;
    number: string;
    client_name: string;
    request_reference: string | null;
    total_cents: number;
    deposit_cents: number;
    status: string;
    expired: boolean;
    valid_until: string | null;
    created_at: string;
    public_url: string;
    payment_reported: boolean;
};

type Props = {
    quotes: {
        data: QuoteRow[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    status: string | null;
    statuses: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cotizaciones', href: index() },
];

export default function QuotesAdmin({ quotes, status, statuses }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cotizaciones" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <Heading
                        title="Cotizaciones"
                        description="Borradores, enviadas, vistas, aceptadas y pagadas."
                    />
                    <Button asChild>
                        <Link href={create()}>
                            <Plus />
                            Nueva cotización
                        </Link>
                    </Button>
                </div>

                <FlashStatus />

                <div className="flex flex-wrap gap-2">
                    <Button
                        asChild
                        size="sm"
                        variant={status ? 'outline' : 'default'}
                    >
                        <Link href={index()}>Todas</Link>
                    </Button>
                    {statuses.map((value) => (
                        <Button
                            key={value}
                            asChild
                            size="sm"
                            variant={status === value ? 'default' : 'outline'}
                        >
                            <Link href={index({ query: { estado: value } })}>
                                {value}
                            </Link>
                        </Button>
                    ))}
                </div>

                {quotes.data.length === 0 && (
                    <Card className="p-6 text-sm text-muted-foreground">
                        Todavía no hay cotizaciones. Créalas desde una solicitud
                        o con “Nueva cotización”.
                    </Card>
                )}

                <div className="grid gap-3">
                    {quotes.data.map((quote) => (
                        <Card
                            key={quote.id}
                            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="grid gap-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Link
                                        href={edit(quote.id)}
                                        className="font-semibold hover:underline"
                                    >
                                        {quote.number}
                                    </Link>
                                    <Badge
                                        variant={
                                            quote.status === 'pagada'
                                                ? 'default'
                                                : 'outline'
                                        }
                                    >
                                        {quote.status}
                                    </Badge>
                                    {quote.expired && (
                                        <Badge variant="destructive">
                                            vencida
                                        </Badge>
                                    )}
                                    {quote.payment_reported && (
                                        <Badge variant="secondary">
                                            cliente dice que pagó
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {quote.client_name}
                                    {quote.request_reference &&
                                        ` · ${quote.request_reference}`}{' '}
                                    · {quote.created_at}
                                    {quote.valid_until &&
                                        ` · válida hasta ${quote.valid_until}`}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right text-sm tabular-nums">
                                    <div className="font-semibold">
                                        {formatCents(quote.total_cents)}
                                    </div>
                                    <div className="text-muted-foreground">
                                        anticipo{' '}
                                        {formatCents(quote.deposit_cents)}
                                    </div>
                                </div>
                                <Button asChild size="icon" variant="ghost">
                                    <a
                                        href={quote.public_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={`Ver ${quote.number} como cliente`}
                                    >
                                        <ExternalLink />
                                    </a>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {quotes.links.length > 3 && (
                    <div className="flex flex-wrap gap-2">
                        {quotes.links.map((link) => (
                            <Button
                                key={link.label}
                                asChild
                                size="sm"
                                variant={link.active ? 'default' : 'outline'}
                                disabled={!link.url}
                            >
                                <Link href={link.url ?? index()}>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </Link>
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
