import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, MapPin, MessageCircle } from 'lucide-react';
import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { Badge } from '@/components/ui/badge';
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
import { formatServiceAreas, resolveServiceAreas } from '@/lib/service-areas';
import { buildWhatsAppHref, resolveWhatsAppNumber } from '@/lib/whatsapp';

type Landing = {
    whatsapp_number: string | null;
    contact_phone: string | null;
    areas_served?: string[] | null;
};

type Service = {
    id: number;
    name: string;
    slug: string;
    summary: string | null;
    description: string | null;
    process_steps: string[] | null;
    default_message: string | null;
    image_path: string | null;
};

type Seo = {
    title: string;
    description: string;
};

type Props = {
    landing: Landing;
    service: Service;
    seo?: Seo;
};

export default function ServiceShow({ landing, service, seo }: Props) {
    const areasServed = resolveServiceAreas(landing.areas_served);

    const whatsappNumber = resolveWhatsAppNumber(landing.whatsapp_number);
    const siteUrl = import.meta.env.VITE_APP_URL || 'https://punto-madera.com';
    const siteOrigin = siteUrl.replace(/\/$/, '');
    const canonicalUrl = `${siteOrigin}/servicios/${service.slug}`;
    // Title and description come from ServiceController so the SSR head,
    // the Blade fallback and the client all print the same snippet.
    const seoTitle = seo?.title ?? `${service.name} | Punto Madera`;
    const seoDescription =
        seo?.description ||
        service.summary?.trim() ||
        service.description?.trim() ||
        `Servicio de ${service.name} en Guayaquil.`;
    const imageUrl = service.image_path
        ? /^https?:\/\//i.test(service.image_path)
            ? service.image_path
            : `${siteOrigin}/${service.image_path.replace(/^\//, '')}`
        : null;
    const displayImageUrl = service.image_path
        ? /^https?:\/\//i.test(service.image_path)
            ? service.image_path
            : `/${service.image_path.replace(/^\/+/, '')}`
        : null;
    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        name: service.name,
        description: seoDescription,
        serviceType: service.name,
        areaServed: areasServed.map((name) => ({ '@type': 'Place', name })),
        provider: {
            '@type': 'HomeAndConstructionBusiness',
            '@id': `${siteOrigin}/#business`,
            name: 'Punto Madera',
            url: `${siteOrigin}/`,
        },
        url: canonicalUrl,
    };

    const composedMessage =
        service.default_message?.trim() ||
        `Hola, estoy interesado en el servicio: ${service.name}.`;

    const whatsappHref = buildWhatsAppHref(whatsappNumber, composedMessage);

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
                    content="Punto Madera"
                />
                {imageUrl && (
                    <>
                        <meta
                            head-key="og:image"
                            property="og:image"
                            content={imageUrl}
                        />
                        <meta
                            head-key="og:image:alt"
                            property="og:image:alt"
                            content={`${service.name} en Guayaquil`}
                        />
                    </>
                )}
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
                {imageUrl && (
                    <meta
                        head-key="twitter:image"
                        name="twitter:image"
                        content={imageUrl}
                    />
                )}
                <link
                    head-key="sitemap"
                    rel="sitemap"
                    type="application/xml"
                    href={`${siteOrigin}/sitemap.xml`}
                />
                <script head-key="schema" type="application/ld+json">
                    {JSON.stringify(serviceSchema)}
                </script>
            </Head>

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader whatsappHref={whatsappHref} />

                <main>
                    <section className="border-b border-border/60 bg-card">
                        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-24">
                            <div>
                                <Badge
                                    variant="outline"
                                    className="gap-2 px-3 py-1.5 text-xs tracking-[0.16em] uppercase"
                                >
                                    <MapPin className="size-3.5" />
                                    Servicio en Guayaquil
                                </Badge>
                                <h1 className="mt-6 text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl">
                                    {service.name}
                                </h1>
                                {service.summary && (
                                    <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                                        {service.summary}
                                    </p>
                                )}
                                <div className="mt-8">
                                    <Button asChild size="lg">
                                        <Link
                                            href={`/cotizar?servicio=${service.slug}`}
                                        >
                                            Pedir cotización
                                            <ArrowRight data-icon="inline-end" />
                                        </Link>
                                    </Button>
                                </div>
                                <div className="mt-6 max-w-xl rounded-xl border border-border/70 bg-background/70 p-4">
                                    <div className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                                        Zonas atendidas
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {`${formatServiceAreas(areasServed)}. Visitas según disponibilidad del sector.`}
                                    </p>
                                </div>
                            </div>

                            <Card className="overflow-hidden rounded-2xl border-border/70 bg-background p-0 shadow-none">
                                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                    {displayImageUrl ? (
                                        <img
                                            src={displayImageUrl}
                                            alt={`${service.name} en Guayaquil`}
                                            className="h-full w-full object-cover"
                                            width="1200"
                                            height="900"
                                            fetchPriority="high"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                            Servicio de carpintería en Guayaquil
                                        </div>
                                    )}
                                    <div className="absolute right-4 bottom-4 left-4 rounded-lg border border-white/40 bg-background/90 p-4 backdrop-blur">
                                        <div className="text-sm font-semibold">
                                            Diseño, fabricación e instalación
                                        </div>
                                        <div className="mt-1 text-xs leading-5 text-muted-foreground">
                                            Definimos materiales, medidas y
                                            acabado antes de empezar.
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>

                    <section className="bg-background py-20 sm:py-28">
                        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
                            <div>
                                <div className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                                    Cómo trabajamos
                                </div>
                                <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                                    Un proceso simple, con expectativas claras
                                </h2>
                                {service.description && (
                                    <p className="mt-5 max-w-2xl text-base leading-7 whitespace-pre-wrap text-muted-foreground">
                                        {service.description}
                                    </p>
                                )}

                                {service.process_steps &&
                                    service.process_steps.length > 0 && (
                                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                                            {service.process_steps.map(
                                                (step, index) => (
                                                    <Card
                                                        key={step}
                                                        className="rounded-xl border-border/70 bg-card shadow-none"
                                                    >
                                                        <CardHeader className="gap-3">
                                                            <Badge
                                                                variant="secondary"
                                                                className="w-fit"
                                                            >
                                                                0{index + 1}
                                                            </Badge>
                                                            <CardTitle className="text-base font-medium">
                                                                {step}
                                                            </CardTitle>
                                                        </CardHeader>
                                                    </Card>
                                                ),
                                            )}
                                        </div>
                                    )}
                            </div>

                            <Card className="h-fit rounded-2xl border-border/70 bg-card shadow-none lg:sticky lg:top-28">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-medium">
                                        Pide tu cotización
                                    </CardTitle>
                                    <CardDescription className="leading-6">
                                        Responde unas preguntas cortas y te
                                        enviamos el precio por WhatsApp.
                                    </CardDescription>
                                </CardHeader>
                                <Separator />
                                <CardContent className="grid gap-3 pt-6 text-sm text-muted-foreground">
                                    {[
                                        'Fotos del espacio, si tienes',
                                        'Medidas aproximadas',
                                        'Tu sector en Guayaquil',
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-center gap-2"
                                        >
                                            <CheckCircle2 className="size-4 text-primary" />
                                            {item}
                                        </div>
                                    ))}
                                </CardContent>
                                <CardFooter className="flex-col items-stretch gap-3">
                                    <Button asChild size="lg">
                                        <Link
                                            href={`/cotizar?servicio=${service.slug}`}
                                        >
                                            Pedir cotización
                                            <ArrowRight data-icon="inline-end" />
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <a
                                            href={whatsappHref}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <MessageCircle data-icon="inline-start" />
                                            Escribir por WhatsApp
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </section>
                </main>
                <PublicFooter />
            </div>
        </>
    );
}
