import { Head } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PublicHeader } from '@/components/public-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

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

    const envWhatsapp = import.meta.env.VITE_WHATSAPP_NUMBER?.trim() ?? '593998897813';
    const rawWhatsapp = envWhatsapp || landing.whatsapp_number?.trim();
    const whatsappNumber = rawWhatsapp ? rawWhatsapp : '593998897813';
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
                <meta head-key="description" name="description" content={seoDescription} />
                <meta head-key="robots" name="robots" content="index,follow,max-image-preview:large" />
                <link head-key="canonical" rel="canonical" href={canonicalUrl} />
                <meta head-key="og:title" property="og:title" content={seoTitle} />
                <meta head-key="og:description" property="og:description" content={seoDescription} />
                <meta head-key="og:url" property="og:url" content={canonicalUrl} />
                <meta head-key="og:type" property="og:type" content="website" />
                <meta head-key="og:locale" property="og:locale" content="es_EC" />
                <meta head-key="og:site_name" property="og:site_name" content="Punto Madera" />
                {imageUrl && (
                    <>
                        <meta head-key="og:image" property="og:image" content={imageUrl} />
                        <meta
                            head-key="og:image:alt"
                            property="og:image:alt"
                            content={`${service.name} en Guayaquil`}
                        />
                    </>
                )}
                <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
                <meta head-key="twitter:title" name="twitter:title" content={seoTitle} />
                <meta head-key="twitter:description" name="twitter:description" content={seoDescription} />
                {imageUrl && (
                    <meta head-key="twitter:image" name="twitter:image" content={imageUrl} />
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

                <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                        <div>
                            <div className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                                Servicios
                            </div>
                            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                                {service.name}
                            </h1>
                            {service.image_path && (
                                <Card className="mt-5 overflow-hidden p-0">
                                    <div className="h-64 w-full bg-muted/30 sm:h-80">
                                        <img
                                            src={service.image_path}
                                            alt={service.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </Card>
                            )}
                            {service.summary && (
                                <p className="mt-4 text-base leading-7 text-muted-foreground">
                                    {service.summary}
                                </p>
                            )}
                            {service.description && (
                                <p className="mt-5 text-sm leading-7 whitespace-pre-wrap text-muted-foreground">
                                    {service.description}
                                </p>
                            )}

                            {service.process_steps &&
                                service.process_steps.length > 0 && (
                                    <Card className="mt-8 p-6">
                                        <div className="text-sm font-medium text-primary">
                                            Proceso
                                        </div>
                                        <Separator className="my-4" />
                                        <div className="grid gap-3 text-sm text-muted-foreground">
                                            {service.process_steps.map(
                                                (step) => (
                                                    <div
                                                        key={step}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <div className="mt-0.5 size-2 rounded-full bg-primary" />
                                                        <div>{step}</div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </Card>
                                )}
                        </div>

                        <Card className="p-6 sm:p-8">
                            <div className="text-sm font-semibold">
                                Tus datos para armar el mensaje
                            </div>
                            <Separator className="my-5" />

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
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
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        placeholder="+593 ..."
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">Ubicación</Label>
                                    <Input
                                        id="location"
                                        value={location}
                                        onChange={(e) =>
                                            setLocation(e.target.value)
                                        }
                                        placeholder="Guayaquil / Samborondón / Daule"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="details">Detalles</Label>
                                    <textarea
                                        id="details"
                                        value={details}
                                        onChange={(e) =>
                                            setDetails(e.target.value)
                                        }
                                        className="min-h-32 w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
                                        placeholder="Medidas, material, fotos, referencias..."
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button asChild className="w-full">
                                    <a
                                        href={whatsappHref}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <MessageCircle className="size-4" />
                                        WhatsApp
                                    </a>
                                </Button>
                            </div>

                            <div className="mt-6 rounded-md border border-border/70 bg-secondary/45 p-3 text-sm whitespace-pre-wrap">
                                {composedMessage}
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </>
    );
}
