import { useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    Camera,
    Check,
    Home,
    KeyRound,
    MessageCircle,
    Minus,
    Plus,
    Sparkles,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import InputError from '@/components/input-error';
import { PublicHeader } from '@/components/public-header';
import { SeoHead } from '@/components/seo-head';
import type { Seo } from '@/components/seo-head';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SERVICE_ICONS } from '@/lib/service-icons';
import { cn } from '@/lib/utils';
import { buildWhatsAppHref } from '@/lib/whatsapp';
import { store } from '@/routes/quote-requests';

type ServiceOption = {
    id: number;
    slug: string;
    name: string;
    summary: string | null;
};

type CatalogOption = {
    id: number;
    slug: string;
    kind: string;
    name: string;
    description: string | null;
    unit: string;
    service_id: number | null;
    includes_material: boolean;
    image_url: string | null;
    suggestions: { id: number; reason: string | null }[];
};

type Zone = { id: number; name: string; neighborhoods: string[] };

type Package = {
    key: string;
    name: string;
    description: string;
    highlights: string[];
    item_ids: number[];
};

type QuoteType = 'cliente' | 'casa_nueva' | 'empresa';

type Props = {
    services: ServiceOption[];
    items: CatalogOption[];
    zones: Zone[];
    packages: Package[];
    prefill: {
        type: QuoteType;
        package: string | null;
        service_ids: number[];
        item_ids: number[];
    };
    captcha: { question: string };
    whatsapp_number: string;
    seo: Seo;
};

type Line = { catalog_item_id: number; quantity: number };

type Suggestion = { item: CatalogOption; reason: string | null };

type FormFields = {
    type: QuoteType;
    package: string;
    services: number[];
    items: Line[];
    accepted_suggestions: number[];
    message: string;
    photos: File[];
    service_zone_id: string;
    sector: string;
    name: string;
    phone: string;
    email: string;
    company: string;
    properties_count: string;
    captcha_answer: string;
    website: string;
};

type StepKey = 'need' | 'details' | 'contact';

const STEPS: { key: StepKey; label: string; title: string }[] = [
    { key: 'need', label: 'Trabajo', title: '¿Qué necesitas?' },
    { key: 'details', label: 'Detalles', title: 'Cuéntanos los detalles' },
    {
        key: 'contact',
        label: 'Tus datos',
        title: '¿Cómo te respondemos y dónde es?',
    },
];

const TYPES: {
    value: QuoteType;
    label: string;
    hint: string;
    icon: typeof Home;
}[] = [
    {
        value: 'cliente',
        label: 'Mi casa',
        hint: 'Un trabajo, una reparación o un mueble.',
        icon: Home,
    },
    {
        value: 'casa_nueva',
        label: 'Casa nueva',
        hint: 'Closets, cocina y puertas en paquete.',
        icon: KeyRound,
    },
    {
        value: 'empresa',
        label: 'Empresa o Airbnb',
        hint: 'Mantenimiento para varias propiedades.',
        icon: Building2,
    },
];

type QuantityUnit = { one: string; many: string; step: number; min: number };

const QUANTITY_UNITS: Record<string, QuantityUnit> = {
    unidad: { one: 'unidad', many: 'unidades', step: 1, min: 1 },
    metro_lineal: {
        one: 'metro lineal',
        many: 'metros lineales',
        step: 0.5,
        min: 0.5,
    },
    m2: { one: 'm²', many: 'm²', step: 0.5, min: 0.5 },
};

function unitLabel(unit: QuantityUnit, quantity: number): string {
    return quantity === 1 ? unit.one : unit.many;
}

const MAX_PHOTOS = 5;

function stepForError(field: string): StepKey {
    if (
        field.startsWith('services') ||
        field === 'type' ||
        field === 'package'
    ) {
        return 'need';
    }

    return field.startsWith('items') ||
        field.startsWith('accepted_suggestions') ||
        field === 'message' ||
        field.startsWith('photos')
        ? 'details'
        : 'contact';
}

/** "Zona C · Norte" is the admin's pricing name; visitors only need "Norte". */
function zoneLabel(name: string): string {
    return name.replace(/^Zona\s+\S+\s*·\s*/u, '') || name;
}

function itemNote(item: CatalogOption): string | null {
    if (item.kind === 'producto') {
        return 'Producto + instalación';
    }

    if (item.kind === 'aliado') {
        return 'Con aliado de confianza';
    }

    return item.includes_material ? 'Con material' : null;
}

function ChoiceCard({
    selected,
    onClick,
    className,
    children,
}: {
    selected: boolean;
    onClick: () => void;
    className?: string;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            aria-pressed={selected}
            onClick={onClick}
            className={cn(
                'relative rounded-lg border bg-card p-4 text-left transition-colors hover:border-primary/60 focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none',
                selected && 'border-primary bg-primary/5 ring-1 ring-primary',
                className,
            )}
        >
            {selected && (
                <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" aria-hidden="true" />
                </span>
            )}
            {children}
        </button>
    );
}

function SelectMark({ selected }: { selected: boolean }) {
    return (
        <span
            className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full border',
                selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background text-muted-foreground',
            )}
            aria-hidden="true"
        >
            {selected ? (
                <Check className="size-4" />
            ) : (
                <Plus className="size-4" />
            )}
        </span>
    );
}

function QuantityStepper({
    line,
    unit,
    onChange,
}: {
    line: Line;
    unit: QuantityUnit;
    onChange: (quantity: number) => void;
}) {
    const clamp = (value: number) =>
        Math.min(500, Math.max(unit.min, Math.round(value * 2) / 2));

    return (
        <div className="flex items-center gap-2">
            <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Menos"
                onClick={() => onChange(clamp(line.quantity - unit.step))}
            >
                <Minus aria-hidden="true" />
            </Button>
            <Input
                type="number"
                inputMode="decimal"
                min={unit.min}
                step={unit.step}
                max={500}
                value={line.quantity}
                onChange={(event) =>
                    onChange(Number(event.target.value) || unit.min)
                }
                className="h-9 w-20 text-center"
                aria-label={`Cantidad en ${unit.many}`}
            />
            <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Más"
                onClick={() => onChange(clamp(line.quantity + unit.step))}
            >
                <Plus aria-hidden="true" />
            </Button>
            <span className="text-sm text-muted-foreground">
                {unitLabel(unit, line.quantity)}
            </span>
        </div>
    );
}

/** One catalog item: the whole row toggles it; quantity and add-ons open below. */
function ItemRow({
    item,
    selected,
    onToggle,
    children,
}: {
    item: CatalogOption;
    selected: boolean;
    onToggle: () => void;
    children?: ReactNode;
}) {
    const note = itemNote(item);

    return (
        <div
            className={cn(
                'overflow-hidden rounded-lg border bg-card',
                selected && 'border-primary ring-1 ring-primary',
            )}
        >
            <button
                type="button"
                aria-pressed={selected}
                onClick={onToggle}
                className={cn(
                    'flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/40 focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none focus-visible:ring-inset',
                    selected && 'bg-primary/5',
                )}
            >
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt=""
                        loading="lazy"
                        className="size-14 shrink-0 rounded-md bg-muted object-cover"
                    />
                ) : (
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Sparkles className="size-5" aria-hidden="true" />
                    </span>
                )}
                <span className="min-w-0 flex-1">
                    <span className="block leading-snug font-medium">
                        {item.name}
                    </span>
                    {item.description && (
                        <span className="mt-0.5 line-clamp-2 block text-sm leading-5 text-muted-foreground">
                            {item.description}
                        </span>
                    )}
                    {note && (
                        <span className="mt-1 block text-xs font-medium text-primary">
                            {note}
                        </span>
                    )}
                </span>
                <SelectMark selected={selected} />
            </button>
            {children}
        </div>
    );
}

function PhotoThumb({
    file,
    label,
    onRemove,
}: {
    file: File;
    label: string;
    onRemove: () => void;
}) {
    const image = useRef<HTMLImageElement>(null);

    // The preview URL lives as long as the thumbnail, so memory is released.
    useEffect(() => {
        const url = URL.createObjectURL(file);

        if (image.current) {
            image.current.src = url;
        }

        return () => URL.revokeObjectURL(url);
    }, [file]);

    return (
        <div className="relative size-20 overflow-hidden rounded-md border bg-muted">
            <img ref={image} alt={label} className="size-full object-cover" />
            <button
                type="button"
                onClick={onRemove}
                aria-label={`Quitar ${label.toLowerCase()}`}
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
            >
                <X className="size-3.5" aria-hidden="true" />
            </button>
        </div>
    );
}

function PhotoPicker({
    photos,
    onChange,
    error,
}: {
    photos: File[];
    onChange: (photos: File[]) => void;
    error?: string;
}) {
    return (
        <div className="grid gap-2">
            <div className="text-sm font-medium">
                Fotos del espacio (opcional)
            </div>
            <div className="flex flex-wrap gap-2">
                {photos.map((photo, index) => (
                    <PhotoThumb
                        key={`${photo.name}-${photo.size}-${photo.lastModified}`}
                        file={photo}
                        label={`Foto ${index + 1}`}
                        onRemove={() =>
                            onChange(photos.filter((_, i) => i !== index))
                        }
                    />
                ))}
                {photos.length < MAX_PHOTOS && (
                    <label className="flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-input bg-card text-xs text-muted-foreground transition-colors focus-within:ring-[3px] focus-within:ring-ring/30 hover:border-primary hover:text-primary">
                        <Camera className="size-5" aria-hidden="true" />
                        Agregar
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            className="sr-only"
                            aria-label="Agregar fotos del espacio"
                            onChange={(event) => {
                                onChange(
                                    [
                                        ...photos,
                                        ...Array.from(event.target.files ?? []),
                                    ].slice(0, MAX_PHOTOS),
                                );
                                event.target.value = '';
                            }}
                        />
                    </label>
                )}
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
                Hasta {MAX_PHOTOS} fotos JPG, PNG o WEBP de máximo 5 MB. Con
                fotos te cotizamos más rápido.
            </p>
            <InputError message={error} />
        </div>
    );
}

export default function QuoteRequestPage({
    services,
    items,
    zones,
    packages,
    prefill,
    captcha,
    whatsapp_number,
    seo,
}: Props) {
    const initialPackage = packages.find((pkg) => pkg.key === prefill.package);
    const { data, setData, errors, processing, post, transform } =
        useForm<FormFields>({
            type: prefill.type,
            package: initialPackage?.key ?? '',
            services: prefill.service_ids,
            items: (initialPackage?.item_ids ?? prefill.item_ids).map((id) => ({
                catalog_item_id: id,
                quantity: 1,
            })),
            accepted_suggestions: [],
            message: '',
            photos: [],
            service_zone_id: '',
            sector: '',
            name: '',
            phone: '',
            email: '',
            company: '',
            properties_count: '',
            captcha_answer: '',
            website: '',
        });
    // A link from a service, product or package page already answers step 1.
    const [step, setStep] = useState<StepKey>(
        initialPackage ||
            prefill.service_ids.length > 0 ||
            prefill.item_ids.length > 0
            ? 'details'
            : 'need',
    );
    const [stepError, setStepError] = useState<string | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const fieldErrors = errors as Record<string, string | undefined>;

    const itemsById = useMemo(
        () => new Map(items.map((item) => [item.id, item])),
        [items],
    );

    // Add-ons shown under the item that suggests them, each one only once.
    const suggestionsByItem = useMemo(() => {
        const chosen = new Set(data.items.map((line) => line.catalog_item_id));
        const shown = new Set<number>();
        const byItem = new Map<number, Suggestion[]>();

        data.items.forEach((line) => {
            const related = (
                itemsById.get(line.catalog_item_id)?.suggestions ?? []
            ).flatMap(({ id, reason }) => {
                const item = itemsById.get(id);

                if (!item || chosen.has(id) || shown.has(id)) {
                    return [];
                }

                shown.add(id);

                return [{ item, reason }];
            });

            if (related.length > 0) {
                byItem.set(line.catalog_item_id, related);
            }
        });

        return byItem;
    }, [data.items, itemsById]);

    const suggestedIds = useMemo(
        () =>
            new Set(
                [...suggestionsByItem.values()].flatMap((list) =>
                    list.map(({ item }) => item.id),
                ),
            ),
        [suggestionsByItem],
    );

    const stepIndex = Math.max(
        0,
        STEPS.findIndex((entry) => entry.key === step),
    );
    const isLastStep = stepIndex === STEPS.length - 1;

    const detailGroups = useMemo(() => {
        const wanted = new Set<number>(data.services);
        data.items.forEach((line) => {
            const serviceId = itemsById.get(line.catalog_item_id)?.service_id;

            if (serviceId) {
                wanted.add(serviceId);
            }
        });

        // Only the chosen services: a company request without services just
        // describes the job in the message.
        const groups = services
            .filter((service) => wanted.has(service.id))
            .map((service) => ({
                key: `service-${service.id}`,
                title: service.name,
                items: items.filter((item) => item.service_id === service.id),
            }))
            .filter((group) => group.items.length > 0);
        const others = items.filter((item) => item.service_id === null);

        return groups.length > 0 && others.length > 0
            ? [
                  ...groups,
                  { key: 'others', title: 'Otros trabajos', items: others },
              ]
            : groups;
    }, [data.services, data.items, items, itemsById, services]);

    const lineFor = (id: number) =>
        data.items.find((line) => line.catalog_item_id === id);

    const isAcceptedSuggestion = (id: number) =>
        suggestedIds.has(id) && data.accepted_suggestions.includes(id);

    const toggleSuggestion = (id: number) =>
        setData(
            'accepted_suggestions',
            data.accepted_suggestions.includes(id)
                ? data.accepted_suggestions.filter((value) => value !== id)
                : [...data.accepted_suggestions, id],
        );

    const toggleItem = (item: CatalogOption) => {
        if (isAcceptedSuggestion(item.id)) {
            toggleSuggestion(item.id);

            return;
        }

        setData(
            'items',
            lineFor(item.id)
                ? data.items.filter((line) => line.catalog_item_id !== item.id)
                : [...data.items, { catalog_item_id: item.id, quantity: 1 }],
        );
    };

    const setQuantity = (id: number, quantity: number) =>
        setData(
            'items',
            data.items.map((line) =>
                line.catalog_item_id === id ? { ...line, quantity } : line,
            ),
        );

    const toggleService = (id: number) =>
        setData(
            'services',
            data.services.includes(id)
                ? data.services.filter((serviceId) => serviceId !== id)
                : [...data.services, id],
        );

    const choosePackage = (pkg: Package) =>
        setData((previous) => ({
            ...previous,
            package: pkg.key,
            items: pkg.item_ids.map((id) => ({
                catalog_item_id: id,
                quantity: 1,
            })),
        }));

    const goTo = (next: StepKey) => {
        setStep(next);
        setStepError(null);
        // Back to the progress bar, not the page intro, and announce the step.
        requestAnimationFrame(() => {
            progressRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            headingRef.current?.focus({ preventScroll: true });
        });
    };

    const summary = [
        ...data.items.flatMap((line) => {
            const item = itemsById.get(line.catalog_item_id);
            const unit = item ? QUANTITY_UNITS[item.unit] : undefined;

            if (!item) {
                return [];
            }

            return [
                unit
                    ? `${item.name} · ${line.quantity.toLocaleString('es-EC')} ${unitLabel(unit, line.quantity)}`
                    : item.name,
            ];
        }),
        ...data.accepted_suggestions
            .filter((id) => suggestedIds.has(id))
            .flatMap((id) => itemsById.get(id)?.name ?? []),
    ];

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (step === 'need') {
            const hasChoice =
                data.services.length > 0 ||
                data.items.length > 0 ||
                (data.type === 'casa_nueva' && data.package !== '') ||
                data.type === 'empresa';

            if (!hasChoice) {
                setStepError(
                    data.type === 'casa_nueva'
                        ? 'Elige un paquete o al menos un servicio.'
                        : 'Elige al menos un servicio.',
                );

                return;
            }
        }

        if (!isLastStep) {
            goTo(STEPS[stepIndex + 1].key);

            return;
        }

        transform((fields) => ({
            ...fields,
            package: fields.type === 'casa_nueva' ? fields.package : '',
            accepted_suggestions: fields.accepted_suggestions.filter((id) =>
                suggestedIds.has(id),
            ),
        }));

        post(store().url, {
            forceFormData: true,
            onError: (validationErrors) => {
                const first = Object.keys(validationErrors)[0];

                if (first) {
                    goTo(stepForError(first));
                }
            },
        });
    };

    const itemErrors = Object.entries(fieldErrors).filter(
        ([key, message]) =>
            message &&
            (key.startsWith('items') ||
                key.startsWith('accepted_suggestions') ||
                key.startsWith('photos.')),
    );
    const selectedType = TYPES.find((type) => type.value === data.type);

    return (
        <>
            <SeoHead seo={seo} />

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader />

                <main className="mx-auto max-w-3xl px-4 pt-8 pb-36 sm:px-6 sm:pt-12 sm:pb-16">
                    <h1 className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">
                        Pide tu cotización
                    </h1>
                    <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                        Tres pasos cortos y sin compromiso. Cada trabajo es
                        distinto: revisamos tu pedido y te enviamos el precio
                        por WhatsApp.
                    </p>
                    <a
                        href={buildWhatsAppHref(
                            whatsapp_number,
                            'Hola, quiero cotizar un trabajo de carpintería.',
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                        <MessageCircle className="size-4" aria-hidden="true" />
                        ¿Prefieres escribirnos? Abre WhatsApp
                    </a>

                    <div ref={progressRef} className="mt-8 scroll-mt-28">
                        <ol className="grid grid-cols-3 gap-2">
                            {STEPS.map((entry, index) => (
                                <li
                                    key={entry.key}
                                    aria-current={
                                        index === stepIndex ? 'step' : undefined
                                    }
                                    className="grid gap-1.5"
                                >
                                    <span
                                        className={cn(
                                            'h-1.5 rounded-full transition-colors',
                                            index <= stepIndex
                                                ? 'bg-primary'
                                                : 'bg-muted',
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            'flex items-center gap-1 text-xs',
                                            index === stepIndex
                                                ? 'font-semibold text-foreground'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {index < stepIndex && (
                                            <Check
                                                className="size-3.5 text-primary"
                                                aria-hidden="true"
                                            />
                                        )}
                                        {index + 1}. {entry.label}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8">
                        <h2
                            ref={headingRef}
                            tabIndex={-1}
                            className="text-xl font-semibold tracking-tight focus:outline-none"
                        >
                            {STEPS[stepIndex].title}
                        </h2>

                        {step === 'need' && (
                            <div className="mt-5 grid gap-6">
                                <div className="grid gap-2">
                                    <div className="text-sm font-medium">
                                        ¿Para dónde es?
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {TYPES.map((type) => (
                                            <ChoiceCard
                                                key={type.value}
                                                selected={
                                                    data.type === type.value
                                                }
                                                onClick={() =>
                                                    setData('type', type.value)
                                                }
                                                className="flex flex-col items-center gap-1.5 px-2 py-3 text-center"
                                            >
                                                <type.icon
                                                    className="size-5 text-primary"
                                                    aria-hidden="true"
                                                />
                                                <span className="text-sm leading-tight font-medium">
                                                    {type.label}
                                                </span>
                                            </ChoiceCard>
                                        ))}
                                    </div>
                                    {selectedType && (
                                        <p className="text-sm text-muted-foreground">
                                            {selectedType.hint}
                                        </p>
                                    )}
                                </div>

                                {data.type === 'casa_nueva' && (
                                    <div className="grid gap-3">
                                        <div className="text-sm font-medium">
                                            Elige un paquete
                                        </div>
                                        {packages.map((pkg) => (
                                            <ChoiceCard
                                                key={pkg.key}
                                                selected={
                                                    data.package === pkg.key
                                                }
                                                onClick={() =>
                                                    choosePackage(pkg)
                                                }
                                            >
                                                <div className="pr-8 font-medium">
                                                    {pkg.name}
                                                </div>
                                                <div className="mt-1 text-sm leading-6 text-muted-foreground">
                                                    {pkg.description}
                                                </div>
                                                <ul className="mt-2 flex flex-wrap gap-1.5">
                                                    {pkg.highlights.map(
                                                        (highlight) => (
                                                            <li key={highlight}>
                                                                <Badge variant="secondary">
                                                                    {highlight}
                                                                </Badge>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </ChoiceCard>
                                        ))}
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <div className="text-sm font-medium">
                                        {data.type === 'casa_nueva'
                                            ? '¿Algo más? (opcional)'
                                            : data.type === 'empresa'
                                              ? '¿Qué trabajos? (opcional)'
                                              : 'Elige uno o varios servicios'}
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {services.map((service) => (
                                            <ChoiceCard
                                                key={service.id}
                                                selected={data.services.includes(
                                                    service.id,
                                                )}
                                                onClick={() =>
                                                    toggleService(service.id)
                                                }
                                                className="flex items-center gap-3 p-3"
                                            >
                                                {SERVICE_ICONS[
                                                    service.slug
                                                ] && (
                                                    <img
                                                        src={
                                                            SERVICE_ICONS[
                                                                service.slug
                                                            ]
                                                        }
                                                        alt=""
                                                        loading="lazy"
                                                        className="size-10 shrink-0 object-contain"
                                                    />
                                                )}
                                                <span className="pr-6 leading-snug font-medium">
                                                    {service.name}
                                                </span>
                                            </ChoiceCard>
                                        ))}
                                    </div>
                                </div>

                                <InputError
                                    message={
                                        stepError ??
                                        fieldErrors.services ??
                                        fieldErrors.package ??
                                        fieldErrors.type
                                    }
                                />
                            </div>
                        )}

                        {step === 'details' && (
                            <div className="mt-5 grid gap-8">
                                {detailGroups.length > 0 && (
                                    <p className="text-sm leading-6 text-muted-foreground">
                                        Toca lo que necesitas y pon una cantidad
                                        aproximada. Si no estás seguro, sáltalo
                                        y cuéntanos abajo.
                                    </p>
                                )}

                                {detailGroups.map((group) => (
                                    <section
                                        key={group.key}
                                        className="grid gap-2"
                                    >
                                        <h3 className="font-medium">
                                            {group.title}
                                        </h3>
                                        {group.items.map((item) => {
                                            const line = lineFor(item.id);
                                            const unit =
                                                QUANTITY_UNITS[item.unit];
                                            const related =
                                                suggestionsByItem.get(
                                                    item.id,
                                                ) ?? [];

                                            return (
                                                <ItemRow
                                                    key={item.id}
                                                    item={item}
                                                    selected={
                                                        Boolean(line) ||
                                                        isAcceptedSuggestion(
                                                            item.id,
                                                        )
                                                    }
                                                    onToggle={() =>
                                                        toggleItem(item)
                                                    }
                                                >
                                                    {line && unit && (
                                                        <div className="border-t px-3 py-3">
                                                            <QuantityStepper
                                                                line={line}
                                                                unit={unit}
                                                                onChange={(
                                                                    quantity,
                                                                ) =>
                                                                    setQuantity(
                                                                        item.id,
                                                                        quantity,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                    {line &&
                                                        related.length > 0 && (
                                                            <div className="grid gap-2 border-t bg-muted/30 px-3 py-3">
                                                                <div className="text-xs font-medium text-muted-foreground">
                                                                    Muchos
                                                                    clientes
                                                                    también
                                                                    agregan
                                                                </div>
                                                                {related.map(
                                                                    ({
                                                                        item: extra,
                                                                        reason,
                                                                    }) => {
                                                                        const accepted =
                                                                            data.accepted_suggestions.includes(
                                                                                extra.id,
                                                                            );

                                                                        return (
                                                                            <button
                                                                                key={
                                                                                    extra.id
                                                                                }
                                                                                type="button"
                                                                                aria-pressed={
                                                                                    accepted
                                                                                }
                                                                                onClick={() =>
                                                                                    toggleSuggestion(
                                                                                        extra.id,
                                                                                    )
                                                                                }
                                                                                className={cn(
                                                                                    'flex items-center gap-3 rounded-md border bg-background px-3 py-2 text-left transition-colors hover:border-primary/60 focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none',
                                                                                    accepted &&
                                                                                        'border-primary',
                                                                                )}
                                                                            >
                                                                                <span className="min-w-0 flex-1">
                                                                                    <span className="block text-sm font-medium">
                                                                                        {
                                                                                            extra.name
                                                                                        }
                                                                                    </span>
                                                                                    {reason && (
                                                                                        <span className="block text-xs text-muted-foreground">
                                                                                            {
                                                                                                reason
                                                                                            }
                                                                                        </span>
                                                                                    )}
                                                                                </span>
                                                                                <SelectMark
                                                                                    selected={
                                                                                        accepted
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        );
                                                                    },
                                                                )}
                                                            </div>
                                                        )}
                                                </ItemRow>
                                            );
                                        })}
                                    </section>
                                ))}

                                {itemErrors.map(([key, message]) => (
                                    <InputError key={key} message={message} />
                                ))}

                                <div className="grid gap-2">
                                    <Label htmlFor="quote-message">
                                        {detailGroups.length > 0
                                            ? 'Medidas, colores o detalles (opcional)'
                                            : 'Cuéntanos qué necesitas'}
                                    </Label>
                                    <Textarea
                                        id="quote-message"
                                        value={data.message}
                                        onChange={(event) =>
                                            setData(
                                                'message',
                                                event.target.value,
                                            )
                                        }
                                        maxLength={2000}
                                        placeholder={
                                            data.type === 'empresa'
                                                ? 'Ej.: 6 suites en Samborondón, revisión de puertas y chapas cada mes.'
                                                : 'Ej.: closet de 2,5 m de ancho, color blanco, con cajones.'
                                        }
                                    />
                                    <InputError message={fieldErrors.message} />
                                </div>

                                <PhotoPicker
                                    photos={data.photos}
                                    onChange={(photos) =>
                                        setData('photos', photos)
                                    }
                                    error={fieldErrors.photos}
                                />
                            </div>
                        )}

                        {step === 'contact' && (
                            <div className="mt-5 grid gap-8">
                                {summary.length > 0 && (
                                    <div className="rounded-lg border bg-card p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-sm font-medium">
                                                Tu pedido
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => goTo('details')}
                                                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
                                            >
                                                Cambiar
                                            </button>
                                        </div>
                                        <ul className="mt-2 grid gap-1 text-sm leading-6 text-muted-foreground">
                                            {summary.map((line) => (
                                                <li key={line}>{line}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="quote-name">
                                            Tu nombre
                                        </Label>
                                        <Input
                                            id="quote-name"
                                            value={data.name}
                                            onChange={(event) =>
                                                setData(
                                                    'name',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                            maxLength={80}
                                            autoComplete="name"
                                        />
                                        <InputError
                                            message={fieldErrors.name}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="quote-phone">
                                            Tu WhatsApp
                                        </Label>
                                        <Input
                                            id="quote-phone"
                                            type="tel"
                                            inputMode="tel"
                                            value={data.phone}
                                            onChange={(event) =>
                                                setData(
                                                    'phone',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                            maxLength={20}
                                            autoComplete="tel"
                                            placeholder="09…"
                                        />
                                        <InputError
                                            message={fieldErrors.phone}
                                        />
                                    </div>

                                    {data.type === 'empresa' && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="quote-company">
                                                    Empresa o negocio
                                                </Label>
                                                <Input
                                                    id="quote-company"
                                                    value={data.company}
                                                    onChange={(event) =>
                                                        setData(
                                                            'company',
                                                            event.target.value,
                                                        )
                                                    }
                                                    required
                                                    maxLength={120}
                                                    autoComplete="organization"
                                                />
                                                <InputError
                                                    message={
                                                        fieldErrors.company
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="quote-properties">
                                                    ¿Cuántas propiedades u
                                                    oficinas?
                                                </Label>
                                                <Input
                                                    id="quote-properties"
                                                    type="number"
                                                    inputMode="numeric"
                                                    min={1}
                                                    max={500}
                                                    value={
                                                        data.properties_count
                                                    }
                                                    onChange={(event) =>
                                                        setData(
                                                            'properties_count',
                                                            event.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        fieldErrors.properties_count
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="quote-email">
                                            Correo (opcional)
                                        </Label>
                                        <Input
                                            id="quote-email"
                                            type="email"
                                            value={data.email}
                                            onChange={(event) =>
                                                setData(
                                                    'email',
                                                    event.target.value,
                                                )
                                            }
                                            maxLength={120}
                                            autoComplete="email"
                                        />
                                        <InputError
                                            message={fieldErrors.email}
                                        />
                                    </div>
                                </div>

                                <fieldset className="grid gap-2">
                                    <legend className="mb-2 text-sm font-medium">
                                        ¿En qué sector es el trabajo?
                                    </legend>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {zones.map((zone) => (
                                            <ChoiceCard
                                                key={zone.id}
                                                selected={
                                                    data.service_zone_id ===
                                                    String(zone.id)
                                                }
                                                onClick={() =>
                                                    setData(
                                                        'service_zone_id',
                                                        String(zone.id),
                                                    )
                                                }
                                                className="p-3"
                                            >
                                                <div className="pr-6 font-medium">
                                                    {zoneLabel(zone.name)}
                                                </div>
                                                {zone.neighborhoods.length >
                                                    0 && (
                                                    <div className="mt-0.5 text-sm leading-5 text-muted-foreground">
                                                        {zone.neighborhoods
                                                            .slice(0, 5)
                                                            .join(', ')}
                                                        {zone.neighborhoods
                                                            .length > 5 && '…'}
                                                    </div>
                                                )}
                                            </ChoiceCard>
                                        ))}
                                    </div>
                                    <InputError
                                        message={fieldErrors.service_zone_id}
                                    />
                                </fieldset>

                                <div className="grid gap-2">
                                    <Label htmlFor="quote-sector">
                                        Barrio, ciudadela o urbanización
                                        (opcional)
                                    </Label>
                                    <Input
                                        id="quote-sector"
                                        value={data.sector}
                                        onChange={(event) =>
                                            setData(
                                                'sector',
                                                event.target.value,
                                            )
                                        }
                                        maxLength={120}
                                        placeholder="Ej.: Ciudad Celeste, Sauces 8…"
                                    />
                                    <InputError message={fieldErrors.sector} />
                                </div>

                                <div className="hidden" aria-hidden="true">
                                    <Label htmlFor="quote-website">
                                        Sitio web
                                    </Label>
                                    <Input
                                        id="quote-website"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={data.website}
                                        onChange={(event) =>
                                            setData(
                                                'website',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="quote-captcha">
                                        Para saber que no eres un robot:{' '}
                                        {captcha.question}
                                    </Label>
                                    <Input
                                        id="quote-captcha"
                                        inputMode="numeric"
                                        value={data.captcha_answer}
                                        onChange={(event) =>
                                            setData(
                                                'captcha_answer',
                                                event.target.value,
                                            )
                                        }
                                        required
                                        maxLength={10}
                                        className="max-w-32"
                                    />
                                    <InputError
                                        message={
                                            fieldErrors.captcha_answer ??
                                            fieldErrors.website
                                        }
                                    />
                                </div>

                                <p className="text-xs leading-5 text-muted-foreground">
                                    Usamos tus datos solo para responder esta
                                    solicitud. El precio depende de materiales y
                                    distancia; la cotización final te llega por
                                    WhatsApp.
                                </p>
                            </div>
                        )}

                        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:static sm:mt-10 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
                            <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        goTo(STEPS[stepIndex - 1].key)
                                    }
                                    disabled={stepIndex === 0 || processing}
                                    className={cn(
                                        stepIndex === 0 && 'invisible',
                                    )}
                                >
                                    <ArrowLeft aria-hidden="true" />
                                    Atrás
                                </Button>
                                {step === 'details' && summary.length > 0 && (
                                    <span className="text-sm text-muted-foreground">
                                        {summary.length}{' '}
                                        {summary.length === 1
                                            ? 'elegido'
                                            : 'elegidos'}
                                    </span>
                                )}
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={processing}
                                >
                                    {isLastStep
                                        ? processing
                                            ? 'Enviando…'
                                            : 'Enviar solicitud'
                                        : 'Siguiente'}
                                    <ArrowRight aria-hidden="true" />
                                </Button>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}
