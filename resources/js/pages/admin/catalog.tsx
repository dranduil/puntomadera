import { Form, Head, Link } from '@inertiajs/react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AdminCheckbox, AdminField } from '@/components/admin-field';
import { FlashStatus } from '@/components/flash-status';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { centsToInput, formatCatalogPrice, formatCents } from '@/lib/money';
import { adjust, index, store, update } from '@/routes/admin/catalog';
import suggestionRoutes from '@/routes/admin/catalog/suggestions';
import type { BreadcrumbItem } from '@/types';

type Option = { id: number; name: string };

type CatalogItem = {
    id: number;
    kind: string;
    service_id: number | null;
    partner_id: number | null;
    name: string;
    slug: string;
    description: string | null;
    unit: string;
    price_min_cents: number;
    price_max_cents: number | null;
    cost_cents: number | null;
    includes_material: boolean;
    is_public: boolean;
    is_active: boolean;
    service_name: string | null;
    partner_name: string | null;
    suggestions: Array<{ id: number; name: string; reason: string | null }>;
};

type Props = {
    items: CatalogItem[];
    services: Option[];
    partners: Option[];
    kinds: string[];
    units: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Catálogo de precios', href: index() },
];

const kindLabels: Record<string, string> = {
    servicio: 'Servicio',
    producto: 'Producto',
    extra: 'Extra',
    aliado: 'Aliado',
};

function OptionSelect({
    id,
    name,
    defaultValue,
    options,
    noneLabel,
}: {
    id: string;
    name: string;
    defaultValue: string;
    options: Array<{ value: string; label: string }>;
    noneLabel?: string;
}) {
    return (
        <Select name={name} defaultValue={defaultValue}>
            <SelectTrigger id={id} className="w-full">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {noneLabel && (
                        <SelectItem value="none">{noneLabel}</SelectItem>
                    )}
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

function CatalogItemFields({
    item,
    prefix,
    services,
    partners,
    kinds,
    units,
    errors,
}: {
    item?: CatalogItem;
    prefix: string;
    services: Option[];
    partners: Option[];
    kinds: string[];
    units: Record<string, string>;
    errors: Record<string, string>;
}) {
    const percentHint =
        'Para unidad "%", escribe el porcentaje (ej. 30), no dólares.';

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <AdminField
                label="Nombre"
                htmlFor={`${prefix}-name`}
                error={errors.name}
                className="md:col-span-2"
            >
                <Input
                    id={`${prefix}-name`}
                    name="name"
                    required
                    defaultValue={item?.name}
                />
            </AdminField>
            <AdminField
                label="Descripción (la ve el cliente)"
                htmlFor={`${prefix}-description`}
                error={errors.description}
                className="md:col-span-2"
            >
                <Textarea
                    id={`${prefix}-description`}
                    name="description"
                    defaultValue={item?.description ?? ''}
                />
            </AdminField>
            <AdminField
                label="Tipo"
                htmlFor={`${prefix}-kind`}
                error={errors.kind}
            >
                <OptionSelect
                    id={`${prefix}-kind`}
                    name="kind"
                    defaultValue={item?.kind ?? 'servicio'}
                    options={kinds.map((kind) => ({
                        value: kind,
                        label: kindLabels[kind] ?? kind,
                    }))}
                />
            </AdminField>
            <AdminField
                label="Unidad"
                htmlFor={`${prefix}-unit`}
                error={errors.unit}
            >
                <OptionSelect
                    id={`${prefix}-unit`}
                    name="unit"
                    defaultValue={item?.unit ?? 'unidad'}
                    options={Object.entries(units).map(([value, label]) => ({
                        value,
                        label,
                    }))}
                />
            </AdminField>
            <AdminField
                label="Servicio"
                htmlFor={`${prefix}-service`}
                error={errors.service_id}
            >
                <OptionSelect
                    id={`${prefix}-service`}
                    name="service_id"
                    defaultValue={
                        item?.service_id ? String(item.service_id) : 'none'
                    }
                    noneLabel="Sin servicio"
                    options={services.map((service) => ({
                        value: String(service.id),
                        label: service.name,
                    }))}
                />
            </AdminField>
            <AdminField
                label="Aliado (si lo hace un aliado)"
                htmlFor={`${prefix}-partner`}
                error={errors.partner_id}
            >
                <OptionSelect
                    id={`${prefix}-partner`}
                    name="partner_id"
                    defaultValue={
                        item?.partner_id ? String(item.partner_id) : 'none'
                    }
                    noneLabel="Ninguno"
                    options={partners.map((partner) => ({
                        value: String(partner.id),
                        label: partner.name,
                    }))}
                />
            </AdminField>
            <AdminField
                label="Precio mínimo ($)"
                htmlFor={`${prefix}-price-min`}
                error={errors.price_min}
                hint={percentHint}
            >
                <Input
                    id={`${prefix}-price-min`}
                    name="price_min"
                    inputMode="decimal"
                    defaultValue={
                        item?.unit === 'porcentaje'
                            ? String(item.price_min_cents)
                            : centsToInput(item?.price_min_cents)
                    }
                />
            </AdminField>
            <AdminField
                label="Precio máximo ($, opcional)"
                htmlFor={`${prefix}-price-max`}
                error={errors.price_max}
            >
                <Input
                    id={`${prefix}-price-max`}
                    name="price_max"
                    inputMode="decimal"
                    defaultValue={
                        item?.unit === 'porcentaje'
                            ? String(item.price_max_cents ?? '')
                            : centsToInput(item?.price_max_cents)
                    }
                />
            </AdminField>
            <AdminField
                label="Tu costo ($, opcional)"
                htmlFor={`${prefix}-cost`}
                error={errors.cost}
                hint="Solo para ver tu margen. El cliente nunca lo ve."
            >
                <Input
                    id={`${prefix}-cost`}
                    name="cost"
                    inputMode="decimal"
                    defaultValue={centsToInput(item?.cost_cents)}
                />
            </AdminField>
            <div className="flex flex-col justify-end gap-3">
                <AdminCheckbox
                    id={`${prefix}-material`}
                    name="includes_material"
                    label="Incluye material"
                    defaultChecked={item?.includes_material ?? false}
                />
                <AdminCheckbox
                    id={`${prefix}-public`}
                    name="is_public"
                    label="Visible en el formulario de cotización (sin precio)"
                    defaultChecked={item?.is_public ?? true}
                />
                <AdminCheckbox
                    id={`${prefix}-active`}
                    name="is_active"
                    label="Activo"
                    defaultChecked={item?.is_active ?? true}
                />
            </div>
        </div>
    );
}

function margin(item: CatalogItem): string | null {
    if (
        !item.cost_cents ||
        item.price_min_cents <= 0 ||
        item.unit === 'porcentaje'
    ) {
        return null;
    }

    const value =
        ((item.price_min_cents - item.cost_cents) / item.price_min_cents) * 100;

    return `Margen ${Math.round(value)}%`;
}

export default function CatalogAdmin({
    items,
    services,
    partners,
    kinds,
    units,
}: Props) {
    const [query, setQuery] = useState('');
    const groups = useMemo(() => {
        const needle = query.trim().toLowerCase();
        const filtered = needle
            ? items.filter((item) => item.name.toLowerCase().includes(needle))
            : items;

        return filtered.reduce<Record<string, CatalogItem[]>>((acc, item) => {
            const key = item.service_name ?? 'Sin servicio';
            (acc[key] ??= []).push(item);

            return acc;
        }, {});
    }, [items, query]);

    const fieldProps = { services, partners, kinds, units };
    const suggestionCandidates = (item: CatalogItem) =>
        items
            .filter((other) => other.id !== item.id && other.is_public)
            .map((other) => ({ value: String(other.id), label: other.name }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catálogo de precios" />

            <div className="flex flex-col gap-6 p-4">
                <Heading
                    title="Catálogo de precios"
                    description="Tus precios internos. El cliente nunca ve precios en la web: solo los ve en la cotización que tú le envías."
                />

                <FlashStatus />

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subir o bajar precios</CardTitle>
                            <CardDescription>
                                Ajusta todos los precios en dólares por un
                                porcentaje, por ejemplo cuando sube la melamina.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...adjust.form()}
                                className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <AdminField
                                            label="Porcentaje"
                                            htmlFor="adjust-percent"
                                            error={errors.percent}
                                        >
                                            <Input
                                                id="adjust-percent"
                                                name="percent"
                                                placeholder="Ej. 5 o -5"
                                                inputMode="decimal"
                                                required
                                            />
                                        </AdminField>
                                        <AdminField
                                            label="Solo este servicio"
                                            htmlFor="adjust-service"
                                        >
                                            <OptionSelect
                                                id="adjust-service"
                                                name="service_id"
                                                defaultValue="none"
                                                noneLabel="Todos"
                                                options={services.map(
                                                    (service) => ({
                                                        value: String(
                                                            service.id,
                                                        ),
                                                        label: service.name,
                                                    }),
                                                )}
                                            />
                                        </AdminField>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            Aplicar
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Buscar</CardTitle>
                            <CardDescription>
                                {items.length} ítems en el catálogo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Input
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Ej. closet, cerradura, mesón"
                                aria-label="Buscar en el catálogo"
                            />
                        </CardContent>
                    </Card>
                </div>

                <Collapsible>
                    <Card>
                        <CardHeader>
                            <CollapsibleTrigger asChild>
                                <Button variant="outline" className="w-fit">
                                    <Plus data-icon="inline-start" />
                                    Nuevo ítem
                                </Button>
                            </CollapsibleTrigger>
                        </CardHeader>
                        <CollapsibleContent>
                            <CardContent>
                                <Form
                                    {...store.form()}
                                    resetOnSuccess
                                    className="flex flex-col gap-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <CatalogItemFields
                                                prefix="new"
                                                errors={errors}
                                                {...fieldProps}
                                            />
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="w-fit"
                                            >
                                                Crear ítem
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>

                {Object.entries(groups).map(([group, groupItems]) => (
                    <section key={group} className="flex flex-col gap-3">
                        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                            {group}
                        </h2>
                        {groupItems.map((item) => (
                            <Collapsible key={item.id}>
                                <Card className="gap-0 py-0">
                                    <CollapsibleTrigger asChild>
                                        <button
                                            type="button"
                                            className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
                                        >
                                            <span className="flex min-w-0 flex-col gap-1">
                                                <span className="font-medium">
                                                    {item.name}
                                                </span>
                                                <span className="flex flex-wrap gap-1.5">
                                                    <Badge variant="outline">
                                                        {kindLabels[
                                                            item.kind
                                                        ] ?? item.kind}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {units[item.unit] ??
                                                            item.unit}
                                                    </Badge>
                                                    {!item.is_public && (
                                                        <Badge variant="secondary">
                                                            Interno
                                                        </Badge>
                                                    )}
                                                    {!item.is_active && (
                                                        <Badge variant="destructive">
                                                            Inactivo
                                                        </Badge>
                                                    )}
                                                    {item.partner_name && (
                                                        <Badge variant="secondary">
                                                            {item.partner_name}
                                                        </Badge>
                                                    )}
                                                </span>
                                            </span>
                                            <span className="flex items-center gap-3">
                                                <span className="text-right">
                                                    <span className="block font-semibold">
                                                        {formatCatalogPrice(
                                                            item.price_min_cents,
                                                            item.price_max_cents,
                                                            item.unit,
                                                        )}
                                                    </span>
                                                    {margin(item) && (
                                                        <span className="block text-xs text-muted-foreground">
                                                            Costo{' '}
                                                            {formatCents(
                                                                item.cost_cents,
                                                            )}{' '}
                                                            · {margin(item)}
                                                        </span>
                                                    )}
                                                </span>
                                                <ChevronDown className="size-4 text-muted-foreground" />
                                            </span>
                                        </button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <CardContent className="flex flex-col gap-6 border-t py-4">
                                            <Form
                                                {...update.form.patch(item.id)}
                                                options={{
                                                    preserveScroll: true,
                                                }}
                                                className="flex flex-col gap-4"
                                            >
                                                {({ processing, errors }) => (
                                                    <>
                                                        <CatalogItemFields
                                                            item={item}
                                                            prefix={`item-${item.id}`}
                                                            errors={errors}
                                                            {...fieldProps}
                                                        />
                                                        <Button
                                                            type="submit"
                                                            disabled={
                                                                processing
                                                            }
                                                            className="w-fit"
                                                        >
                                                            Guardar
                                                        </Button>
                                                    </>
                                                )}
                                            </Form>

                                            <div className="flex flex-col gap-3">
                                                <div className="text-sm font-medium">
                                                    Sugerencias para el cliente
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Se muestran en el formulario
                                                    cuando el cliente elige este
                                                    ítem.
                                                </p>
                                                {item.suggestions.length >
                                                    0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.suggestions.map(
                                                            (suggestion) => (
                                                                <Badge
                                                                    key={
                                                                        suggestion.id
                                                                    }
                                                                    variant="secondary"
                                                                    className="gap-1"
                                                                >
                                                                    {
                                                                        suggestion.name
                                                                    }
                                                                    <Link
                                                                        href={suggestionRoutes.destroy(
                                                                            {
                                                                                item: item.id,
                                                                                suggested:
                                                                                    suggestion.id,
                                                                            },
                                                                        )}
                                                                        method="delete"
                                                                        as="button"
                                                                        preserveScroll
                                                                        aria-label={`Quitar ${suggestion.name}`}
                                                                    >
                                                                        <X className="size-3" />
                                                                    </Link>
                                                                </Badge>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                                <Form
                                                    {...suggestionRoutes.store.form(
                                                        item.id,
                                                    )}
                                                    options={{
                                                        preserveScroll: true,
                                                    }}
                                                    resetOnSuccess
                                                    className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                                                >
                                                    {({
                                                        processing,
                                                        errors,
                                                    }) => (
                                                        <>
                                                            <AdminField
                                                                label="Sugerir"
                                                                htmlFor={`suggest-${item.id}`}
                                                                error={
                                                                    errors.suggested_item_id
                                                                }
                                                            >
                                                                <OptionSelect
                                                                    id={`suggest-${item.id}`}
                                                                    name="suggested_item_id"
                                                                    defaultValue={String(
                                                                        suggestionCandidates(
                                                                            item,
                                                                        )[0]
                                                                            ?.value ??
                                                                            '',
                                                                    )}
                                                                    options={suggestionCandidates(
                                                                        item,
                                                                    )}
                                                                />
                                                            </AdminField>
                                                            <AdminField
                                                                label="Mensaje"
                                                                htmlFor={`suggest-reason-${item.id}`}
                                                            >
                                                                <Input
                                                                    id={`suggest-reason-${item.id}`}
                                                                    name="reason"
                                                                    placeholder="Ej. Completa tu puerta con chapa"
                                                                />
                                                            </AdminField>
                                                            <Button
                                                                type="submit"
                                                                variant="outline"
                                                                disabled={
                                                                    processing
                                                                }
                                                            >
                                                                Agregar
                                                            </Button>
                                                        </>
                                                    )}
                                                </Form>
                                            </div>
                                        </CardContent>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>
                        ))}
                    </section>
                ))}
            </div>
        </AppLayout>
    );
}
