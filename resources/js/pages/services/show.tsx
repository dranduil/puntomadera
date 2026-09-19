import { Head } from '@inertiajs/react';
import {
    ArrowUpRight,
    CheckCircle2,
    MapPin,
    MessageCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

type Landing = {
    whatsapp_number: string | null;
    contact_phone: string | null;
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

type Props = {
    landing: Landing;
    service: Service;
};

function buildWhatsAppHref(number: string, message: string) {
    const sanitized = number.replace(/[^0-9]/g, '');
    return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}

export default function ServiceShow({ landing, service }: Props) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [details, setDetails] = useState('');

    const envWhatsapp =
        import.meta.env.VITE_WHATSAPP_NUMBER?.trim() ?? '593998897813';
    const rawWhatsapp = envWhatsapp || landing.whatsapp_number?.trim();
    const whatsappNumber = rawWhatsapp || '593998897813';
    const siteUrl = import.meta.env.VITE_APP_URL || 'https://punto-madera.com';
    const siteOrigin = siteUrl.replace(/\/$/, '');
    const canonicalUrl = `${siteOrigin}/servicios/${service.slug}`;
    const seoTitle = `${service.name} | Punto Madera Guayaquil`;
    const seoDescription =
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
        areaServed: { '@type': 'City', name: 'Guayaquil' },
        provider: {
            '@type': 'HomeAndConstructionBusiness',
            name: 'Punto Madera',
            url: siteOrigin,
        },
        url: canonicalUrl,
    };

    const composedMessage = useMemo(() => {
        const header =
            service.default_message?.trim() ||
            `Hola, estoy interesado en el servicio: ${service.name}.`;

        return [
            header,
            '',
            name ? `Nombre: ${name}` : null,
            phone ? `Teléfono: ${phone}` : null,
            location ? `Ubicación: ${location}` : null,
            details ? `Detalles: ${details}` : null,
        ]
            .filter(Boolean)
            .join('\n');
    }, [details, location, name, phone, service.default_message, service.name]);

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
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                    whatsappHref={whatsappHref}
                />

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
                                <div className="mt-8 flex flex-wrap gap-2">
                                    <Badge variant="secondary">A medida</Badge>
                                    <Badge variant="secondary">
                                        Comunicación directa
                                    </Badge>
                                    <Badge variant="secondary">
                                        Instalación local
                                    </Badge>
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
                                    <Badge variant="outline" className="w-fit">
                                        Cotización guiada
                                    </Badge>
                                    <CardTitle className="mt-3 text-2xl font-medium">
                                        Cuéntanos qué necesitas
                                    </CardTitle>
                                    <CardDescription className="leading-6">
                                        Completa lo esencial. El botón prepara
                                        un mensaje listo para enviar por
                                        WhatsApp.
                                    </CardDescription>
                                </CardHeader>
                                <Separator />
                                <CardContent className="grid gap-4 pt-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nombre</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(event) =>
                                                setName(event.target.value)
                                            }
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">
                                            Teléfono / WhatsApp
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={phone}
                                            onChange={(event) =>
                                                setPhone(event.target.value)
                                            }
                                            placeholder="+593 ..."
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="location">
                                            Ubicación
                                        </Label>
                                        <Input
                                            id="location"
                                            value={location}
                                            onChange={(event) =>
                                                setLocation(event.target.value)
                                            }
                                            placeholder="Guayaquil / Samborondón / Daule"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="details">
                                            Detalles del proyecto
                                        </Label>
                                        <Textarea
                                            id="details"
                                            value={details}
                                            onChange={(event) =>
                                                setDetails(event.target.value)
                                            }
                                            placeholder="Medidas, material, fotos, referencias..."
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col items-stretch gap-4">
                                    <Button asChild size="lg">
                                        <a
                                            href={whatsappHref}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <MessageCircle data-icon="inline-start" />
                                            Continuar por WhatsApp
                                            <ArrowUpRight data-icon="inline-end" />
                                        </a>
                                    </Button>
                                    <div className="rounded-lg border border-border/70 bg-background p-4 text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
                                        {composedMessage}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <CheckCircle2 className="size-3.5 text-primary" />
                                        Sin formularios largos ni compromiso.
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
