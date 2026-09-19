import { Head } from '@inertiajs/react';
import {
    ArrowUpRight,
    CheckCircle2,
    MapPin,
    MessageCircle,
    Phone,
} from 'lucide-react';
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

type Props = {
    landing: Landing;
};

function buildWhatsAppHref(number: string, message: string) {
    const sanitized = number.replace(/[^0-9]/g, '');
    return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}

const contactPoints = [
    'Foto del espacio o del mueble',
    'Medidas aproximadas, si las tienes',
    'Ubicación y tipo de material preferido',
];

export default function ContactPage({ landing }: Props) {
    const envWhatsapp =
        import.meta.env.VITE_WHATSAPP_NUMBER?.trim() ?? '593998897813';
    const rawWhatsapp = envWhatsapp || landing.whatsapp_number?.trim();
    const whatsappNumber = (rawWhatsapp || '593998897813').replace(/\D/g, '');
    const displayWhatsapp =
        whatsappNumber.length === 12
            ? `+${whatsappNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')}`
            : `+${whatsappNumber}`;
    const whatsappHref = buildWhatsAppHref(
        whatsappNumber,
        'Hola, quiero cotizar un proyecto de carpintería en Guayaquil.',
    );
    const siteUrl = import.meta.env.VITE_APP_URL || 'https://punto-madera.com';
    const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/contacto`;
    const seoTitle = 'Cotizar carpintería en Guayaquil | Punto Madera';
    const seoDescription =
        'Cotiza muebles a medida, closets, puertas y reparaciones de carpintería en Guayaquil. Envíanos fotos y medidas por WhatsApp.';

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
                    content="summary"
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
                                    Guayaquil, Ecuador
                                </Badge>
                                <h1 className="mt-6 text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl">
                                    Hablemos de tu próximo espacio
                                </h1>
                                <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                                    Envíanos una idea, una foto o una medida. Te
                                    ayudamos a definir el alcance, los
                                    materiales y el siguiente paso sin
                                    formularios largos.
                                </p>
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <Button asChild size="lg">
                                        <a
                                            href={whatsappHref}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <MessageCircle data-icon="inline-start" />
                                            Escribir por WhatsApp
                                            <ArrowUpRight data-icon="inline-end" />
                                        </a>
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Respuesta directa desde Guayaquil
                                    </span>
                                </div>
                            </div>

                            <Card className="overflow-hidden rounded-2xl border-border/70 bg-background p-0 shadow-none">
                                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                    <img
                                        src="/images/editorial/materials-process.jpg"
                                        alt="Muestras de madera, cinta métrica y plano de un mueble a medida"
                                        className="h-full w-full object-cover"
                                        width="1448"
                                        height="1086"
                                        fetchPriority="high"
                                    />
                                    <div className="absolute right-4 bottom-4 left-4 rounded-lg border border-white/40 bg-background/90 p-4 backdrop-blur">
                                        <div className="text-sm font-semibold">
                                            Una conversación bien planteada
                                        </div>
                                        <div className="mt-1 text-xs leading-5 text-muted-foreground">
                                            Mientras más contexto recibimos,
                                            mejor podemos orientarte.
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>

                    <section className="bg-background py-20 sm:py-28">
                        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
                            <Card className="h-fit rounded-2xl border-border/70 bg-card shadow-none">
                                <CardHeader>
                                    <Badge
                                        variant="secondary"
                                        className="w-fit"
                                    >
                                        Contacto directo
                                    </Badge>
                                    <CardTitle className="mt-3 text-2xl font-medium">
                                        Tu cotización empieza aquí
                                    </CardTitle>
                                    <CardDescription className="leading-6">
                                        Mándanos lo que tengas. Si faltan
                                        medidas, lo resolvemos juntos.
                                    </CardDescription>
                                </CardHeader>
                                <Separator />
                                <CardContent className="grid gap-4 pt-6">
                                    <div className="flex items-start gap-3">
                                        <MessageCircle className="mt-0.5 size-4 text-primary" />
                                        <div>
                                            <div className="text-sm font-medium">
                                                WhatsApp
                                            </div>
                                            <div className="mt-1 text-sm text-muted-foreground">
                                                {displayWhatsapp}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 size-4 text-primary" />
                                        <div>
                                            <div className="text-sm font-medium">
                                                Zona de atención
                                            </div>
                                            <div className="mt-1 text-sm text-muted-foreground">
                                                Guayaquil y alrededores
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <a
                                            href={whatsappHref}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Abrir WhatsApp{' '}
                                            <ArrowUpRight data-icon="inline-end" />
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>

                            <div>
                                <div className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                                    Qué enviar
                                </div>
                                <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                                    Información simple. Decisiones mejores.
                                </h2>
                                <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                                    No necesitas tener todo definido. Una
                                    referencia y la ubicación bastan para
                                    iniciar la conversación y recomendarte una
                                    solución realista.
                                </p>
                                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                    {contactPoints.map((point, index) => (
                                        <div
                                            key={point}
                                            className="border-t border-border/70 pt-4"
                                        >
                                            <div className="text-sm font-semibold">
                                                0{index + 1}
                                            </div>
                                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                {point}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                                    <span className="inline-flex items-center gap-2">
                                        <CheckCircle2 className="size-4 text-primary" />
                                        Cotización clara
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                        <Phone className="size-4 text-primary" />
                                        Atención directa
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
