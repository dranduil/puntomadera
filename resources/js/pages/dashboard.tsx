import { Head, Link, router } from '@inertiajs/react';
import { BellRing, ChevronRight, Inbox, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatCents } from '@/lib/money';
import { dashboard } from '@/routes';
import { index as quoteRequests } from '@/routes/admin/quote-requests';
import { edit as editQuote } from '@/routes/admin/quotes';
import type { BreadcrumbItem } from '@/types';

type Metrics = {
    month: string;
    requests: number;
    quotes_sent: number;
    quotes_viewed: number;
    quotes_accepted: number;
    close_rate_percent: number | null;
    accepted_cents: number;
    paid_cents: number;
    commissions_owed_cents: number;
    pending_requests: number;
    payments_to_confirm: number;
    leads_by_source: Record<string, number>;
};

type Props = {
    metrics: Metrics | null;
    month?: string;
    months?: { value: string; label: string }[];
    commissions?: {
        partner_id: number;
        partner: string;
        quotes: number;
        sales_cents: number;
        commission_cents: number;
    }[];
    newRequests?: {
        id: number;
        reference: string;
        name: string;
        type: string;
        zone: string | null;
        created_at: string | null;
    }[];
    paymentsToConfirm?: {
        id: number;
        number: string;
        client_name: string;
        deposit_cents: number;
        payment_reported_at: string | null;
    }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

const dateFormat = new Intl.DateTimeFormat('es-EC', {
    day: 'numeric',
    month: 'short',
});

/** utm_source as is; a landing path reads as the page it came from. */
function sourceLabel(source: string): string {
    if (source === 'directo') {
        return 'Directo';
    }

    if (source === '/') {
        return 'Página de inicio';
    }

    return source.startsWith('/') ? `Página ${source}` : source;
}

function formatDate(value: string | null): string {
    return value ? dateFormat.format(new Date(value)) : '';
}

export default function Dashboard(props: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {props.metrics ? (
                <MoneyDashboard {...props} metrics={props.metrics} />
            ) : (
                <div className="p-4">
                    <Heading
                        title="Bienvenido"
                        description="Tu cuenta está activa. El resumen del negocio solo lo ven los administradores."
                    />
                </div>
            )}
        </AppLayout>
    );
}

function MoneyDashboard({
    metrics,
    month,
    months = [],
    commissions = [],
    newRequests = [],
    paymentsToConfirm = [],
}: Props & { metrics: Metrics }) {
    const sources = Object.entries(metrics.leads_by_source);
    const topSource = Math.max(1, ...sources.map(([, total]) => total));

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <Heading
                    title="Resumen del negocio"
                    description="Solicitudes, cotizaciones y pagos del mes."
                />
                <Select
                    value={month}
                    onValueChange={(value) =>
                        router.get(
                            dashboard.url({ query: { mes: value } }),
                            {},
                            { preserveScroll: true },
                        )
                    }
                >
                    <SelectTrigger className="w-48" aria-label="Mes">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {(metrics.pending_requests > 0 ||
                metrics.payments_to_confirm > 0) && (
                <div className="grid gap-3 sm:grid-cols-2">
                    {metrics.pending_requests > 0 && (
                        <ActionBanner
                            icon={<Inbox className="size-5" />}
                            href={quoteRequests.url({
                                query: { estado: 'nuevo' },
                            })}
                        >
                            {metrics.pending_requests === 1
                                ? '1 solicitud sin responder'
                                : `${metrics.pending_requests} solicitudes sin responder`}
                        </ActionBanner>
                    )}
                    {metrics.payments_to_confirm > 0 && (
                        <ActionBanner
                            icon={<Wallet className="size-5" />}
                            href="#pagos"
                        >
                            {metrics.payments_to_confirm === 1
                                ? '1 pago por confirmar'
                                : `${metrics.payments_to_confirm} pagos por confirmar`}
                        </ActionBanner>
                    )}
                </div>
            )}

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatTile label="Solicitudes" value={metrics.requests} />
                <StatTile
                    label="Cotizaciones enviadas"
                    value={metrics.quotes_sent}
                />
                <StatTile
                    label="Vistas por el cliente"
                    value={metrics.quotes_viewed}
                />
                <StatTile label="Aceptadas" value={metrics.quotes_accepted} />
                <StatTile
                    label="Tasa de cierre"
                    value={
                        metrics.close_rate_percent === null
                            ? '—'
                            : `${metrics.close_rate_percent}%`
                    }
                    hint="Aceptadas de las enviadas este mes"
                >
                    {metrics.close_rate_percent !== null && (
                        <Meter percent={metrics.close_rate_percent} />
                    )}
                </StatTile>
                <StatTile
                    label="Valor aceptado"
                    value={formatCents(metrics.accepted_cents)}
                />
                <StatTile
                    label="Pagos recibidos"
                    value={formatCents(metrics.paid_cents)}
                />
                <StatTile
                    label="Comisiones por cobrar"
                    value={formatCents(metrics.commissions_owed_cents)}
                    hint="A aliados, de cotizaciones aceptadas"
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card className="gap-4 p-5">
                    <h2 className="font-semibold">De dónde llegan</h2>
                    {sources.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Aún no hay solicitudes este mes.
                        </p>
                    ) : (
                        <ul className="grid gap-3">
                            {sources.map(([source, total]) => (
                                <li
                                    key={source}
                                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 text-sm sm:grid-cols-[minmax(0,12rem)_1fr_auto]"
                                >
                                    <span className="truncate" title={source}>
                                        {sourceLabel(source)}
                                    </span>
                                    <span className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
                                        <Meter
                                            percent={(total / topSource) * 100}
                                            label={`${sourceLabel(source)}: ${total}`}
                                        />
                                    </span>
                                    <span className="font-medium tabular-nums">
                                        {total}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card className="gap-4 p-5">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="font-semibold">Solicitudes nuevas</h2>
                        <Link
                            href={quoteRequests.url({
                                query: { estado: 'nuevo' },
                            })}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Ver todas
                        </Link>
                    </div>
                    {newRequests.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Todo respondido.
                        </p>
                    ) : (
                        <ul className="divide-y text-sm">
                            {newRequests.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex items-center justify-between gap-3 py-2"
                                >
                                    <span className="min-w-0">
                                        <span className="block truncate font-medium">
                                            {item.name}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {item.reference} · {item.type}
                                            {item.zone ? ` · ${item.zone}` : ''}
                                        </span>
                                    </span>
                                    <span className="shrink-0 text-muted-foreground">
                                        {formatDate(item.created_at)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card id="pagos" className="scroll-mt-20 gap-4 p-5">
                    <h2 className="font-semibold">Pagos por confirmar</h2>
                    {paymentsToConfirm.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Ningún cliente reportó un pago pendiente.
                        </p>
                    ) : (
                        <ul className="divide-y text-sm">
                            {paymentsToConfirm.map((quote) => (
                                <li key={quote.id}>
                                    <Link
                                        href={editQuote(quote.id)}
                                        className="flex items-center justify-between gap-3 py-2 hover:text-primary"
                                    >
                                        <span className="min-w-0">
                                            <span className="block truncate font-medium">
                                                {quote.client_name}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {quote.number} · anticipo{' '}
                                                {formatCents(
                                                    quote.deposit_cents,
                                                )}
                                            </span>
                                        </span>
                                        <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
                                            {formatDate(
                                                quote.payment_reported_at,
                                            )}
                                            <ChevronRight className="size-4" />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card className="gap-4 p-5">
                    <h2 className="font-semibold">Comisiones de aliados</h2>
                    {commissions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Sin comisiones pendientes.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-left text-muted-foreground">
                                    <tr>
                                        <th className="py-2 font-medium">
                                            Aliado
                                        </th>
                                        <th className="py-2 text-right font-medium">
                                            Ventas
                                        </th>
                                        <th className="py-2 text-right font-medium">
                                            Comisión
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {commissions.map((row) => (
                                        <tr key={row.partner_id}>
                                            <td className="py-2">
                                                {row.partner}
                                                <span className="block text-xs text-muted-foreground">
                                                    {row.quotes === 1
                                                        ? '1 cotización'
                                                        : `${row.quotes} cotizaciones`}
                                                </span>
                                            </td>
                                            <td className="py-2 text-right tabular-nums">
                                                {formatCents(row.sales_cents)}
                                            </td>
                                            <td className="py-2 text-right font-medium tabular-nums">
                                                {formatCents(
                                                    row.commission_cents,
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

function StatTile({
    label,
    value,
    hint,
    children,
}: {
    label: string;
    value: number | string;
    hint?: string;
    children?: ReactNode;
}) {
    return (
        <Card className="gap-2 p-4">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-2xl font-semibold tabular-nums">{value}</span>
            {children}
            {hint && (
                <span className="text-xs text-muted-foreground">{hint}</span>
            )}
        </Card>
    );
}

/** Single-hue bar on a muted track; the figure is always printed beside it. */
function Meter({ percent, label }: { percent: number; label?: string }) {
    const width = Math.min(100, Math.max(0, percent));

    return (
        <span
            className="block h-2 w-full overflow-hidden rounded-full bg-muted"
            title={label}
        >
            <span
                className="block h-full rounded-full bg-primary"
                style={{ width: `${width}%` }}
            />
        </span>
    );
}

function ActionBanner({
    icon,
    href,
    children,
}: {
    icon: ReactNode;
    href: string;
    children: ReactNode;
}) {
    const className =
        'flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm font-medium transition-colors hover:bg-primary/10';
    const content = (
        <>
            <span className="text-primary">{icon}</span>
            <span className="flex-1">{children}</span>
            <BellRing className="size-4 text-primary" aria-hidden="true" />
        </>
    );

    // In-page anchors stay plain links; Inertia only handles real visits.
    return href.startsWith('#') ? (
        <a href={href} className={className}>
            {content}
        </a>
    ) : (
        <Link href={href} className={className}>
            {content}
        </Link>
    );
}
