import { Link } from '@inertiajs/react';
import { Check, ChevronRight, MapPin, Ruler } from 'lucide-react';
import {
    FaqList,
    QuoteCta,
    SectionHeading,
    Steps,
} from '@/components/landing-sections';
import type { Faq } from '@/components/landing-sections';
import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { SeoHead } from '@/components/seo-head';
import type { Seo } from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import { buildWhatsAppHref } from '@/lib/whatsapp';

type Package = {
    key: string;
    name: string;
    description: string;
    highlights: string[];
    item_ids: number[];
};

type Props = {
    packages: Package[];
    faqs: Faq[];
    whatsapp_number: string;
    seo: Seo;
};

const steps = [
    {
        title: 'Elige tu paquete',
        text: 'Marca lo que necesitas y, si tienes, sube fotos o el plano de tu casa.',
    },
    {
        title: 'Visita de medidas',
        text: 'Vamos a tu casa, medimos cada espacio y te mostramos materiales y colores.',
    },
    {
        title: 'Recibe tu cotización',
        text: 'Te llega un link por WhatsApp. La aceptas y pagas el anticipo con Deuna o transferencia.',
    },
    {
        title: 'Fabricamos e instalamos',
        text: 'Un solo cronograma para closets, cocina y puertas, sin coordinar varios maestros.',
    },
];

const sectors = [
    {
        name: 'La Aurora, Daule y Samborondón',
        text: 'Casas nuevas en urbanizaciones que se entregan sin closets ni muebles de cocina.',
    },
    {
        name: 'Vía a la Costa',
        text: 'Proyectos completos para casas en etapas nuevas, con una sola visita de medidas.',
    },
    {
        name: 'Durán y Guayaquil',
        text: 'Departamentos y casas del norte, centro y sur de la ciudad, también remodelaciones.',
    },
];

export default function CasaNueva({
    packages,
    faqs,
    whatsapp_number,
    seo,
}: Props) {
    const whatsappHref = buildWhatsAppHref(
        whatsapp_number,
        'Hola, me entregaron mi casa nueva y quiero cotizar closets y cocina.',
    );

    return (
        <>
            <SeoHead seo={seo} />

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader whatsappHref={whatsappHref} />

                <main>
                    <section className="border-b border-border/60 bg-card">
                        <div className="mx-auto grid max-w-7xl items-stretch lg:grid-cols-[1fr_1fr]">
                            <div className="flex flex-col justify-center px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
                                <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                                    <span className="h-px w-8 bg-primary" />
                                    Casa nueva en Guayaquil
                                </div>
                                <h1 className="mt-6 max-w-xl text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-5xl">
                                    Closets, cocina y puertas para tu casa nueva
                                </h1>
                                <p className="mt-6 max-w-lg text-base leading-7 text-pretty text-muted-foreground sm:text-lg">
                                    Te entregaron las llaves y faltan los
                                    muebles. Hacemos todo en un solo proyecto:
                                    una visita de medidas, una cotización y un
                                    cronograma de entrega.
                                </p>
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <Button asChild size="lg">
                                        <Link href="/cotizar?tipo=casa_nueva">
                                            Cotizar mi casa
                                            <ChevronRight data-icon="inline-end" />
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <a href="#paquetes">Ver paquetes</a>
                                    </Button>
                                </div>
                            </div>
                            <img
                                src="/images/works/punto-madera/punto-madera-10.jpg"
                                alt="Cocina de melamina instalada por Punto Madera"
                                className="h-72 w-full object-cover sm:h-96 lg:h-full"
                                width={1200}
                                height={900}
                            />
                        </div>
                    </section>

                    <section
                        id="paquetes"
                        className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8"
                    >
                        <SectionHeading
                            eyebrow="Paquetes"
                            title="Elige por dónde empezar"
                        >
                            Cada casa tiene medidas distintas, por eso no
                            publicamos precios fijos. Elige un paquete y te
                            enviamos la cotización exacta por WhatsApp.
                        </SectionHeading>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            {packages.map((pack) => (
                                <article
                                    key={pack.key}
                                    className="flex flex-col rounded-lg border bg-card p-6"
                                >
                                    <h3 className="text-lg font-semibold">
                                        {pack.name}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {pack.description}
                                    </p>
                                    <ul className="mt-5 grid flex-1 content-start gap-2 text-sm">
                                        {pack.highlights.map((highlight) => (
                                            <li
                                                key={highlight}
                                                className="flex gap-2"
                                            >
                                                <Check
                                                    className="mt-0.5 size-4 shrink-0 text-primary"
                                                    aria-hidden="true"
                                                />
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button asChild className="mt-6 w-full">
                                        <Link
                                            href={`/cotizar?paquete=${pack.key}`}
                                        >
                                            Cotizar este paquete
                                            <ChevronRight data-icon="inline-end" />
                                        </Link>
                                    </Button>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="border-y border-border/60 bg-muted/40">
                        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                            <SectionHeading
                                eyebrow="Cómo funciona"
                                title="De las llaves a los muebles instalados"
                            />
                            <Steps steps={steps} />
                        </div>
                    </section>

                    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Dónde trabajamos"
                            title="Urbanizaciones nuevas de Guayaquil y alrededores"
                        >
                            La movilización depende de la zona y siempre va
                            detallada en la cotización.
                        </SectionHeading>
                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            {sectors.map((sector) => (
                                <div
                                    key={sector.name}
                                    className="rounded-lg border bg-card p-5"
                                >
                                    <MapPin
                                        className="size-5 text-primary"
                                        aria-hidden="true"
                                    />
                                    <h3 className="mt-3 font-semibold">
                                        {sector.name}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {sector.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
                            <Ruler
                                className="mt-0.5 size-4 shrink-0"
                                aria-hidden="true"
                            />
                            ¿Aún no te entregan la casa? Envía el plano y
                            preparamos una cotización inicial.
                        </p>
                    </section>

                    <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Preguntas frecuentes"
                            title="Antes de cotizar"
                        />
                        <FaqList faqs={faqs} />
                    </section>

                    <QuoteCta
                        title="Cuéntanos cómo es tu casa nueva"
                        text="Responde unas preguntas en dos minutos y recibe tu cotización por WhatsApp."
                        quoteHref="/cotizar?tipo=casa_nueva"
                        whatsappHref={whatsappHref}
                    />
                </main>

                <PublicFooter />
            </div>
        </>
    );
}
