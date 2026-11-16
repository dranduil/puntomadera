import { Link } from '@inertiajs/react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { useEffect } from 'react';
import { PublicHeader } from '@/components/public-header';
import { SeoHead } from '@/components/seo-head';
import type { Seo } from '@/components/seo-head';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackLead } from '@/lib/tracking';

type Props = {
    reference: string;
    name: string;
    summary: string[];
    whatsappHref: string;
    trackLead: boolean;
    seo: Seo;
};

export default function QuoteRequestSent({
    reference,
    name,
    summary,
    whatsappHref,
    trackLead: shouldTrack,
    seo,
}: Props) {
    useEffect(() => {
        if (shouldTrack) {
            trackLead('cotizar');
        }
    }, [shouldTrack]);

    return (
        <>
            <SeoHead seo={seo} />

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader />

                <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
                    <CheckCircle2
                        className="size-10 text-primary"
                        aria-hidden="true"
                    />
                    <h1 className="mt-4 text-3xl font-medium tracking-tight text-balance">
                        ¡Listo, {name}! Recibimos tu solicitud
                    </h1>
                    <p className="mt-3 leading-7 text-muted-foreground">
                        Tu número de solicitud es{' '}
                        <Badge variant="secondary" className="align-middle">
                            {reference}
                        </Badge>
                        . Envíanos el resumen por WhatsApp para que te
                        respondamos más rápido. Ahí mismo puedes mandar fotos o
                        medidas.
                    </p>

                    <Button
                        asChild
                        size="lg"
                        className="mt-8 h-14 w-full text-base sm:w-auto"
                    >
                        <a href={whatsappHref} target="_blank" rel="noreferrer">
                            <MessageCircle aria-hidden="true" />
                            Enviar por WhatsApp
                        </a>
                    </Button>

                    {summary.length > 0 && (
                        <Card className="mt-10 shadow-none">
                            <CardContent className="p-5">
                                <div className="text-sm font-medium">
                                    Lo que nos pediste
                                </div>
                                <ul className="mt-3 grid gap-1.5 text-sm leading-6 text-muted-foreground">
                                    {summary.map((line) => (
                                        <li key={line}>{line}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    <p className="mt-8 text-sm leading-6 text-muted-foreground">
                        Revisamos cada pedido y te enviamos la cotización con el
                        detalle de mano de obra, materiales y movilización. Si
                        hace falta, coordinamos una visita para tomar medidas.
                    </p>

                    <Button asChild variant="ghost" className="mt-4 px-0">
                        <Link href="/">Volver al inicio</Link>
                    </Button>
                </main>
            </div>
        </>
    );
}
