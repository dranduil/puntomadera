import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, MapPin } from 'lucide-react';
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

type Work = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    worked_on: string | null;
    location: string | null;
    images: string[] | null;
    image_alts: string[] | null;
};

type Paginator<T> = {
    data: T[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

type Seo = {
    title: string;
    description: string;
    canonical: string;
};

type Props = {
    landing: Landing;
    seo: Seo;
    works: Paginator<Work>;
};

function imageAlt(work: Work, index: number): string {
    return (
        work.image_alts?.[index] ??
        `${work.title}${work.location ? ` en ${work.location}` : ''}`
    );
}

function WorkImage({
    work,
    index = 0,
    featured = false,
}: {
    work: Work;
    index?: number;
    featured?: boolean;
}) {
    const image = work.images?.[index];

    if (!image) {
        return (
            <div className="flex h-full min-h-56 items-center justify-center bg-muted text-sm text-muted-foreground">
                Sin imagen disponible
            </div>
        );
    }

    return (
        <img
            src={image}
            alt={imageAlt(work, index)}
            className="h-full w-full object-cover"
            width="1200"
            height="900"
            loading={featured ? 'eager' : 'lazy'}
        />
    );
}

export default function WorksIndex({ landing, seo, works }: Props) {
    const siteUrl = new URL(seo.canonical).origin;
    const featuredWork = works.data[0];
    const remainingWorks = works.data.slice(1);

    return (
        <>
            <Head title={seo.title}>
                <meta
                    head-key="description"
                    name="description"
                    content={seo.description}
                />
                <meta
                    head-key="robots"
                    name="robots"
                    content="index,follow,max-image-preview:large"
                />
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={seo.canonical}
                />
                <meta
                    head-key="og:title"
                    property="og:title"
                    content={seo.title}
                />
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={seo.description}
                />
                <meta
                    head-key="og:url"
                    property="og:url"
                    content={seo.canonical}
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
                    content={seo.title}
                />
                <meta
                    head-key="twitter:description"
                    name="twitter:description"
                    content={seo.description}
                />
                <link
                    head-key="sitemap"
                    rel="sitemap"
                    type="application/xml"
                    href={`${siteUrl}/sitemap.xml`}
                />
            </Head>

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                />

                <main>
                    <section className="border-b border-border/60 bg-card">
                        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-24">
                            <div>
                                <Badge
                                    variant="outline"
                                    className="px-3 py-1.5 text-xs tracking-[0.16em] uppercase"
                                >
                                    Proyectos reales
                                </Badge>
                                <h1 className="mt-6 text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl">
                                    Trabajo que se puede ver, tocar y usar
                                </h1>
                                <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                                    Una selección de proyectos de madera,
                                    melamina, muebles, closets, cocinas y
                                    puertas realizados en Guayaquil.
                                </p>
                                <div className="mt-8 flex flex-wrap gap-2">
                                    <Badge
                                        variant="secondary"
                                        className="gap-2"
                                    >
                                        <MapPin className="size-3.5" />
                                        Guayaquil
                                    </Badge>
                                    <Badge variant="secondary">
                                        Muebles a medida
                                    </Badge>
                                    <Badge variant="secondary">
                                        Acabados reales
                                    </Badge>
                                </div>
                            </div>

                            {featuredWork && (
                                <Card className="group overflow-hidden rounded-2xl border-border/70 bg-background p-0 shadow-none">
                                    <div className="relative aspect-[5/4] overflow-hidden bg-muted">
                                        <WorkImage
                                            work={featuredWork}
                                            featured
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 via-primary/35 to-transparent px-6 pt-20 pb-6 text-primary-foreground">
                                            <Badge variant="secondary">
                                                Proyecto destacado
                                            </Badge>
                                            <div className="mt-3 text-2xl font-medium">
                                                {featuredWork.title}
                                            </div>
                                            <div className="mt-1 text-sm text-primary-foreground/80">
                                                {[
                                                    featuredWork.location,
                                                    featuredWork.worked_on,
                                                ]
                                                    .filter(Boolean)
                                                    .join(' · ') ||
                                                    'Guayaquil, Ecuador'}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </section>

                    <section className="bg-background py-20 sm:py-28">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col gap-4 border-b border-border/60 pb-8 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <div className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                                        Portafolio
                                    </div>
                                    <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                                        Proyectos realizados
                                    </h2>
                                </div>
                                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                                    Cada imagen pertenece a un trabajo
                                    publicado. Sin renders inventados: solo
                                    referencias reales para orientar tu
                                    proyecto.
                                </p>
                            </div>

                            {works.data.length > 0 ? (
                                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                    {(remainingWorks.length > 0
                                        ? remainingWorks
                                        : works.data
                                    ).map((work) => (
                                        <Card
                                            key={work.id}
                                            className="group flex h-full flex-col overflow-hidden rounded-2xl border-border/70 bg-card p-0 shadow-none transition-transform duration-200 hover:-translate-y-1"
                                        >
                                            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                                <WorkImage work={work} />
                                                <Badge
                                                    variant="secondary"
                                                    className="absolute top-4 left-4"
                                                >
                                                    {work.location ||
                                                        'Guayaquil'}
                                                </Badge>
                                            </div>
                                            <CardHeader className="gap-3">
                                                <CardTitle className="text-xl font-medium">
                                                    {work.title}
                                                </CardTitle>
                                                {work.description && (
                                                    <CardDescription className="line-clamp-3 text-sm leading-6">
                                                        {work.description}
                                                    </CardDescription>
                                                )}
                                                {(work.worked_on ||
                                                    work.location) && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {[
                                                            work.location,
                                                            work.worked_on,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(' · ')}
                                                    </div>
                                                )}
                                            </CardHeader>
                                            {work.images &&
                                                work.images.length > 1 && (
                                                    <CardContent className="mt-auto pt-0">
                                                        <Separator className="mb-4" />
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {work.images
                                                                .slice(1)
                                                                .map(
                                                                    (
                                                                        url,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={`${url}-${index}`}
                                                                            className="aspect-square overflow-hidden rounded-md bg-muted"
                                                                        >
                                                                            <img
                                                                                src={
                                                                                    url
                                                                                }
                                                                                alt={imageAlt(
                                                                                    work,
                                                                                    index +
                                                                                        1,
                                                                                )}
                                                                                className="h-full w-full object-cover"
                                                                                width="300"
                                                                                height="300"
                                                                                loading="lazy"
                                                                            />
                                                                        </div>
                                                                    ),
                                                                )}
                                                        </div>
                                                    </CardContent>
                                                )}
                                            <CardFooter className="pt-5">
                                                <Button
                                                    asChild
                                                    variant="link"
                                                    className="px-0"
                                                >
                                                    <Link href="/contacto">
                                                        Crear algo parecido
                                                        <ArrowUpRight data-icon="inline-end" />
                                                    </Link>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="mt-10">
                                    <CardHeader>
                                        <CardTitle>
                                            Portafolio en actualización
                                        </CardTitle>
                                        <CardDescription>
                                            Escríbenos para conocer materiales,
                                            tiempos y ejemplos disponibles.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            )}

                            {works.links.length > 0 && (
                                <div className="mt-10 flex flex-wrap gap-2">
                                    {works.links.map((link) => (
                                        <Button
                                            key={link.label}
                                            asChild
                                            variant={
                                                link.active
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            disabled={!link.url}
                                        >
                                            <Link
                                                href={link.url ?? '/trabajos'}
                                            >
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
                    </section>
                </main>
            </div>
        </>
    );
}
