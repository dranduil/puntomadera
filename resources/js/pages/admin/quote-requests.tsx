import { Form, Head, Link } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';
import { AdminField } from '@/components/admin-field';
import { FlashStatus } from '@/components/flash-status';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/routes/admin/quote-requests';
import type { BreadcrumbItem } from '@/types';

type QuoteRequestRow = {
    id: number;
    reference: string;
    type: string;
    created_at: string;
    name: string;
    phone: string;
    email: string | null;
    whatsapp_href: string;
    summary: string[];
    message: string | null;
    photos: string[];
    source: string;
    status: string;
    referred_partner_id: number | null;
    admin_notes: string | null;
    quotes: { id: number; number: string; status: string }[];
};

type Props = {
    requests: {
        data: QuoteRequestRow[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    status: string | null;
    statuses: string[];
    counts: Record<string, number>;
    partners: { id: number; name: string; trade: string }[];
};

const STATUS_LABELS: Record<string, string> = {
    nuevo: 'Nuevo',
    cotizado: 'Cotizado',
    derivado: 'Derivado a aliado',
    cerrado: 'Cerrado (ganado)',
    perdido: 'Perdido',
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Solicitudes', href: index() }];

const selectClass =
    'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs';

export default function QuoteRequestsAdmin({
    requests,
    status,
    statuses,
    counts,
    partners,
}: Props) {
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Solicitudes de cotización" />

            <div className="flex flex-col gap-6 p-4">
                <Heading
                    title="Solicitudes de cotización"
                    description="Lo que piden los clientes desde /cotizar. Respóndeles por WhatsApp o arma la cotización."
                />

                <FlashStatus />

                <div className="flex flex-wrap gap-2">
                    <Button
                        asChild
                        size="sm"
                        variant={status ? 'outline' : 'default'}
                    >
                        <Link href={index()}>Todas ({total})</Link>
                    </Button>
                    {statuses.map((value) => (
                        <Button
                            key={value}
                            asChild
                            size="sm"
                            variant={status === value ? 'default' : 'outline'}
                        >
                            <Link href={index({ query: { estado: value } })}>
                                {STATUS_LABELS[value] ?? value} (
                                {counts[value] ?? 0})
                            </Link>
                        </Button>
                    ))}
                </div>

                {requests.data.length === 0 && (
                    <Card className="p-6 text-sm text-muted-foreground">
                        No hay solicitudes con este filtro.
                    </Card>
                )}

                {requests.data.map((row) => (
                    <Card key={row.id}>
                        <CardContent className="grid gap-5 p-5 lg:grid-cols-[1fr_320px]">
                            <div className="grid gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-semibold">
                                        {row.reference}
                                    </span>
                                    <Badge
                                        variant={
                                            row.status === 'nuevo'
                                                ? 'default'
                                                : 'outline'
                                        }
                                    >
                                        {STATUS_LABELS[row.status] ??
                                            row.status}
                                    </Badge>
                                    <Badge variant="secondary">
                                        {row.type}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {row.created_at}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                    <span className="font-medium">
                                        {row.name}
                                    </span>
                                    <span>{row.phone}</span>
                                    {row.email && (
                                        <span className="text-muted-foreground">
                                            {row.email}
                                        </span>
                                    )}
                                    <a
                                        href={row.whatsapp_href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                                    >
                                        <MessageCircle className="size-4" />
                                        Escribirle
                                    </a>
                                </div>

                                <ul className="grid gap-1 text-sm text-muted-foreground">
                                    {row.summary.map((line) => (
                                        <li key={line}>{line}</li>
                                    ))}
                                </ul>

                                {row.message && (
                                    <p className="rounded-md bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                                        {row.message}
                                    </p>
                                )}

                                {row.photos.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {row.photos.map((url, photoIndex) => (
                                            <a
                                                key={url}
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Foto ${photoIndex + 1} de ${row.reference}`}
                                                    loading="lazy"
                                                    className="size-20 rounded-md object-cover"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {row.source && (
                                    <div className="text-xs text-muted-foreground">
                                        Origen: {row.source}
                                    </div>
                                )}

                                {row.quotes.length > 0 && (
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        {row.quotes.map((quote) => (
                                            <Badge
                                                key={quote.id}
                                                variant="outline"
                                            >
                                                {quote.number} · {quote.status}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Form
                                {...update.form.patch(row.id)}
                                options={{ preserveScroll: true }}
                                className="grid content-start gap-3"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <AdminField
                                            label="Estado"
                                            htmlFor={`status-${row.id}`}
                                            error={errors.status}
                                        >
                                            <select
                                                id={`status-${row.id}`}
                                                name="status"
                                                defaultValue={row.status}
                                                className={selectClass}
                                            >
                                                {statuses.map((value) => (
                                                    <option
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {STATUS_LABELS[value] ??
                                                            value}
                                                    </option>
                                                ))}
                                            </select>
                                        </AdminField>
                                        <AdminField
                                            label="Aliado (si lo derivas)"
                                            htmlFor={`partner-${row.id}`}
                                            error={errors.referred_partner_id}
                                        >
                                            <select
                                                id={`partner-${row.id}`}
                                                name="referred_partner_id"
                                                defaultValue={
                                                    row.referred_partner_id ??
                                                    ''
                                                }
                                                className={selectClass}
                                            >
                                                <option value="">—</option>
                                                {partners.map((partner) => (
                                                    <option
                                                        key={partner.id}
                                                        value={partner.id}
                                                    >
                                                        {partner.name} ·{' '}
                                                        {partner.trade}
                                                    </option>
                                                ))}
                                            </select>
                                        </AdminField>
                                        <AdminField
                                            label="Notas internas"
                                            htmlFor={`notes-${row.id}`}
                                            error={errors.admin_notes}
                                        >
                                            <Textarea
                                                id={`notes-${row.id}`}
                                                name="admin_notes"
                                                defaultValue={
                                                    row.admin_notes ?? ''
                                                }
                                            />
                                        </AdminField>
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            disabled={processing}
                                        >
                                            Guardar
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                ))}

                {requests.links.length > 3 && (
                    <div className="flex flex-wrap gap-2">
                        {requests.links.map((link) => (
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
