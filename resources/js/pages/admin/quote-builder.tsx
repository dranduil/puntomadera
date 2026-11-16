import { Form, Head, router, useForm } from '@inertiajs/react';
import {
    Copy,
    ExternalLink,
    MessageCircle,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AdminField } from '@/components/admin-field';
import { FlashStatus } from '@/components/flash-status';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import {
    centsToInput,
    formatCatalogPrice,
    formatCents,
    inputToCents,
} from '@/lib/money';
import { calculateQuote } from '@/lib/quote-math';
import {
    create,
    duplicate,
    edit,
    index,
    paid,
    sent,
    store,
    update,
} from '@/routes/admin/quotes';
import type { BreadcrumbItem } from '@/types';

type Line = {
    key?: string;
    catalog_item_id: number | null;
    description: string;
    unit: string;
    quantity: number;
    unit_price_cents: number;
};

type QuoteFields = {
    quote_request_id: number | null;
    client_name: string;
    client_phone: string | null;
    service_zone_id: number | null;
    travel_fee_cents: number;
    visit_fee_cents: number;
    discount_cents: number;
    iva_percent: number;
    deposit_percent: number;
    valid_until: string | null;
    notes: string | null;
    terms: string | null;
    payment_link: string | null;
    items: Line[];
};

type CatalogEntry = {
    id: number;
    name: string;
    kind: string;
    unit: string;
    price_min_cents: number;
    price_max_cents: number | null;
    partner_name: string | null;
    suggestion_ids: number[];
};

type Meta = {
    id: number;
    number: string;
    status: string;
    locked: boolean;
    expired: boolean;
    public_url: string;
    send_href: string;
    deposit_cents: number;
    timeline: Record<string, string>;
    paid_amount_cents: number | null;
    payment_method: string | null;
};

type Props = {
    quote: QuoteFields;
    meta: Meta | null;
    request: {
        id: number;
        reference: string;
        name: string;
        summary: string[];
        message: string | null;
    } | null;
    catalog: CatalogEntry[];
    zones: {
        id: number;
        name: string;
        travel_fee_cents: number | null;
        visit_fee_cents: number | null;
    }[];
    units: Record<string, string>;
    paymentMethods: string[];
};

const selectClass =
    'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs disabled:opacity-50';

let lineCounter = 0;
const newKey = () => `line-${++lineCounter}`;

const normalize = (value: string) =>
    value
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();

function MoneyInput({
    id,
    cents,
    onChange,
    disabled,
}: {
    id: string;
    cents: number;
    onChange: (cents: number) => void;
    disabled?: boolean;
}) {
    const [text, setText] = useState(centsToInput(cents));

    return (
        <Input
            id={id}
            inputMode="decimal"
            value={text}
            disabled={disabled}
            onChange={(event) => {
                setText(event.target.value);
                onChange(inputToCents(event.target.value));
            }}
        />
    );
}

function lineFromCatalog(item: CatalogEntry): Line {
    const isPercentage = item.unit === 'porcentaje';

    return {
        key: newKey(),
        catalog_item_id: item.id,
        description: item.name,
        unit: item.unit,
        quantity: isPercentage ? item.price_min_cents : 1,
        unit_price_cents: isPercentage ? 0 : item.price_min_cents,
    };
}

export default function QuoteBuilder({
    quote,
    meta,
    request,
    catalog,
    zones,
    units,
    paymentMethods,
}: Props) {
    const { data, setData, errors, processing, isDirty, post, put } =
        useForm<QuoteFields>({
            ...quote,
            items: quote.items.map((line) => ({ ...line, key: newKey() })),
        });
    const [search, setSearch] = useState('');
    const [feeKey, setFeeKey] = useState(0);
    const [copied, setCopied] = useState(false);
    const [paidCents, setPaidCents] = useState(meta?.deposit_cents ?? 0);
    const fieldErrors = errors as Record<string, string | undefined>;
    const locked = meta?.locked ?? false;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Cotizaciones', href: index() },
        {
            title: meta ? meta.number : 'Nueva',
            href: meta ? edit(meta.id) : create(),
        },
    ];

    const catalogById = useMemo(
        () => new Map(catalog.map((item) => [item.id, item])),
        [catalog],
    );

    const totals = calculateQuote(
        data.items,
        data.travel_fee_cents,
        data.visit_fee_cents,
        data.discount_cents,
        data.iva_percent,
        data.deposit_percent,
    );

    const results = useMemo(() => {
        const term = normalize(search.trim());

        return term === ''
            ? []
            : catalog
                  .filter((item) => normalize(item.name).includes(term))
                  .slice(0, 8);
    }, [catalog, search]);

    const suggested = useMemo(() => {
        const present = new Set(data.items.map((line) => line.catalog_item_id));
        const ids = new Set<number>();

        data.items.forEach((line) =>
            catalogById
                .get(line.catalog_item_id ?? 0)
                ?.suggestion_ids.forEach((id) => {
                    if (!present.has(id)) {
                        ids.add(id);
                    }
                }),
        );

        return [...ids].flatMap((id) => {
            const item = catalogById.get(id);

            return item ? [item] : [];
        });
    }, [data.items, catalogById]);

    const updateLine = (lineIndex: number, changes: Partial<Line>) =>
        setData(
            'items',
            data.items.map((line, position) =>
                position === lineIndex ? { ...line, ...changes } : line,
            ),
        );

    const addLine = (line: Line) => {
        setData('items', [...data.items, line]);
        setSearch('');
    };

    const chooseZone = (value: string) => {
        const zone = zones.find((candidate) => String(candidate.id) === value);

        setData((previous) => ({
            ...previous,
            service_zone_id: zone?.id ?? null,
            travel_fee_cents:
                zone?.travel_fee_cents ?? previous.travel_fee_cents,
            visit_fee_cents: zone?.visit_fee_cents ?? previous.visit_fee_cents,
        }));
        setFeeKey((key) => key + 1);
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        const options = { preserveScroll: true };

        if (meta) {
            put(update.url(meta.id), options);
        } else {
            post(store.url(), options);
        }
    };

    const copyLink = async () => {
        if (!meta) {
            return;
        }

        await navigator.clipboard.writeText(meta.public_url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={meta ? `Cotización ${meta.number}` : 'Nueva cotización'}
            />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <Heading
                        title={
                            meta
                                ? `Cotización ${meta.number}`
                                : 'Nueva cotización'
                        }
                        description="Los precios del catálogo son el punto de partida; ajusta cada línea según el trabajo."
                    />
                    {meta && (
                        <div className="flex flex-wrap gap-2">
                            <Badge>{meta.status}</Badge>
                            {meta.expired && (
                                <Badge variant="destructive">Vencida</Badge>
                            )}
                        </div>
                    )}
                </div>

                <FlashStatus />
                <InputError message={fieldErrors.quote} />

                <form
                    onSubmit={submit}
                    className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start"
                >
                    <div className="grid gap-6">
                        {request && (
                            <Card className="border-primary/30 bg-primary/5 shadow-none">
                                <CardHeader>
                                    <CardTitle>
                                        Solicitud {request.reference} ·{' '}
                                        {request.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-2 text-sm">
                                    {request.summary.map((line) => (
                                        <div key={line}>{line}</div>
                                    ))}
                                    {request.message && (
                                        <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                                            {request.message}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Cliente</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-3">
                                <AdminField
                                    label="Nombre"
                                    htmlFor="client_name"
                                    error={fieldErrors.client_name}
                                >
                                    <Input
                                        id="client_name"
                                        value={data.client_name}
                                        disabled={locked}
                                        onChange={(event) =>
                                            setData(
                                                'client_name',
                                                event.target.value,
                                            )
                                        }
                                        required
                                    />
                                </AdminField>
                                <AdminField
                                    label="WhatsApp"
                                    htmlFor="client_phone"
                                    error={fieldErrors.client_phone}
                                >
                                    <Input
                                        id="client_phone"
                                        value={data.client_phone ?? ''}
                                        disabled={locked}
                                        onChange={(event) =>
                                            setData(
                                                'client_phone',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="09…"
                                    />
                                </AdminField>
                                <AdminField
                                    label="Zona"
                                    htmlFor="service_zone_id"
                                    error={fieldErrors.service_zone_id}
                                    hint="Llena la movilización de la zona."
                                >
                                    <select
                                        id="service_zone_id"
                                        value={data.service_zone_id ?? ''}
                                        disabled={locked}
                                        onChange={(event) =>
                                            chooseZone(event.target.value)
                                        }
                                        className={selectClass}
                                    >
                                        <option value="">Sin zona</option>
                                        {zones.map((zone) => (
                                            <option
                                                key={zone.id}
                                                value={zone.id}
                                            >
                                                {zone.name}
                                            </option>
                                        ))}
                                    </select>
                                </AdminField>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Ítems</CardTitle>
                                <CardDescription>
                                    Las líneas en % se calculan sobre la suma de
                                    las demás líneas.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {data.items.map((line, lineIndex) => {
                                    const entry = catalogById.get(
                                        line.catalog_item_id ?? 0,
                                    );
                                    const isPercentage =
                                        line.unit === 'porcentaje';
                                    const error = (field: string) =>
                                        fieldErrors[
                                            `items.${lineIndex}.${field}`
                                        ];

                                    return (
                                        <div
                                            key={line.key}
                                            className="grid gap-3 rounded-lg border p-3 md:grid-cols-[1fr_130px_90px_120px_auto] md:items-end"
                                        >
                                            <AdminField
                                                label="Descripción"
                                                htmlFor={`${line.key}-description`}
                                                error={error('description')}
                                                hint={
                                                    entry
                                                        ? `Catálogo: ${formatCatalogPrice(entry.price_min_cents, entry.price_max_cents, entry.unit)}${entry.partner_name ? ` · aliado ${entry.partner_name}` : ''}`
                                                        : undefined
                                                }
                                            >
                                                <Input
                                                    id={`${line.key}-description`}
                                                    value={line.description}
                                                    disabled={locked}
                                                    onChange={(event) =>
                                                        updateLine(lineIndex, {
                                                            description:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </AdminField>
                                            <AdminField
                                                label="Unidad"
                                                htmlFor={`${line.key}-unit`}
                                                error={error('unit')}
                                            >
                                                <select
                                                    id={`${line.key}-unit`}
                                                    value={line.unit}
                                                    disabled={locked}
                                                    onChange={(event) =>
                                                        updateLine(lineIndex, {
                                                            unit: event.target
                                                                .value,
                                                        })
                                                    }
                                                    className={selectClass}
                                                >
                                                    {Object.entries(units).map(
                                                        ([value, label]) => (
                                                            <option
                                                                key={value}
                                                                value={value}
                                                            >
                                                                {label}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </AdminField>
                                            <AdminField
                                                label={
                                                    isPercentage ? '%' : 'Cant.'
                                                }
                                                htmlFor={`${line.key}-quantity`}
                                                error={error('quantity')}
                                            >
                                                <Input
                                                    id={`${line.key}-quantity`}
                                                    type="number"
                                                    step="0.5"
                                                    min="0"
                                                    value={line.quantity}
                                                    disabled={locked}
                                                    onChange={(event) =>
                                                        updateLine(lineIndex, {
                                                            quantity: Number(
                                                                event.target
                                                                    .value,
                                                            ),
                                                        })
                                                    }
                                                />
                                            </AdminField>
                                            <AdminField
                                                label="Precio unit. ($)"
                                                htmlFor={`${line.key}-price`}
                                                error={error(
                                                    'unit_price_cents',
                                                )}
                                            >
                                                {isPercentage ? (
                                                    <div className="flex h-9 items-center text-sm text-muted-foreground">
                                                        —
                                                    </div>
                                                ) : (
                                                    <MoneyInput
                                                        id={`${line.key}-price`}
                                                        cents={
                                                            line.unit_price_cents
                                                        }
                                                        disabled={locked}
                                                        onChange={(cents) =>
                                                            updateLine(
                                                                lineIndex,
                                                                {
                                                                    unit_price_cents:
                                                                        cents,
                                                                },
                                                            )
                                                        }
                                                    />
                                                )}
                                            </AdminField>
                                            <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
                                                <span className="text-sm font-medium tabular-nums">
                                                    {formatCents(
                                                        totals.line_totals[
                                                            lineIndex
                                                        ],
                                                    )}
                                                </span>
                                                {!locked && (
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        aria-label="Quitar línea"
                                                        onClick={() =>
                                                            setData(
                                                                'items',
                                                                data.items.filter(
                                                                    (
                                                                        _,
                                                                        position,
                                                                    ) =>
                                                                        position !==
                                                                        lineIndex,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                <InputError message={fieldErrors.items} />

                                {!locked && (
                                    <>
                                        {suggested.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    Sugerido:
                                                </span>
                                                {suggested.map((item) => (
                                                    <Button
                                                        key={item.id}
                                                        type="button"
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() =>
                                                            addLine(
                                                                lineFromCatalog(
                                                                    item,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <Plus />
                                                        {item.name}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}

                                        <div className="relative">
                                            <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
                                            <Input
                                                value={search}
                                                onChange={(event) =>
                                                    setSearch(
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Buscar en el catálogo: puerta, closet, chapa…"
                                                className="pl-9"
                                                aria-label="Buscar en el catálogo"
                                            />
                                            {results.length > 0 && (
                                                <div className="absolute z-20 mt-1 grid w-full overflow-hidden rounded-md border bg-popover shadow-md">
                                                    {results.map((item) => (
                                                        <button
                                                            key={item.id}
                                                            type="button"
                                                            onClick={() =>
                                                                addLine(
                                                                    lineFromCatalog(
                                                                        item,
                                                                    ),
                                                                )
                                                            }
                                                            className="flex items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-muted"
                                                        >
                                                            <span>
                                                                {item.name}
                                                            </span>
                                                            <span className="shrink-0 text-muted-foreground">
                                                                {formatCatalogPrice(
                                                                    item.price_min_cents,
                                                                    item.price_max_cents,
                                                                    item.unit,
                                                                )}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-fit"
                                            onClick={() =>
                                                addLine({
                                                    key: newKey(),
                                                    catalog_item_id: null,
                                                    description: '',
                                                    unit: 'unidad',
                                                    quantity: 1,
                                                    unit_price_cents: 0,
                                                })
                                            }
                                        >
                                            <Plus />
                                            Línea libre
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Cargos y condiciones</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-3">
                                <AdminField
                                    label="Movilización ($)"
                                    htmlFor="travel_fee"
                                    error={fieldErrors.travel_fee_cents}
                                >
                                    <MoneyInput
                                        key={`travel-${feeKey}`}
                                        id="travel_fee"
                                        cents={data.travel_fee_cents}
                                        disabled={locked}
                                        onChange={(cents) =>
                                            setData('travel_fee_cents', cents)
                                        }
                                    />
                                </AdminField>
                                <AdminField
                                    label="Visita técnica ($)"
                                    htmlFor="visit_fee"
                                    error={fieldErrors.visit_fee_cents}
                                >
                                    <MoneyInput
                                        key={`visit-${feeKey}`}
                                        id="visit_fee"
                                        cents={data.visit_fee_cents}
                                        disabled={locked}
                                        onChange={(cents) =>
                                            setData('visit_fee_cents', cents)
                                        }
                                    />
                                </AdminField>
                                <AdminField
                                    label="Descuento ($)"
                                    htmlFor="discount"
                                    error={fieldErrors.discount_cents}
                                >
                                    <MoneyInput
                                        id="discount"
                                        cents={data.discount_cents}
                                        disabled={locked}
                                        onChange={(cents) =>
                                            setData('discount_cents', cents)
                                        }
                                    />
                                </AdminField>
                                <AdminField
                                    label="Anticipo (%)"
                                    htmlFor="deposit_percent"
                                    error={fieldErrors.deposit_percent}
                                >
                                    <Input
                                        id="deposit_percent"
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={data.deposit_percent}
                                        disabled={locked}
                                        onChange={(event) =>
                                            setData(
                                                'deposit_percent',
                                                Number(event.target.value),
                                            )
                                        }
                                    />
                                </AdminField>
                                <AdminField
                                    label="Válida hasta"
                                    htmlFor="valid_until"
                                    error={fieldErrors.valid_until}
                                >
                                    <Input
                                        id="valid_until"
                                        type="date"
                                        value={data.valid_until ?? ''}
                                        disabled={locked}
                                        onChange={(event) =>
                                            setData(
                                                'valid_until',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </AdminField>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={data.iva_percent === 15}
                                            disabled={locked}
                                            onChange={(event) =>
                                                setData(
                                                    'iva_percent',
                                                    event.target.checked
                                                        ? 15
                                                        : 0,
                                                )
                                            }
                                            className="size-4 accent-primary"
                                        />
                                        Cobrar IVA 15%
                                    </label>
                                </div>
                                <AdminField
                                    label="Link de pago Deuna"
                                    htmlFor="payment_link"
                                    error={fieldErrors.payment_link}
                                    hint="Vacío = el link de los ajustes."
                                    className="md:col-span-3"
                                >
                                    <Input
                                        id="payment_link"
                                        type="url"
                                        value={data.payment_link ?? ''}
                                        disabled={locked}
                                        onChange={(event) =>
                                            setData(
                                                'payment_link',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </AdminField>
                                <AdminField
                                    label="Notas para el cliente"
                                    htmlFor="notes"
                                    error={fieldErrors.notes}
                                    className="md:col-span-3"
                                >
                                    <Textarea
                                        id="notes"
                                        value={data.notes ?? ''}
                                        disabled={locked}
                                        onChange={(event) =>
                                            setData('notes', event.target.value)
                                        }
                                        placeholder="Ej.: Tiempo de entrega 10 días hábiles después del anticipo."
                                    />
                                </AdminField>
                                <AdminField
                                    label="Condiciones"
                                    htmlFor="terms"
                                    error={fieldErrors.terms}
                                    className="md:col-span-3"
                                >
                                    <Textarea
                                        id="terms"
                                        value={data.terms ?? ''}
                                        disabled={locked}
                                        onChange={(event) =>
                                            setData('terms', event.target.value)
                                        }
                                        className="min-h-28"
                                    />
                                </AdminField>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 lg:sticky lg:top-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Total</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-2 text-sm tabular-nums">
                                {[
                                    ['Ítems', totals.items_cents],
                                    ['Movilización', data.travel_fee_cents],
                                    ['Visita técnica', data.visit_fee_cents],
                                    ['Descuento', -data.discount_cents],
                                    ['Subtotal', totals.subtotal_cents],
                                    [
                                        `IVA ${data.iva_percent}%`,
                                        totals.iva_cents,
                                    ],
                                ].map(([label, cents]) =>
                                    cents === 0 &&
                                    label !== 'Subtotal' ? null : (
                                        <div
                                            key={label}
                                            className="flex justify-between"
                                        >
                                            <span className="text-muted-foreground">
                                                {label}
                                            </span>
                                            <span>
                                                {formatCents(Number(cents))}
                                            </span>
                                        </div>
                                    ),
                                )}
                                <div className="mt-2 flex justify-between border-t pt-2 text-base font-semibold">
                                    <span>Total</span>
                                    <span>
                                        {formatCents(totals.total_cents)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Anticipo {data.deposit_percent}%
                                    </span>
                                    <span className="font-medium">
                                        {formatCents(totals.deposit_cents)}
                                    </span>
                                </div>
                                {!locked && (
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-3"
                                    >
                                        {meta
                                            ? 'Guardar cambios'
                                            : 'Guardar borrador'}
                                    </Button>
                                )}
                                {locked && (
                                    <p className="mt-3 text-xs text-muted-foreground">
                                        Aceptada o pagada: ya no se puede
                                        editar. Duplícala para hacer otra
                                        versión.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {meta && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Enviar y cobrar</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-3">
                                    {isDirty && !locked ? (
                                        <p className="text-xs text-muted-foreground">
                                            Guarda los cambios antes de
                                            enviarla.
                                        </p>
                                    ) : (
                                        <Button asChild>
                                            <a
                                                href={meta.send_href}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={() =>
                                                    router.post(
                                                        sent.url(meta.id),
                                                        {},
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                            >
                                                <MessageCircle />
                                                Enviar por WhatsApp
                                            </a>
                                        </Button>
                                    )}
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                        >
                                            <a
                                                href={meta.public_url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <ExternalLink />
                                                Ver
                                            </a>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={copyLink}
                                        >
                                            <Copy />
                                            {copied ? 'Copiado' : 'Copiar link'}
                                        </Button>
                                    </div>

                                    {Object.keys(meta.timeline).length > 0 && (
                                        <ul className="grid gap-1 border-t pt-3 text-xs text-muted-foreground">
                                            {Object.entries(meta.timeline).map(
                                                ([label, date]) => (
                                                    <li
                                                        key={label}
                                                        className="flex justify-between gap-2"
                                                    >
                                                        <span>{label}</span>
                                                        <span>{date}</span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                                    {meta.paid_amount_cents !== null && (
                                        <p className="text-xs text-muted-foreground">
                                            Cobrado{' '}
                                            {formatCents(
                                                meta.paid_amount_cents,
                                            )}{' '}
                                            por {meta.payment_method}.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </form>

                {meta && (
                    <div className="grid gap-4 md:grid-cols-2 lg:mr-[364px]">
                        <Card>
                            <CardHeader>
                                <CardTitle>Registrar pago</CardTitle>
                                <CardDescription>
                                    Cuando recibas el anticipo o el total.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    {...paid.form(meta.id)}
                                    options={{ preserveScroll: true }}
                                    className="grid gap-3 sm:grid-cols-2"
                                >
                                    {({
                                        processing: saving,
                                        errors: payErrors,
                                    }) => (
                                        <>
                                            <AdminField
                                                label="Monto ($)"
                                                htmlFor="paid_amount"
                                                error={
                                                    payErrors.paid_amount_cents
                                                }
                                            >
                                                <MoneyInput
                                                    id="paid_amount"
                                                    cents={paidCents}
                                                    onChange={setPaidCents}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="paid_amount_cents"
                                                    value={paidCents}
                                                />
                                            </AdminField>
                                            <AdminField
                                                label="Medio"
                                                htmlFor="payment_method"
                                                error={payErrors.payment_method}
                                            >
                                                <select
                                                    id="payment_method"
                                                    name="payment_method"
                                                    defaultValue={
                                                        meta.payment_method ??
                                                        'deuna'
                                                    }
                                                    className={selectClass}
                                                >
                                                    {paymentMethods.map(
                                                        (method) => (
                                                            <option
                                                                key={method}
                                                                value={method}
                                                            >
                                                                {method}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </AdminField>
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                disabled={saving}
                                                className="w-fit"
                                            >
                                                Marcar pagada
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Otra versión</CardTitle>
                                <CardDescription>
                                    Copia esta cotización como borrador nuevo,
                                    con validez renovada.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...duplicate.form(meta.id)}>
                                    {({ processing: copying }) => (
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            disabled={copying}
                                        >
                                            <Copy />
                                            Duplicar
                                        </Button>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
