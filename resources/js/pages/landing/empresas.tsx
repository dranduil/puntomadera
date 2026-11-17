import { Link } from '@inertiajs/react';
import { Building2, Check, ChevronRight, House, Store } from 'lucide-react';
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

type Props = {
    faqs: Faq[];
    whatsapp_number: string;
    seo: Seo;
};

const quoteHref = '/cotizar?tipo=empresa';

const audiences = [
    {
        icon: House,
        title: 'Airbnb y suites',
        text: 'Chapas, closets, cajones y muebles listos entre un huésped y otro, sin que tengas que ir.',
    },
    {
        icon: Building2,
        title: 'Edificios y administradores',
        text: 'Puertas de áreas comunes, departamentos que se entregan y reparaciones pedidas por los propietarios.',
    },
    {
        icon: Store,
        title: 'Oficinas y locales',
        text: 'Muebles de trabajo, archivadores, puertas y divisiones de melamina, con trabajos fuera de horario.',
    },
];

const plans = [
    {
        name: 'Plan esencial',
        cadence: 'Visita trimestral',
        features: [
            'Revisión de puertas, chapas y bisagras',
            'Ajuste de closets y cajones',
            'Reporte con fotos',
        ],
    },
    {
        name: 'Plan frecuente',
        cadence: 'Visita mensual',
        features: [
            'Todo lo del plan esencial',
            'Prioridad para urgencias',
            'Repuestos coordinados por nosotros',
        ],
    },
    {
        name: 'Plan a medida',
        cadence: 'Varias propiedades',
        features: [
            'Cronograma por propiedad',
            'Un solo contacto para todo',
            'Trabajos nuevos con cotización aparte',
        ],
    },
];

const steps = [
    {
        title: 'Cuéntanos tu caso',
        text: 'Tipo de negocio, cuántas propiedades o unidades tienes y en qué zona están.',
    },
    {
        title: 'Visita de diagnóstico',
        text: 'Revisamos el estado de puertas, chapas y muebles y anotamos lo urgente.',
    },
    {
        title: 'Propuesta de plan',
        text: 'Te enviamos por WhatsApp un plan con frecuencia de visitas y precio mensual.',
    },
    {
        title: 'Visitas con reporte',
        text: 'Cada visita termina con fotos de lo que se revisó y se reparó.',
    },
];

export default function Empresas({ faqs, whatsapp_number, seo }: Props) {
    const whatsappHref = buildWhatsAppHref(
        whatsapp_number,
        'Hola, quiero información de un plan de mantenimiento para mi negocio.',
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
                                    Empresas y Airbnb
                                </div>
                                <h1 className="mt-6 max-w-xl text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-5xl">
                                    Mantenimiento de carpintería para tus
                                    propiedades
                                </h1>
                                <p className="mt-6 max-w-lg text-base leading-7 text-pretty text-muted-foreground sm:text-lg">
                                    Puertas, chapas, closets y muebles al día en
                                    tus suites, edificios u oficinas de
                                    Guayaquil. Un plan con visitas fijas y
                                    prioridad cuando algo se daña.
                                </p>
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <Button asChild size="lg">
                                        <Link href={quoteHref}>
                                            Pedir propuesta
                                            <ChevronRight data-icon="inline-end" />
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <a href="#planes">Ver planes</a>
                                    </Button>
                                </div>
                            </div>
                            <img
                                src="/images/works/punto-madera/punto-madera-01.jpg"
                                alt="Puerta de madera instalada por Punto Madera"
                                className="h-72 w-full object-cover sm:h-96 lg:h-full"
                                width={1200}
                                height={900}
                            />
                        </div>
                    </section>

                    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Para quién"
                            title="Negocios que no pueden esperar al carpintero"
                        />
                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            {audiences.map((audience) => (
                                <div
                                    key={audience.title}
                                    className="rounded-lg border bg-card p-5"
                                >
                                    <audience.icon
                                        className="size-6 text-primary"
                                        aria-hidden="true"
                                    />
                                    <h3 className="mt-3 font-semibold">
                                        {audience.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {audience.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section
                        id="planes"
                        className="scroll-mt-28 border-y border-border/60 bg-muted/40"
                    >
                        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                            <SectionHeading
                                eyebrow="Planes"
                                title="Elige la frecuencia que necesitas"
                            >
                                El precio depende del número de propiedades y de
                                la frecuencia de visitas. Te lo enviamos en la
                                propuesta.
                            </SectionHeading>
                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                {plans.map((plan) => (
                                    <article
                                        key={plan.name}
                                        className="flex flex-col rounded-lg border bg-card p-6"
                                    >
                                        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                                            {plan.cadence}
                                        </p>
                                        <h3 className="mt-2 text-lg font-semibold">
                                            {plan.name}
                                        </h3>
                                        <ul className="mt-5 grid flex-1 content-start gap-2 text-sm">
                                            {plan.features.map((feature) => (
                                                <li
                                                    key={feature}
                                                    className="flex gap-2"
                                                >
                                                    <Check
                                                        className="mt-0.5 size-4 shrink-0 text-primary"
                                                        aria-hidden="true"
                                                    />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="mt-6 w-full"
                                        >
                                            <Link href={quoteHref}>
                                                Pedir propuesta
                                                <ChevronRight data-icon="inline-end" />
                                            </Link>
                                        </Button>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Cómo funciona"
                            title="Un plan claro desde la primera visita"
                        />
                        <Steps steps={steps} />
                    </section>

                    <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Preguntas frecuentes"
                            title="Lo que nos preguntan las empresas"
                        />
                        <FaqList faqs={faqs} />
                    </section>

                    <QuoteCta
                        title="¿Cuántas propiedades manejas?"
                        text="Cuéntanos tu caso y te enviamos una propuesta de plan por WhatsApp."
                        quoteHref={quoteHref}
                        whatsappHref={whatsappHref}
                    />
                </main>

                <PublicFooter />
            </div>
        </>
    );
}
