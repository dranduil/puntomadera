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
} from 'lucide-react';
import { useMemo, useState } from 'react';
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

type StepKey = 'need' | 'details' | 'extras' | 'contact';

const STEP_TITLES: Record<StepKey, string> = {
    need: '¿Qué necesitas?',
    details: 'Cuéntanos los detalles',
    extras: 'También te puede interesar',
    contact: '¿Dónde es el trabajo y cómo te respondemos?',
};

const TYPES: {
    value: QuoteType;
    label: string;
    hint: string;
    icon: typeof Home;
}[] = [
    {
        value: 'cliente',
        label: 'Para mi casa',
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

const QUANTITY_UNITS: Record<
    string,
    { label: string; step: number; min: number }
> = {
    unidad: { label: 'unidades', step: 1, min: 1 },
    metro_lineal: { label: 'metros lineales (aprox.)', step: 0.5, min: 0.5 },
    m2: { label: 'm² (aprox.)', step: 0.5, min: 0.5 },
};

function stepForError(field: string): StepKey {
    if (
        field.startsWith('services') ||
        field === 'type' ||
        field === 'package'
    ) {
        return 'need';
    }

    if (
        field.startsWith('items') ||
        field === 'message' ||
        field.startsWith('photos')
    ) {
        return 'details';
    }

    return field.startsWith('accepted_suggestions') ? 'extras' : 'contact';
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
                <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" aria-hidden="true" />
                </span>
            )}
            {children}
        </button>
    );
}

function QuantityStepper({
    line,
    unit,
    onChange,
}: {
    line: Line;
    unit: { label: string; step: number; min: number };
    onChange: (quantity: number) => void;
}) {
    const clamp = (value: number) =>
        Math.min(500, Math.max(unit.min, Math.round(value * 2) / 2));

    return (
        <div className="flex flex-wrap items-center gap-2">
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
                aria-label={`Cantidad en ${unit.label}`}
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
            <span className="text-sm text-muted-foreground">{unit.label}</span>
        </div>
    );
}

function ItemCard({
    item,
    line,
    reason,
    onToggle,
    onQuantity,
}: {
    item: CatalogOption;
    line?: Line;
    reason?: string | null;
    onToggle: () => void;
    onQuantity?: (quantity: number) => void;
}) {
    const unit = QUANTITY_UNITS[item.unit];
    const selected = Boolean(line);

    return (
        <div
            className={cn(
                'flex gap-3 rounded-lg border bg-card p-3',
                selected && 'border-primary bg-primary/5',
            )}
        >
            {item.image_url ? (
                <img
                    src={item.image_url}
                    alt=""
                    loading="lazy"
                    className="size-16 shrink-0 rounded-md bg-muted object-cover"
                />
            ) : (
                <div className="flex size-16 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Sparkles className="size-5" aria-hidden="true" />
                </div>
            )}
            <div className="min-w-0 flex-1">
                {reason && (
                    <div className="mb-1 text-xs font-medium text-primary">
                        {reason}
                    </div>
                )}
                <div className="leading-snug font-medium">{item.name}</div>
                {item.description && (
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        {item.description}
                    </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1">
                    {item.includes_material && (
                        <Badge variant="secondary">Con material</Badge>
                    )}
                    {item.kind === 'producto' && (
                        <Badge variant="outline">Producto + instalación</Badge>
                    )}
                    {item.kind === 'aliado' && (
                        <Badge variant="outline">Con aliado de confianza</Badge>
                    )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Button
                        type="button"
                        size="sm"
                        variant={selected ? 'default' : 'outline'}
                        aria-pressed={selected}
                        onClick={onToggle}
                    >
                        {selected ? (
                            <Check aria-hidden="true" />
                        ) : (
                            <Plus aria-hidden="true" />
                        )}
                        {selected ? 'Agregado' : 'Agregar'}
                    </Button>
                    {line && unit && onQuantity && (
                        <QuantityStepper
                            line={line}
                            unit={unit}
                            onChange={onQuantity}
                        />
                    )}
                </div>
            </div>
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
    const [step, setStep] = useState<StepKey>('need');
    const [stepError, setStepError] = useState<string | null>(null);
    const fieldErrors = errors as Record<string, string | undefined>;

    const itemsById = useMemo(
        () => new Map(items.map((item) => [item.id, item])),
        [items],
    );

    const suggestions = useMemo(() => {
        const chosen = new Set(data.items.map((line) => line.catalog_item_id));
        const found = new Map<number, string | null>();

        data.items.forEach((line) =>
            itemsById.get(line.catalog_item_id)?.suggestions.forEach((s) => {
                if (!chosen.has(s.id) && !found.has(s.id)) {
                    found.set(s.id, s.reason);
                }
            }),
        );

        return [...found].flatMap(([id, reason]) => {
            const item = itemsById.get(id);

            return item ? [{ item, reason }] : [];
        });
    }, [data.items, itemsById]);

    const steps: StepKey[] =
        suggestions.length > 0
            ? ['need', 'details', 'extras', 'contact']
            : ['need', 'details', 'contact'];
    const stepIndex = Math.max(0, steps.indexOf(step));
    const isLastStep = stepIndex === steps.length - 1;

    const detailGroups = useMemo(() => {
        const wanted = new Set<number>(data.services);
        data.items.forEach((line) => {
            const serviceId = itemsById.get(line.catalog_item_id)?.service_id;

            if (serviceId) {
                wanted.add(serviceId);
            }
        });
        const shown =
            wanted.size > 0
                ? services.filter((s) => wanted.has(s.id))
                : services;
        const groups = shown
            .map((service) => ({
                key: `service-${service.id}`,
                title: service.name,
                items: items.filter((item) => item.service_id === service.id),
            }))
            .filter((group) => group.items.length > 0);
        const others = items.filter((item) => item.service_id === null);

        return others.length > 0
            ? [
                  ...groups,
                  { key: 'others', title: 'Otros trabajos', items: others },
              ]
            : groups;
    }, [data.services, data.items, items, itemsById, services]);

    const lineFor = (id: number) =>
        data.items.find((line) => line.catalog_item_id === id);

    const toggleItem = (item: CatalogOption) =>
        setData(
            'items',
            lineFor(item.id)
                ? data.items.filter((line) => line.catalog_item_id !== item.id)
                : [
                      ...data.items,
                      {
                          catalog_item_id: item.id,
                          quantity: QUANTITY_UNITS[item.unit]?.min ?? 1,
                      },
                  ],
        );

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
                quantity:
                    QUANTITY_UNITS[itemsById.get(id)?.unit ?? '']?.min ?? 1,
            })),
        }));

    const toggleSuggestion = (id: number) =>
        setData(
            'accepted_suggestions',
            data.accepted_suggestions.includes(id)
                ? data.accepted_suggestions.filter((value) => value !== id)
                : [...data.accepted_suggestions, id],
        );

    const goTo = (next: StepKey) => {
        setStep(next);
        setStepError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
            goTo(steps[stepIndex + 1]);

            return;
        }

        const suggested = new Set(suggestions.map(({ item }) => item.id));

        transform((fields) => ({
            ...fields,
            package: fields.type === 'casa_nueva' ? fields.package : '',
            accepted_suggestions: fields.accepted_suggestions.filter((id) =>
                suggested.has(id),
            ),
        }));

        post(store().url, {
            forceFormData: true,
            onError: (validationErrors) => {
                const first = Object.keys(validationErrors)[0];

                if (first) {
                    const target = stepForError(first);
                    goTo(steps.includes(target) ? target : 'contact');
                }
            },
        });
    };

    const itemErrors = Object.entries(fieldErrors).filter(
        ([key, message]) =>
            message && (key.startsWith('items') || key.startsWith('photos.')),
    );

    return (
        <>
            <SeoHead seo={seo} />

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader landing={{ whatsapp_number }} />

                <main className="mx-auto max-w-3xl px-4 pt-8 pb-36 sm:px-6 sm:pt-12 sm:pb-16">
                    <div className="text-sm font-medium text-primary">
                        Cotización sin compromiso · Guayaquil
                    </div>
                    <h1 className="mt-2 text-3xl font-medium tracking-tight text-balance sm:text-4xl">
                        Pide tu cotización
                    </h1>
                    <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                        Responde unas preguntas cortas. Revisamos tu pedido y te
                        enviamos la cotización por WhatsApp. Cada trabajo es
                        distinto, por eso no publicamos precios fijos.
                    </p>

                    <div className="mt-8" aria-live="polite">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                                Paso {stepIndex + 1} de {steps.length}
                            </span>
                            <a
                                href={buildWhatsAppHref(
                                    whatsapp_number,
                                    'Hola, quiero cotizar un trabajo de carpintería.',
                                )}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                            >
                                <MessageCircle
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Prefiero escribir por WhatsApp
                            </a>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                    width: `${((stepIndex + 1) / steps.length) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8">
                        <h2 className="text-xl font-semibold tracking-tight">
                            {STEP_TITLES[step]}
                        </h2>

                        {step === 'need' && (
                            <div className="mt-5 grid gap-6">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {TYPES.map((type) => (
                                        <ChoiceCard
                                            key={type.value}
                                            selected={data.type === type.value}
                                            onClick={() =>
                                                setData('type', type.value)
                                            }
                                        >
                                            <type.icon
                                                className="size-5 text-primary"
                                                aria-hidden="true"
                                            />
                                            <div className="mt-2 font-medium">
                                                {type.label}
                                            </div>
                                            <div className="mt-1 text-sm leading-5 text-muted-foreground">
                                                {type.hint}
                                            </div>
                                        </ChoiceCard>
                                    ))}
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

                                <div className="grid gap-3">
                                    <div className="text-sm font-medium">
                                        {data.type === 'casa_nueva'
                                            ? '¿Algo más? (opcional)'
                                            : 'Elige uno o varios servicios'}
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {services.map((service) => (
                                            <ChoiceCard
                                                key={service.id}
                                                selected={data.services.includes(
                                                    service.id,
                                                )}
                                                onClick={() =>
                                                    toggleService(service.id)
                                                }
                                                className="flex items-center gap-3"
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
                                                        className="size-12 shrink-0 object-contain"
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
                                <p className="text-sm leading-6 text-muted-foreground">
                                    Agrega los trabajos que necesitas y una
                                    cantidad aproximada. Si no estás seguro,
                                    cuéntalo en el mensaje y lo vemos juntos.
                                </p>

                                {detailGroups.map((group) => (
                                    <section
                                        key={group.key}
                                        className="grid gap-3"
                                    >
                                        <h3 className="font-medium">
                                            {group.title}
                                        </h3>
                                        {group.items.map((item) => (
                                            <ItemCard
                                                key={item.id}
                                                item={item}
                                                line={lineFor(item.id)}
                                                onToggle={() =>
                                                    toggleItem(item)
                                                }
                                                onQuantity={(quantity) =>
                                                    setQuantity(
                                                        item.id,
                                                        quantity,
                                                    )
                                                }
                                            />
                                        ))}
                                    </section>
                                ))}

                                {itemErrors.map(([key, message]) => (
                                    <InputError key={key} message={message} />
                                ))}

                                <div className="grid gap-2">
                                    <Label htmlFor="quote-message">
                                        Medidas, colores o detalles (opcional)
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
                                        placeholder="Ej.: closet de 2,5 m de ancho, color blanco, con cajones."
                                    />
                                    <InputError message={fieldErrors.message} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="quote-photos">
                                        Fotos del espacio (opcional)
                                    </Label>
                                    <Input
                                        id="quote-photos"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        onChange={(event) =>
                                            setData(
                                                'photos',
                                                Array.from(
                                                    event.target.files ?? [],
                                                ).slice(0, 5),
                                            )
                                        }
                                    />
                                    <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                                        <Camera
                                            className="mt-0.5 size-4 shrink-0"
                                            aria-hidden="true"
                                        />
                                        {data.photos.length > 0
                                            ? `${data.photos.length} foto(s) lista(s) para enviar.`
                                            : 'Hasta 5 fotos JPG, PNG o WEBP de máximo 5 MB. Nos ayudan a cotizar más rápido.'}
                                    </p>
                                    <InputError message={fieldErrors.photos} />
                                </div>
                            </div>
                        )}

                        {step === 'extras' && (
                            <div className="mt-5 grid gap-3">
                                <p className="text-sm leading-6 text-muted-foreground">
                                    Otros clientes con un trabajo parecido
                                    también pidieron esto. Márcalo si te
                                    interesa y lo incluimos en la cotización.
                                </p>
                                {suggestions.map(({ item, reason }) => (
                                    <ItemCard
                                        key={item.id}
                                        item={item}
                                        reason={reason}
                                        line={
                                            data.accepted_suggestions.includes(
                                                item.id,
                                            )
                                                ? {
                                                      catalog_item_id: item.id,
                                                      quantity: 1,
                                                  }
                                                : undefined
                                        }
                                        onToggle={() =>
                                            toggleSuggestion(item.id)
                                        }
                                    />
                                ))}
                            </div>
                        )}

                        {step === 'contact' && (
                            <div className="mt-5 grid gap-6">
                                <fieldset className="grid gap-3">
                                    <legend className="mb-3 text-sm font-medium">
                                        Zona del trabajo
                                    </legend>
                                    <div className="grid gap-3 sm:grid-cols-2">
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
                                            >
                                                <div className="pr-6 font-medium">
                                                    {zone.name}
                                                </div>
                                                {zone.neighborhoods.length >
                                                    0 && (
                                                    <div className="mt-1 text-sm leading-5 text-muted-foreground">
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

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2 sm:col-span-2">
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
                                        <InputError
                                            message={fieldErrors.sector}
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

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="quote-captcha">
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
                                </div>

                                <p className="text-xs leading-5 text-muted-foreground">
                                    Usamos tus datos solo para responder esta
                                    solicitud. Los precios pueden cambiar según
                                    materiales y distancia; la cotización final
                                    te llega por WhatsApp.
                                </p>
                            </div>
                        )}

                        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:static sm:mt-10 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
                            <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => goTo(steps[stepIndex - 1])}
                                    disabled={stepIndex === 0 || processing}
                                    className={cn(
                                        stepIndex === 0 && 'invisible',
                                    )}
                                >
                                    <ArrowLeft aria-hidden="true" />
                                    Atrás
                                </Button>
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
