import { Head, Link } from '@inertiajs/react';
import {
    Check,
    ChevronRight,
    Hammer,
    Home,
    MapPin,
    MessageCircle,
    Phone,
    Ruler,
    ShieldCheck,
    Sparkles,
    Timer,
    Wrench,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { PublicHeader } from '@/components/public-header';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getPublicAppName, sanitizePublicTitle } from '@/lib/site';
import { cn } from '@/lib/utils';

const images = {
    hero: 'images/works/puerta-caoba-regenerada.png',
    editorialHero: 'images/editorial/workshop-hero.jpg',
    materials: 'images/editorial/materials-process.jpg',
    workshop: 'images/works/punto-madera/punto-madera-42.jpg',
    kitchen: 'images/works/punto-madera/punto-madera-10.jpg',
    closet: 'images/works/punto-madera/punto-madera-20.jpg',
    doors: 'images/works/punto-madera/punto-madera-01.jpg',
};

const defaultSeo = {
    title: 'Carpintero en Guayaquil | Muebles, closets y puertas a medida',
    description:
        'Carpintero en Guayaquil para muebles a medida, closets, cocinas y puertas. Cotiza por WhatsApp instalación, reparación y acabados para tu hogar o negocio.',
};

type Landing = {
    hero_title: string | null;
    hero_subtitle: string | null;
    seo_title: string | null;
    seo_description: string | null;
    whatsapp_number: string | null;
    contact_phone: string | null;
    areas_served: string[] | null;
};

type Props = {
    landing: Landing;
};

const services = [
    {
        title: 'Muebles a medida',
        href: '/carpinteria-a-medida-guayaquil',
        description:
            'Diseño de muebles a medida en melamina o madera, según tu espacio.',
        icon: Ruler,
    },
    {
        title: 'Cocinas y anaqueles',
        href: '/servicios/closets-anaqueles-cocina-guayaquil',
        description:
            'Anaqueles de cocina, cajonería y herrajes. Distribución pensada para uso diario.',
        icon: Home,
    },
    {
        title: 'Closets empotrados',
        href: '/servicios/closets-anaqueles-cocina-guayaquil',
        description:
            'Closets a medida con puertas corredizas o abatibles, con acabados prolijos.',
        icon: Hammer,
    },
    {
        title: 'Puertas e instalación',
        href: '/instalacion-puertas-guayaquil',
        description:
            'Instalación de puertas interiores y principales, ajuste, bisagras y cerraduras.',
        icon: Wrench,
    },
    {
        title: 'Reparación de muebles',
        href: '/servicios/reparacion-muebles-madera-guayaquil',
        description:
            'Reparación y mantenimiento: bisagras, rieles, nivelación, refuerzos y acabado.',
        icon: Sparkles,
    },
    {
        title: 'Ebanistería y detalles',
        href: '/servicios/ebanisteria-fina-acabados-personalizados-guayaquil',
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

export default function CarpinteroLanding({ landing }: Props) {
    const appName = getPublicAppName(import.meta.env.VITE_APP_NAME);
    const siteUrl = import.meta.env.VITE_APP_URL || 'https://punto-madera.com';
    const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/`;
    const heroImageUrl = `${siteUrl.replace(/\/$/, '')}/${images.hero.replace(/^\//, '')}`;
    const areasServed = landing.areas_served ?? [
        'Guayaquil',
        'Samborondón',
        'Daule',
    ];

    const envWhatsapp =
        import.meta.env.VITE_WHATSAPP_NUMBER?.trim() ?? '593998897813';
    const rawWhatsapp = envWhatsapp || landing.whatsapp_number?.trim();
    const whatsappNumber = (rawWhatsapp ? rawWhatsapp : '593998897813').replace(
        /[^0-9]/g,
        '',
    );
    const whatsappHref = `https://wa.me/${whatsappNumber}`;

    const seoTitle = sanitizePublicTitle(landing.seo_title ?? defaultSeo.title);
    const seoDescription = landing.seo_description ?? defaultSeo.description;
    const heroTitle =
        landing.hero_title ??
        'Carpintero en Guayaquil para muebles a medida, closets y puertas';
    const heroSubtitle =
        landing.hero_subtitle ??
        'Diseñamos, fabricamos e instalamos carpintería para tu hogar o negocio. Cotización rápida por WhatsApp y trabajo prolijo.';
    const currentYear = new Date().getFullYear();
    const businessSchema = {
        '@type': 'HomeAndConstructionBusiness',
        '@id': `${canonicalUrl}#business`,
        name: `${appName} - Carpinteria en Guayaquil`,
        description: seoDescription,
        areaServed: [
            { '@type': 'Country', name: 'Ecuador' },
            { '@type': 'City', name: 'Guayaquil' },
            ...areasServed.map((name) => ({ '@type': 'City', name })),
        ],
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Guayaquil',
            addressRegion: 'Guayas',
            addressCountry: 'Ecuador',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: -2.170998,
            longitude: -79.922356,
        },
        url: canonicalUrl,
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
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            businessSchema,
            {
                '@type': 'WebSite',
                '@id': `${canonicalUrl}#website`,
                name: appName,
                url: canonicalUrl,
                inLanguage: 'es-EC',
                publisher: { '@id': `${canonicalUrl}#business` },
            },
            {
                '@type': 'FAQPage',
                '@id': `${canonicalUrl}#faq`,
                url: `${canonicalUrl}#faq`,
                inLanguage: 'es-EC',
                mainEntity: faqs.map((item) => ({
                    '@type': 'Question',
                    name: item.q,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: item.a,
                    },
                })),
            },
        ],
    };

    return (
        <>
            <Head title={seoTitle}>
                <meta
                    head-key="description"
                    name="description"
                    content={seoDescription}
                />
                <meta
                    head-key="robots"
                    name="robots"
                    content="index,follow,max-image-preview:large"
                />
                <meta
                    name="keywords"
                    content="carpinteria en guayaquil, carpintero en guayaquil, muebles a medida guayaquil, closets empotrados guayaquil, ebanisteria guayaquil, carpinteria ecuador"
                />
                <meta name="geo.region" content="EC-G" />
                <meta name="geo.placename" content="Guayaquil, Ecuador" />
                <meta name="geo.position" content="-2.170998;-79.922356" />
                <meta name="ICBM" content="-2.170998, -79.922356" />
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={canonicalUrl}
                />
                <meta
                    head-key="og:title"
                    property="og:title"
                    content={seoTitle}
                />
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={seoDescription}
                />
                <meta
                    head-key="og:url"
                    property="og:url"
                    content={canonicalUrl}
                />
                <meta head-key="og:type" property="og:type" content="website" />
                <meta
                    head-key="og:locale"
                    property="og:locale"
                    content="es_EC"
                />
                <meta
                    head-key="og:site_name"
                    property="og:site_name"
                    content={appName}
                />
                <meta
                    head-key="og:image"
                    property="og:image"
                    content={heroImageUrl}
                />
                <meta
                    head-key="og:image:alt"
                    property="og:image:alt"
                    content="Puerta de madera color caoba con acabado profesional en Guayaquil"
                />
                <meta
                    head-key="twitter:card"
                    name="twitter:card"
                    content="summary_large_image"
                />
                <meta
                    head-key="twitter:title"
                    name="twitter:title"
                    content={seoTitle}
                />
                <meta
                    head-key="twitter:description"
                    name="twitter:description"
                    content={seoDescription}
                />
                <link
                    head-key="sitemap"
                    rel="sitemap"
                    type="application/xml"
                    href={`${siteUrl.replace(/\/$/, '')}/sitemap.xml`}
                />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Head>

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                    isHome
                    whatsappHref={whatsappHref}
                />

                <main>
                    <section className="border-b border-border/60 bg-card">
                        <div className="mx-auto grid max-w-7xl items-stretch lg:grid-cols-[0.88fr_1.12fr]">
                            <div className="flex flex-col justify-center px-4 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 xl:px-16">
                                <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                                    <span className="h-px w-8 bg-primary" />
                                    Guayaquil, Ecuador
                                </div>

                                <h1 className="mt-6 max-w-xl text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl">
                                    {heroTitle}
                                </h1>
                                <p className="mt-6 max-w-lg text-base leading-7 text-pretty text-muted-foreground sm:text-lg">
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
                                            <ChevronRight data-icon="inline-end" />
                                        </a>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <a href="#trabajos">Ver trabajos</a>
                                    </Button>
                                </div>

                                <div className="mt-12 grid max-w-xl grid-cols-3 gap-4 pt-5">
                                    <Separator className="col-span-3" />
                                    {[
                                        {
                                            title: 'Respuesta',
                                            value: '24–48h',
                                            icon: Timer,
                                        },
                                        {
                                            title: 'Cobertura',
                                            value: 'Guayaquil',
                                            icon: MapPin,
                                        },
                                        {
                                            title: 'Enfoque',
                                            value: 'A medida',
                                            icon: ShieldCheck,
                                        },
                                    ].map((kpi) => (
                                        <div
                                            key={kpi.title}
                                            className="min-w-0"
                                        >
                                            <kpi.icon
                                                className="size-4 text-primary"
                                                aria-hidden="true"
                                            />
                                            <div className="mt-3 text-sm font-semibold">
                                                {kpi.value}
                                            </div>
                                            <div className="mt-1 text-xs text-muted-foreground">
                                                {kpi.title}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <figure className="relative min-h-[28rem] overflow-hidden lg:min-h-[42rem]">
                                <img
                                    src={images.editorialHero}
                                    alt="Taller luminoso de carpintería con muestras de madera y banco de trabajo"
                                    className="absolute inset-0 h-full w-full object-cover"
                                    width="1536"
                                    height="1024"
                                    fetchPriority="high"
                                    decoding="async"
                                />
                                <figcaption className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-4 rounded-lg border border-white/40 bg-background/85 px-4 py-3 text-xs text-muted-foreground backdrop-blur sm:right-6 sm:bottom-6 sm:left-6">
                                    <span>
                                        Diseño, fabricación e instalación
                                    </span>
                                    <span className="hidden sm:inline">
                                        Punto Madera · Guayaquil
                                    </span>
                                </figcaption>
                            </figure>
                        </div>
                    </section>

                    <section
                        id="servicios"
                        className="bg-background py-20 sm:py-28"
                    >
                        <div className="mx-auto max-w-6xl px-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div className="max-w-3xl">
                                    <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
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
                                        <ChevronRight data-icon="inline-end" />
                                    </a>
                                </Button>
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {services.map((s) => (
                                    <Card
                                        key={s.title}
                                        className="group rounded-xl border-border/70 bg-card p-6 shadow-none transition-colors hover:bg-muted/35"
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
                                                <Button
                                                    asChild
                                                    variant="link"
                                                    size="sm"
                                                    className="mt-3 px-0"
                                                >
                                                    <Link href={s.href}>
                                                        Ver servicio
                                                        <ChevronRight data-icon="inline-end" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <div className="mt-12 grid gap-6 rounded-2xl border border-border/70 bg-muted/35 p-6 sm:grid-cols-2 sm:p-8">
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
                                                <ChevronRight data-icon="inline-end" />
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
                                            className="flex items-start gap-3 rounded-lg border border-border/70 bg-background/70 p-4"
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

                    <section id="trabajos" className="bg-card py-20 sm:py-28">
                        <div className="mx-auto max-w-6xl px-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div className="max-w-2xl">
                                    <h2 className="text-3xl font-semibold tracking-tight">
                                        Trabajos recientes
                                    </h2>
                                    <p className="mt-3 text-muted-foreground">
                                        Conoce proyectos reales de puertas,
                                        closets, muebles y acabados realizados
                                        en Guayaquil.
                                    </p>
                                </div>
                                <Button asChild variant="outline">
                                    <a href="/trabajos">
                                        Ver trabajos
                                        <ChevronRight data-icon="inline-end" />
                                    </a>
                                </Button>
                            </div>

                            <div className="mt-10 grid gap-4 md:auto-rows-[240px] md:grid-cols-12">
                                {[
                                    {
                                        title: 'Cocina con anaqueles a medida',
                                        image: images.kitchen,
                                        className: 'md:col-span-7',
                                    },
                                    {
                                        title: 'Closet empotrado a medida',
                                        image: images.closet,
                                        className: 'md:col-span-5',
                                    },
                                    {
                                        title: 'Instalación y ajuste de puertas',
                                        image: images.doors,
                                        className: 'md:col-span-5',
                                    },
                                    {
                                        title: 'Taller de madera y acabados',
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
                                                    Guayaquil · Trabajo
                                                    realizado
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
                        className="border-y border-border/60 bg-background py-20 sm:py-28"
                        aria-label="Materiales y forma de trabajo"
                    >
                        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                            <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted">
                                <img
                                    src={images.materials}
                                    alt="Muestras de madera, cinta métrica y plano de un mueble a medida"
                                    className="aspect-[4/3] h-full w-full object-cover"
                                    width="1448"
                                    height="1086"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <div className="max-w-xl">
                                <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                                    <span className="h-px w-8 bg-primary" />
                                    Una forma clara de trabajar
                                </div>
                                <h2 className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl">
                                    Materiales pensados para el uso real
                                </h2>
                                <p className="mt-5 text-base leading-7 text-muted-foreground">
                                    Te ayudamos a elegir entre melamina y madera
                                    según el ambiente, el presupuesto y el uso
                                    diario. Definimos medidas, herrajes y
                                    tiempos antes de fabricar.
                                </p>
                                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                    {[
                                        {
                                            title: 'Cotización clara',
                                            text: 'Materiales y tiempos definidos.',
                                        },
                                        {
                                            title: 'Instalación limpia',
                                            text: 'Protección y ajuste final.',
                                        },
                                        {
                                            title: 'Enfoque local',
                                            text: 'Guayaquil y alrededores.',
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.title}
                                            className="border-t border-border/70 pt-4"
                                        >
                                            <div className="text-sm font-semibold">
                                                {item.title}
                                            </div>
                                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="booking" className="bg-card py-20 sm:py-28">
                        <div className="mx-auto max-w-6xl px-4">
                            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                                <div>
                                    <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
                                        Agendar
                                    </h2>
                                    <p className="mt-3 max-w-xl text-muted-foreground">
                                        Escríbenos directamente por WhatsApp
                                        para contarnos qué necesitas. Te
                                        orientamos sobre materiales, medidas y
                                        tiempos antes de confirmar una visita.
                                    </p>

                                    <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
                                        {[
                                            'Muebles, closets, cocinas, puertas y reparaciones',
                                            'Respuesta directa y cotización clara',
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

                                <Card className="border-border/70 bg-background shadow-none">
                                    <CardHeader>
                                        <CardTitle>
                                            Conversemos por WhatsApp
                                        </CardTitle>
                                        <CardDescription className="leading-6">
                                            Cuéntanos qué proyecto tienes y
                                            coordinamos el siguiente paso sin
                                            formularios largos.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <MessageCircle className="mt-0.5 size-5 shrink-0 text-primary" />
                                        <p>
                                            Puedes enviar fotos, medidas o una
                                            idea inicial directamente en el
                                            chat.
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex-col items-stretch gap-3">
                                        <Button asChild size="lg">
                                            <a
                                                href={whatsappHref}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Escribir por WhatsApp
                                                <MessageCircle data-icon="inline-end" />
                                            </a>
                                        </Button>
                                        <p className="text-center text-xs text-muted-foreground">
                                            Respuesta directa desde Guayaquil.
                                        </p>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </section>

                    <section
                        id="proceso"
                        className="bg-background py-20 sm:py-28"
                    >
                        <div className="mx-auto max-w-6xl px-4">
                            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
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
                                    <Card
                                        key={p.step}
                                        className="rounded-xl border-border/70 bg-card p-6 shadow-none"
                                    >
                                        <div className="text-xs font-semibold tracking-[0.16em] text-primary">
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
                                        <ChevronRight data-icon="inline-end" />
                                    </a>
                                </Button>
                                <Button asChild size="lg" variant="outline">
                                    <a href="#faq">Ver preguntas frecuentes</a>
                                </Button>
                            </div>
                        </div>
                    </section>

                    <section id="faq" className="bg-card py-20 sm:py-28">
                        <div className="mx-auto max-w-6xl px-4">
                            <div className="max-w-3xl">
                                <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
                                    Preguntas frecuentes
                                </h2>
                                <p className="mt-3 text-muted-foreground">
                                    Respuestas claras para contratar carpintería
                                    en Guayaquil con confianza.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-4 md:grid-cols-2">
                                {faqs.map((item) => (
                                    <Card
                                        key={item.q}
                                        className="rounded-xl border-border/70 bg-background p-6 shadow-none"
                                    >
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

                    <section
                        id="contacto"
                        className="bg-background py-20 sm:py-28"
                    >
                        <div className="mx-auto max-w-6xl px-4">
                            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                                <div>
                                    <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
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
                                    </div>

                                    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                                        <Button asChild size="lg">
                                            <a
                                                href={whatsappHref}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                WhatsApp
                                                <ChevronRight data-icon="inline-end" />
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

                                <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-none">
                                    <div className="relative">
                                        <img
                                            src={images.kitchen}
                                            alt="Cocina con anaqueles de madera fabricados a medida en Guayaquil"
                                            className="h-48 w-full object-cover"
                                            width="1200"
                                            height="800"
                                            loading="lazy"
                                            decoding="async"
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
                                                        <ChevronRight data-icon="inline-end" />
                                                    </a>
                                                </Button>
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    <a href="/contacto">
                                                        Página de contacto
                                                        <ChevronRight data-icon="inline-end" />
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

                <footer className="border-t border-border/60 bg-card py-12">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="grid gap-10 md:grid-cols-12">
                            <div className="md:col-span-5">
                                <div className="flex items-center gap-3 text-primary">
                                    <AppLogoIcon
                                        className="size-11 shrink-0 text-primary"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        <span className="block text-sm font-light tracking-[0.38em] lowercase">
                                            {appName.replace('-', ' ')}
                                        </span>
                                        <span className="mt-1 block text-[0.58rem] tracking-[0.32em] text-muted-foreground uppercase">
                                            Guayaquil, Ecuador
                                        </span>
                                    </span>
                                </div>
                                <p className="mt-4 max-w-md text-sm text-muted-foreground">
                                    Muebles a medida, closets empotrados,
                                    cocinas, puertas y reparaciones. Trabajo
                                    limpio, tiempos realistas y cotización
                                    clara.
                                </p>

                                <div className="mt-6 flex flex-wrap gap-2">
                                    <Button asChild>
                                        <a
                                            href={whatsappHref}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            WhatsApp
                                            <ChevronRight data-icon="inline-end" />
                                        </a>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <a href="/contacto">
                                            Contacto
                                            <ChevronRight data-icon="inline-end" />
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            <div className="md:col-span-3">
                                <div className="text-sm font-semibold">
                                    Navegación
                                </div>
                                <div className="mt-4 grid gap-2 text-sm">
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
                                        href="#faq"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        FAQ
                                    </a>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <div className="text-sm font-semibold">
                                    Páginas
                                </div>
                                <div className="mt-4 grid gap-2 text-sm">
                                    <a
                                        href="/servicios"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        Servicios
                                    </a>
                                    <a
                                        href="/trabajos"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        Trabajos
                                    </a>
                                    <a
                                        href="/contacto"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        Contacto
                                    </a>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <div className="text-sm font-semibold">
                                    Contacto
                                </div>
                                <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                                    {landing.contact_phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="size-4" />
                                            <span>{landing.contact_phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-4" />
                                        <span>Guayaquil, Ecuador</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator className="mt-10" />
                        <div className="flex flex-col gap-2 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
                            <div>
                                © {currentYear} {appName}. Todos los derechos
                                reservados.
                            </div>
                            <div>
                                Ecuador · Muebles a medida · Closets · Puertas ·
                                Reparaciones
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
