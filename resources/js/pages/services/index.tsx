import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, CheckCircle2, MapPin, Ruler } from 'lucide-react';
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

type Landing = {
    whatsapp_number: string | null;
};

type Service = {
    id: number;
    name: string;
    slug: string;
    summary: string | null;
    description: string | null;
    process_steps: string[] | null;
    image_path: string | null;
};

type Props = {
    landing: Landing;
    services: Service[];
};

const trustPoints = [
    'Medidas y alcance definidos antes de fabricar',
    'Materiales recomendados para el uso real',
    'Instalación y ajuste final en Guayaquil',
];

function resolveImagePath(path: string | null | undefined) {
    if (!path) {
        return null;
    }

    return /^https?:\/\//i.test(path) ? path : `/${path.replace(/^\/+/, '')}`;
}

export default function ServicesIndex({ landing, services }: Props) {
    const siteUrl = import.meta.env.VITE_APP_URL || 'https://punto-madera.com';
    const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/servicios`;
    const seoTitle =
        'Servicios de carpintería en Guayaquil | Muebles, closets y puertas';
    const seoDescription =
        'Muebles a medida, closets, anaqueles de cocina, instalación y reparación de puertas en Guayaquil. Revisa el proceso y cotiza por WhatsApp.';
    const featuredService = services[0];
    const featuredImageUrl = resolveImagePath(featuredService?.image_path);

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
            </Head>

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                />

                <main>
                    <section className="border-b border-border/60 bg-card">
                        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:py-24">
                            <div>
                                <Badge
                                    variant="outline"
                                    className="gap-2 px-3 py-1.5 text-xs tracking-[0.16em] uppercase"
                                >
                                    <Ruler className="size-3.5" />
                                    Carpintería a medida
                                </Badge>
                                <h1 className="mt-6 max-w-2xl text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl">
                                    Soluciones de madera que encajan contigo
                                </h1>
                                <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                                    Muebles, cocinas, closets, puertas y
                                    reparaciones para hogares y negocios en
                                    Guayaquil. Cada servicio empieza con alcance
                                    claro y termina con un ajuste cuidadoso.
                                </p>

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <Button asChild size="lg">
                                        <Link href="/contacto">
                                            Cuéntanos tu proyecto
                                            <ArrowUpRight data-icon="inline-end" />
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link href="/trabajos">
                                            Ver proyectos reales
                                        </Link>
                                    </Button>
                                </div>

                                <div className="mt-12 grid max-w-xl grid-cols-3 gap-4 pt-5">
                                    <Separator className="col-span-3" />
                                    <div>
                                        <div className="text-2xl font-medium">
                                            {services.length || '—'}
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            servicios
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-medium">
                                            100%
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            a medida
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5 text-2xl font-medium">
                                            <MapPin className="size-5 text-primary" />
                                            GYE
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            cobertura local
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Card className="overflow-hidden rounded-2xl border-border/70 bg-background p-0 shadow-none">
                                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                    {featuredImageUrl ? (
                                        <img
                                            src={featuredImageUrl}
                                            alt={featuredService.name}
                                            className="h-full w-full object-cover"
                                            width="1200"
                                            height="900"
                                            fetchPriority="high"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                            Carpintería a medida en Guayaquil
                                        </div>
                                    )}
                                    <Badge className="absolute top-4 left-4 gap-2">
                                        <CheckCircle2 className="size-3.5" />
                                        Trabajo local
                                    </Badge>
                                </div>
                                <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                                    <div>
                                        <div className="text-sm font-semibold">
                                            De la idea al montaje
                                        </div>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                            Medimos, recomendamos, fabricamos e
                                            instalamos.
                                        </p>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">
                                            Comunicación directa
                                        </div>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                            Cotización clara por WhatsApp, sin
                                            vueltas.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    <section className="bg-background py-20 sm:py-28">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col gap-4 border-b border-border/60 pb-8 sm:flex-row sm:items-end sm:justify-between">
                                <div className="max-w-2xl">
                                    <div className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                                        Qué podemos construir
                                    </div>
                                    <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                                        Servicios para espacios que se usan
                                    </h2>
                                </div>
                                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                                    Explora cada servicio para conocer el
                                    alcance, el proceso y la mejor forma de
                                    pedir una cotización.
                                </p>
                            </div>

                            {services.length > 0 ? (
                                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                    {services.map((service, index) => {
                                        const imageUrl = resolveImagePath(
                                            service.image_path,
                                        );

                                        return (
                                            <Card
                                                key={service.id}
                                                className="group flex h-full flex-col overflow-hidden rounded-2xl border-border/70 bg-card p-0 shadow-none transition-transform duration-200 hover:-translate-y-1"
                                            >
                                                <div className="relative aspect-[5/3] overflow-hidden bg-muted">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={service.name}
                                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                            width="1200"
                                                            height="720"
                                                            loading={
                                                                index < 3
                                                                    ? 'eager'
                                                                    : 'lazy'
                                                            }
                                                        />
                                                    ) : null}
                                                    <Badge
                                                        variant="secondary"
                                                        className="absolute top-4 left-4"
                                                    >
                                                        0{index + 1}
                                                    </Badge>
                                                </div>
                                                <CardHeader className="gap-3">
                                                    <CardTitle className="text-xl font-medium">
                                                        {service.name}
                                                    </CardTitle>
                                                    <CardDescription className="text-sm leading-6">
                                                        {service.summary ??
                                                            service.description ??
                                                            'Ver detalles del servicio y proceso.'}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardFooter className="mt-auto pt-0">
                                                    <Button
                                                        asChild
                                                        variant="link"
                                                        className="px-0"
                                                    >
                                                        <Link
                                                            href={`/servicios/${service.slug}`}
                                                        >
                                                            Ver proceso
                                                            <ArrowUpRight data-icon="inline-end" />
                                                        </Link>
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <Card className="mt-10 max-w-2xl">
                                    <CardHeader>
                                        <CardTitle>
                                            Estamos preparando nuestros
                                            servicios
                                        </CardTitle>
                                        <CardDescription className="leading-6">
                                            Cuéntanos qué necesitas y te
                                            orientamos sobre muebles, puertas,
                                            closets y reparaciones para tu
                                            espacio.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter className="flex-wrap gap-3">
                                        <Button asChild>
                                            <Link href="/contacto">
                                                Solicitar cotización
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline">
                                            <Link href="/">
                                                Volver al inicio
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )}
                        </div>
                    </section>

                    <section className="border-y border-border/60 bg-card py-16 sm:py-20">
                        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
                            <div>
                                <div className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                                    Una forma clara de avanzar
                                </div>
                                <h2 className="mt-4 text-3xl font-medium tracking-tight">
                                    Confianza antes de fabricar
                                </h2>
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                {trustPoints.map((point) => (
                                    <div
                                        key={point}
                                        className="border-t border-border/70 pt-4"
                                    >
                                        <CheckCircle2 className="size-4 text-primary" />
                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                            {point}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
