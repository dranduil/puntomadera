import { Form, Head, Link } from '@inertiajs/react';
import {
    Check,
    ChevronRight,
    Hammer,
    Home,
    MapPin,
    MessageCircle,
    Ruler,
    ShieldCheck,
    Sparkles,
    Timer,
    Wrench,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { store as storeBooking } from '@/routes/bookings';

const images = {
    hero: 'images/guayaquil.jpg',
    workshop: 'images/works/service04.jpg',
    kitchen: 'images/works/service01.jpg',
    closet: 'images/works/service05.jpg',
    doors: 'images/works/service03.jpg',
    parallax: 'images/works/service06.jpg'
};

const defaultSeo = {
    title: 'Carpintero en Guayaquil | Muebles a medida, closets y puertas',
    description:
        'Carpintería a domicilio en Guayaquil, Ecuador. Muebles a medida, anaqueles de cocina, closets empotrados, instalación y reparación de puertas. Cotiza hoy por WhatsApp.',
};

type Landing = {
    hero_title: string | null;
    hero_subtitle: string | null;
    seo_title: string | null;
    seo_description: string | null;
    whatsapp_number: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    areas_served: string[] | null;
};

type Props = {
    landing: Landing;
    bookingStatus?: string | null;
};

const services = [
    {
        title: 'Muebles a medida',
        description:
            'Diseño y fabricación de muebles personalizados en melamina o madera, según tu espacio.',
        icon: Ruler,
    },
    {
        title: 'Cocinas y anaqueles',
        description:
            'Anaqueles de cocina, cajonería y herrajes. Distribución pensada para uso diario.',
        icon: Home,
    },
    {
        title: 'Closets empotrados',
        description:
            'Closets a medida con puertas corredizas o abatibles, con acabados prolijos.',
        icon: Hammer,
    },
    {
        title: 'Puertas e instalación',
        description:
            'Instalación de puertas interiores y principales, ajuste, bisagras y cerraduras.',
        icon: Wrench,
    },
    {
        title: 'Reparación de muebles',
        description:
            'Reparación y mantenimiento: bisagras, rieles, nivelación, refuerzos y acabado.',
        icon: Sparkles,
    },
    {
        title: 'Ebanistería y detalles',
        description:
            'Trabajos finos, remates, molduras y soluciones personalizadas para tu hogar.',
        icon: ShieldCheck,
    },
];

const faqs = [
    {
        q: '¿Atienden carpintería a domicilio en Guayaquil?',
        a: 'Sí. Coordinamos visita o levantamiento de medidas en Guayaquil y alrededores, según el proyecto.',
    },
    {
        q: '¿Qué necesito para una cotización rápida?',
        a: 'Medidas aproximadas, una foto del espacio y una referencia del estilo. Si no tienes medidas, agendamos visita.',
    },
    {
        q: '¿Trabajan con melamina y madera?',
        a: 'Sí. Recomendamos el material según uso, presupuesto, humedad del ambiente y tipo de acabado.',
    },
    {
        q: '¿Hacen instalación de puertas y ajustes?',
        a: 'Sí. Hacemos instalación, nivelación, ajuste de marco, bisagras, chapas y reparación.',
    },
];

export default function CarpinteroLanding({ landing, bookingStatus }: Props) {
    const areasServed = landing.areas_served ?? [
        'Guayaquil',
        'Samborondón',
        'Daule',
    ];

    const rawWhatsapp = landing.whatsapp_number?.trim();
    const whatsappNumber = (rawWhatsapp ? rawWhatsapp : '593000000000').replace(
        /[^0-9]/g,
        '',
    );
    const whatsappHref = `https://wa.me/${whatsappNumber}`;

    const seoTitle = landing.seo_title ?? defaultSeo.title;
    const seoDescription = landing.seo_description ?? defaultSeo.description;
    const heroTitle =
        landing.hero_title ??
        'Carpintero en Guayaquil para muebles a medida, closets y puertas';
    const heroSubtitle =
        landing.hero_subtitle ??
        'Diseñamos, fabricamos e instalamos carpintería para tu hogar o negocio. Cotización rápida por WhatsApp y trabajo prolijo.';

    const businessSchema = {
        '@context': 'https://schema.org',
        '@type': 'HomeAndConstructionBusiness',
        name: 'Carpintería en Guayaquil',
        areaServed: areasServed.map((name) => ({ '@type': 'City', name })),
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Guayaquil',
            addressRegion: 'Guayas',
            addressCountry: 'EC',
        },
        url: '/',
        sameAs: [whatsappHref],
        serviceType: [
            'Carpintería a domicilio',
            'Muebles a medida',
            'Anaqueles de cocina',
            'Closets empotrados',
            'Instalación de puertas',
            'Reparación de muebles',
        ],
    };

    return (
        <>
            <Head title={seoTitle}>
                <meta name="description" content={seoDescription} />
                <link rel="canonical" href="/" />
                <meta
                    property="og:title"
                    content="Carpintero en Guayaquil | Carpintería a domicilio"
                />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:url" content="/" />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="es_EC" />
                <meta property="og:image" content={images.hero} />
                <meta name="twitter:card" content="summary_large_image" />
                <script type="application/ld+json">
                    {JSON.stringify(businessSchema)}
                </script>
            </Head>

            <div className="min-h-screen bg-background text-foreground">
                <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-semibold tracking-tight"
                        >
                            <span className="inline-flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <Hammer className="size-4" />
                            </span>
                            <span>Carpintería</span>
                        </Link>

                        <nav className="hidden items-center gap-6 text-sm md:flex">
                            <a
                                href="#servicios"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Servicios
                            </a>
                            <a
                                href="#trabajos"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Trabajos
                            </a>
                            <a
                                href="#booking"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Agendar
                            </a>
                            <a
                                href="#proceso"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Proceso
                            </a>
                            <a
                                href="#faq"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                FAQ
                            </a>
                            <a
                                href="#contacto"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Contacto
                            </a>
                        </nav>

                        <div className="flex items-center gap-2">
                            <Button asChild className="hidden sm:inline-flex">
                                <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Cotizar por WhatsApp
                                    <ChevronRight className="size-4" />
                                </a>
                            </Button>
                            <Button asChild variant="outline" size="icon">
                                <a href="#contacto" aria-label="Ir a contacto">
                                    <MapPin className="size-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </header>

                <main>
                    <section className="relative overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${images.hero})` }}
                            aria-hidden="true"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background"
                            aria-hidden="true"
                        />
                        <div
                            className="absolute -top-32 right-[-8rem] h-72 w-72 rounded-full bg-primary/20 blur-3xl"
                            aria-hidden="true"
                        />
                        <div
                            className="absolute -bottom-40 left-[-10rem] h-80 w-80 rounded-full bg-muted-foreground/15 blur-3xl"
                            aria-hidden="true"
                        />

                        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                                    <MapPin className="size-3.5" />
                                    Guayaquil, Ecuador · Servicio a domicilio
                                </div>

                                <h1 className="mt-5 text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
                                    {heroTitle}
                                </h1>
                                <p className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg">
                                    {heroSubtitle}
                                </p>

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <Button asChild size="lg">
                                        <a
                                            href={whatsappHref}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Cotizar ahora
                                            <ChevronRight className="size-4" />
                                        </a>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <a href="#trabajos">Ver trabajos</a>
                                    </Button>
                                </div>

                                <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {[
                                        {
                                            title: 'Tiempo estimado',
                                            value: '24–48h',
                                            icon: Timer,
                                        },
                                        {
                                            title: 'Cobertura',
                                            value: 'Guayaquil',
                                            icon: MapPin,
                                        },
                                        {
                                            title: 'Acabado',
                                            value: 'Prolijo',
                                            icon: ShieldCheck,
                                        },
                                    ].map((kpi) => (
                                        <Card
                                            key={kpi.title}
                                            className="border-border/70 bg-background/70 p-4 backdrop-blur"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="inline-flex size-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                                                    <kpi.icon className="size-4" />
                                                </span>
                                                <div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {kpi.title}
                                                    </div>
                                                    <div className="mt-1 font-semibold">
                                                        {kpi.value}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="servicios" className="py-16 sm:py-20">
                        <div className="mx-auto max-w-6xl px-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div className="max-w-3xl">
                                    <h2 className="text-3xl font-semibold tracking-tight">
                                        Servicios de carpintería en Guayaquil
                                    </h2>
                                    <p className="mt-3 text-muted-foreground">
                                        Carpintería a domicilio, muebles a
                                        medida, anaqueles de cocina, closets
                                        empotrados e instalación de puertas.
                                        Todo con enfoque local y entregas
                                        claras.
                                    </p>
                                </div>
                                <Button asChild variant="outline">
                                    <a href="/servicios">
                                        Ver servicios
                                        <ChevronRight className="size-4" />
                                    </a>
                                </Button>
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {services.map((s) => (
                                    <Card
                                        key={s.title}
                                        className="group p-6 transition-colors hover:bg-accent/40"
                                    >
                                        <div className="flex items-start gap-4">
                                            <span className="inline-flex size-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                                <s.icon className="size-5" />
                                            </span>
                                            <div>
                                                <h3 className="text-base font-semibold">
                                                    {s.title}
                                                </h3>
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    {s.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <div className="mt-10 grid gap-6 rounded-2xl border border-border/70 bg-gradient-to-br from-background to-accent/20 p-6 sm:grid-cols-2 sm:p-8">
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        Zonas atendidas
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Guayaquil y alrededores: Samborondón,
                                        Vía a la Costa, Urdesa, Norte y Sur,
                                        según agenda.
                                    </p>
                                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                        <Button asChild>
                                            <a
                                                href={whatsappHref}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Agendar visita
                                                <ChevronRight className="size-4" />
                                            </a>
                                        </Button>
                                        <Button asChild variant="outline">
                                            <a href="#contacto">Dejar datos</a>
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    {[
                                        'Medidas y levantamiento en sitio',
                                        'Recomendación de materiales según uso',
                                        'Instalación limpia y ajuste final',
                                        'Garantía de mano de obra',
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/60 p-4"
                                        >
                                            <Check className="mt-0.5 size-4 text-primary" />
                                            <div className="text-sm">
                                                {item}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="trabajos" className="py-16 sm:py-20">
                        <div className="mx-auto max-w-6xl px-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div className="max-w-2xl">
                                    <h2 className="text-3xl font-semibold tracking-tight">
                                        Trabajos recientes (imágenes de ejemplo)
                                    </h2>
                                    <p className="mt-3 text-muted-foreground">
                                        Reemplazaremos estas imágenes por tu
                                        portafolio real. La estructura ya queda
                                        lista para SEO y conversión.
                                    </p>
                                </div>
                                <Button asChild variant="outline">
                                    <a href="/trabajos">
                                        Ver trabajos
                                        <ChevronRight className="size-4" />
                                    </a>
                                </Button>
                            </div>

                            <div className="mt-10 grid gap-4 md:grid-cols-12 md:auto-rows-[240px]">
                                {[
                                    {
                                        title: 'Cocina con anaqueles',
                                        image: images.kitchen,
                                        className: 'md:col-span-7',
                                    },
                                    {
                                        title: 'Closet empotrado',
                                        image: images.closet,
                                        className: 'md:col-span-5',
                                    },
                                    {
                                        title: 'Puertas y ajustes',
                                        image: images.doors,
                                        className: 'md:col-span-5',
                                    },
                                    {
                                        title: 'Taller y acabados',
                                        image: images.workshop,
                                        className: 'md:col-span-7',
                                    },
                                ].map((item) => (
                                    <Card
                                        key={item.title}
                                        className={cn(
                                            'group overflow-hidden p-0 md:h-full',
                                            item.className,
                                        )}
                                    >
                                        <div className="relative h-56 w-full sm:h-64 md:h-full">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="absolute inset-0 block h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                                            <div className="absolute right-0 bottom-0 left-0 p-5">
                                                <div className="text-sm text-muted-foreground">
                                                    Guayaquil · Proyecto ejemplo
                                                </div>
                                                <div className="mt-1 text-lg font-semibold">
                                                    {item.title}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section
                        className="relative overflow-hidden py-16 sm:py-20"
                        aria-label="Banner parallax"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
                            style={{
                                backgroundImage: `url(${images.parallax})`,
                            }}
                            aria-hidden="true"
                        />
                        <div
                            className="absolute inset-0 bg-background/70"
                            aria-hidden="true"
                        />
                        <div className="relative mx-auto max-w-6xl px-4">
                            <Card className="border-border/70 bg-background/70 p-8 backdrop-blur">
                                <div className="grid gap-8 md:grid-cols-3">
                                    {[
                                        {
                                            title: 'Cotización clara',
                                            text: 'Detallamos materiales, herrajes y tiempos para evitar sorpresas.',
                                        },
                                        {
                                            title: 'Instalación limpia',
                                            text: 'Protección del área y ajuste final para que todo quede perfecto.',
                                        },
                                        {
                                            title: 'Enfoque local',
                                            text: 'Guayaquil, Ecuador: lenguaje, materiales y soluciones reales para tu zona.',
                                        },
                                    ].map((item) => (
                                        <div key={item.title}>
                                            <div className="text-lg font-semibold">
                                                {item.title}
                                            </div>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </section>

                    <section id="booking" className="py-16 sm:py-20">
                        <div className="mx-auto max-w-6xl px-4">
                            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                                <div>
                                    <h2 className="text-3xl font-semibold tracking-tight">
                                        Agendar
                                    </h2>
                                    <p className="mt-3 text-muted-foreground">
                                        Envía una solicitud para agendar tu
                                        proyecto de carpintería en Guayaquil.
                                        Podemos visitar, tomar medidas y
                                        confirmar materiales y tiempos.
                                    </p>

                                    <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
                                        {[
                                            'Muebles a medida, closets, puertas, cocinas y reparaciones',
                                            'Cotización clara y tiempos realistas',
                                            'Guayaquil y alrededores',
                                        ].map((line) => (
                                            <div
                                                key={line}
                                                className="flex items-start gap-3"
                                            >
                                                <Check className="mt-0.5 size-4 text-primary" />
                                                <span>{line}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Card className="p-6 sm:p-8">
                                    {bookingStatus && (
                                        <div className="mb-6 rounded-md border border-border/60 bg-muted/20 p-3 text-sm">
                                            {bookingStatus}
                                        </div>
                                    )}

                                    <Form
                                        {...storeBooking.form()}
                                        resetOnSuccess={[
                                            'name',
                                            'email',
                                            'phone',
                                            'service',
                                            'preferred_date',
                                            'preferred_time',
                                            'message',
                                        ]}
                                        className="space-y-4"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="booking_name">
                                                        Nombre
                                                    </Label>
                                                    <Input
                                                        id="booking_name"
                                                        name="name"
                                                        required
                                                        placeholder="Tu nombre"
                                                    />
                                                    <InputError
                                                        message={errors.name}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="booking_phone">
                                                        Teléfono / WhatsApp
                                                    </Label>
                                                    <Input
                                                        id="booking_phone"
                                                        name="phone"
                                                        required
                                                        placeholder="+593 ..."
                                                    />
                                                    <InputError
                                                        message={errors.phone}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="booking_email">
                                                        Email (opcional)
                                                    </Label>
                                                    <Input
                                                        id="booking_email"
                                                        name="email"
                                                        type="email"
                                                        placeholder="email@example.com"
                                                    />
                                                    <InputError
                                                        message={errors.email}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="booking_service">
                                                        Servicio
                                                    </Label>
                                                    <select
                                                        id="booking_service"
                                                        name="service"
                                                        defaultValue="muebles-a-medida"
                                                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                    >
                                                        <option value="muebles-a-medida">
                                                            Muebles a medida
                                                        </option>
                                                        <option value="cocinas-anaqueles">
                                                            Cocinas y anaqueles
                                                        </option>
                                                        <option value="closets">
                                                            Closets empotrados
                                                        </option>
                                                        <option value="puertas">
                                                            Puertas e
                                                            instalación
                                                        </option>
                                                        <option value="reparacion">
                                                            Reparación de
                                                            muebles
                                                        </option>
                                                        <option value="ebanisteria">
                                                            Ebanistería y
                                                            detalles
                                                        </option>
                                                    </select>
                                                    <InputError
                                                        message={errors.service}
                                                    />
                                                </div>

                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="booking_preferred_date">
                                                            Fecha preferida
                                                        </Label>
                                                        <Input
                                                            id="booking_preferred_date"
                                                            name="preferred_date"
                                                            type="date"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.preferred_date
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="booking_preferred_time">
                                                            Hora preferida
                                                        </Label>
                                                        <Input
                                                            id="booking_preferred_time"
                                                            name="preferred_time"
                                                            placeholder="Mañana / Tarde"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.preferred_time
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="booking_message">
                                                        Detalles (opcional)
                                                    </Label>
                                                    <textarea
                                                        id="booking_message"
                                                        name="message"
                                                        className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                        placeholder="Cuéntanos qué necesitas, medidas, fotos o referencias..."
                                                    />
                                                    <InputError
                                                        message={errors.message}
                                                    />
                                                </div>

                                                <Button
                                                    type="submit"
                                                    className="w-full"
                                                    disabled={processing}
                                                >
                                                    Enviar solicitud
                                                </Button>
                                            </>
                                        )}
                                    </Form>
                                </Card>
                            </div>
                        </div>
                    </section>

                    <section id="proceso" className="py-16 sm:py-20">
                        <div className="mx-auto max-w-6xl px-4">
                            <h2 className="text-3xl font-semibold tracking-tight">
                                Proceso simple, resultados pro
                            </h2>
                            <p className="mt-3 max-w-3xl text-muted-foreground">
                                Un flujo pensado para avanzar rápido: medidas,
                                diseño, fabricación e instalación. Ideal para
                                proyectos de carpintería en Guayaquil con
                                tiempos realistas.
                            </p>

                            <div className="mt-10 grid gap-4 md:grid-cols-4">
                                {[
                                    {
                                        step: '01',
                                        title: 'Mensaje',
                                        text: 'Envía foto, idea y medidas. Si no tienes, agendamos visita.',
                                    },
                                    {
                                        step: '02',
                                        title: 'Medidas',
                                        text: 'Levantamiento en sitio y confirmación de materiales y herrajes.',
                                    },
                                    {
                                        step: '03',
                                        title: 'Fabricación',
                                        text: 'Corte, armado y acabado en taller con control de detalles.',
                                    },
                                    {
                                        step: '04',
                                        title: 'Instalación',
                                        text: 'Montaje, nivelación, ajuste final y entrega del proyecto.',
                                    },
                                ].map((p) => (
                                    <Card key={p.step} className="p-6">
                                        <div className="text-xs font-semibold text-muted-foreground">
                                            {p.step}
                                        </div>
                                        <div className="mt-2 text-base font-semibold">
                                            {p.title}
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {p.text}
                                        </p>
                                    </Card>
                                ))}
                            </div>

                            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg">
                                    <a
                                        href={whatsappHref}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Empezar por WhatsApp
                                        <ChevronRight className="size-4" />
                                    </a>
                                </Button>
                                <Button asChild size="lg" variant="outline">
                                    <a href="#faq">Ver preguntas frecuentes</a>
                                </Button>
                            </div>
                        </div>
                    </section>

                    <section id="faq" className="py-16 sm:py-20">
                        <div className="mx-auto max-w-6xl px-4">
                            <div className="max-w-3xl">
                                <h2 className="text-3xl font-semibold tracking-tight">
                                    Preguntas frecuentes
                                </h2>
                                <p className="mt-3 text-muted-foreground">
                                    Respuestas claras para contratar carpintería
                                    en Guayaquil con confianza.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-4 md:grid-cols-2">
                                {faqs.map((item) => (
                                    <Card key={item.q} className="p-6">
                                        <div className="text-base font-semibold">
                                            {item.q}
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {item.a}
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="contacto" className="py-16 sm:py-20">
                        <div className="mx-auto max-w-6xl px-4">
                            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                                <div>
                                    <h2 className="text-3xl font-semibold tracking-tight">
                                        Contáctanos
                                    </h2>
                                    <p className="mt-3 text-muted-foreground">
                                        Envíanos un mensaje o contáctanos por
                                        WhatsApp para carpintería en Guayaquil,
                                        Ecuador.
                                    </p>

                                    <div className="mt-8 grid gap-4">
                                        {[
                                            'Carpintero Guayaquil · respuesta rápida',
                                            'Muebles a medida, closets, puertas y reparaciones',
                                            'Guayaquil y alrededores',
                                        ].map((line) => (
                                            <div
                                                key={line}
                                                className="flex items-start gap-3"
                                            >
                                                <Check className="mt-0.5 size-4 text-primary" />
                                                <div className="text-sm text-muted-foreground">
                                                    {line}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 grid gap-2 text-sm text-muted-foreground">
                                        {landing.contact_phone && (
                                            <div>
                                                Teléfono:{' '}
                                                {landing.contact_phone}
                                            </div>
                                        )}
                                        {landing.contact_email && (
                                            <div>
                                                Email: {landing.contact_email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                                        <Button asChild size="lg">
                                            <a
                                                href={whatsappHref}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                WhatsApp
                                                <ChevronRight className="size-4" />
                                            </a>
                                        </Button>
                                        <Button
                                            asChild
                                            size="lg"
                                            variant="outline"
                                        >
                                            <a href="#booking">Agendar</a>
                                        </Button>
                                    </div>
                                </div>

                                <Card className="overflow-hidden p-0">
                                    <div className="relative">
                                        <div
                                            className="h-48 bg-cover bg-center bg-no-repeat md:bg-fixed"
                                            style={{
                                                backgroundImage: `url(${images.kitchen})`,
                                            }}
                                        />
                                        <div className="p-6 sm:p-8">
                                            <div className="text-sm font-semibold">
                                                Elige tu canal de contacto
                                            </div>
                                            <Separator className="my-5" />

                                            <div className="grid gap-3">
                                                <Button
                                                    asChild
                                                    className="w-full"
                                                >
                                                    <a
                                                        href={whatsappHref}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        WhatsApp
                                                        <ChevronRight className="size-4" />
                                                    </a>
                                                </Button>
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    <a href="/contacto">
                                                        Página de contacto
                                                        <ChevronRight className="size-4" />
                                                    </a>
                                                </Button>
                                            </div>

                                            <Separator className="my-6" />

                                            <div className="grid gap-3 text-sm text-muted-foreground">
                                                {[
                                                    'Foto del área (cocina / closet / puerta)',
                                                    'Medidas aproximadas',
                                                    'Material preferido (melamina / madera)',
                                                    'Ubicación en Guayaquil',
                                                ].map((item) => (
                                                    <div
                                                        key={item}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <Check className="mt-0.5 size-4 text-primary" />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </section>
                </main>

                <Button
                    asChild
                    className="fixed right-6 bottom-6 z-50 shadow-lg"
                >
                    <a href={whatsappHref} target="_blank" rel="noreferrer">
                        <MessageCircle className="size-4" />
                        WhatsApp
                    </a>
                </Button>

                <footer className="border-t border-border/60 py-10">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                            <div>
                                <div className="font-semibold">
                                    Carpintería en Guayaquil
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    Ecuador · Muebles a medida · Closets ·
                                    Puertas · Reparaciones
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button asChild variant="outline">
                                    <a href="#servicios">Servicios</a>
                                </Button>
                                <Button asChild>
                                    <a
                                        href={whatsappHref}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Cotizar
                                        <ChevronRight className="size-4" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                        <div className="mt-8 text-xs text-muted-foreground">
                            Landing page para SEO: carpintero en Guayaquil,
                            Ecuador.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
