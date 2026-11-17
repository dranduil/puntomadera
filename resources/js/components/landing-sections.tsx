import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, MessageCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { buildWhatsAppHref } from '@/lib/whatsapp';

export type Faq = { q: string; a: string };

export function SectionHeading({
    eyebrow,
    title,
    children,
}: {
    eyebrow: string;
    title: string;
    children?: ReactNode;
}) {
    return (
        <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
                {eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                {title}
            </h2>
            {children && (
                <p className="mt-3 text-muted-foreground">{children}</p>
            )}
        </div>
    );
}

export function Steps({ steps }: { steps: { title: string; text: string }[] }) {
    return (
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
                <li key={step.title} className="rounded-lg border bg-card p-5">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {index + 1}
                    </span>
                    <h3 className="mt-4 font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {step.text}
                    </p>
                </li>
            ))}
        </ol>
    );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
    return (
        <div className="mt-8 divide-y rounded-lg border bg-card">
            {faqs.map((faq) => (
                <details key={faq.q} className="group p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                        {faq.q}
                        <ChevronDown
                            className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                            aria-hidden="true"
                        />
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground">
                        {faq.a}
                    </p>
                </details>
            ))}
        </div>
    );
}

/** Closing band: the quote form first, WhatsApp as the second option. */
/** The page's closing next step: the quote form first, WhatsApp second. */
export function QuoteCta({
    title,
    text,
    quoteHref = '/cotizar',
    whatsappHref,
}: {
    title: string;
    text: string;
    quoteHref?: string;
    whatsappHref?: string;
}) {
    const { site } = usePage().props;
    const chatHref =
        whatsappHref ??
        buildWhatsAppHref(
            site.whatsappNumber,
            'Hola, quiero cotizar con Punto Madera.',
        );

    return (
        <section className="bg-primary text-primary-foreground">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                <div className="max-w-xl">
                    {/* Headings are brown site-wide (app.css); this band is brown. */}
                    <h2 className="text-2xl font-semibold tracking-tight text-balance text-primary-foreground">
                        {title}
                    </h2>
                    <p className="mt-2 text-primary-foreground/80">{text}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg" variant="secondary">
                        <Link href={quoteHref}>
                            Pedir cotización
                            <ChevronRight data-icon="inline-end" />
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    >
                        <a
                            href={chatHref}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <MessageCircle data-icon="inline-start" />
                            WhatsApp
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}
