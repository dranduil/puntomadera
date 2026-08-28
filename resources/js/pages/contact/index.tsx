import { Head } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';
import { PublicHeader } from '@/components/public-header';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

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

export default function ContactPage({ landing }: Props) {
    const envWhatsapp =
        import.meta.env.VITE_WHATSAPP_NUMBER?.trim() ?? '593998897813';
    const rawWhatsapp = envWhatsapp || landing.whatsapp_number?.trim();
    const whatsappNumber = (rawWhatsapp || '593998897813').replace(/\D/g, '');
    const displayWhatsapp =
        whatsappNumber.length === 12
            ? `+${whatsappNumber.replace(
                  /(\d{3})(\d{3})(\d{3})(\d{3})/,
                  '$1 $2 $3 $4',
              )}`
            : `+${whatsappNumber}`;
    const whatsappHref = buildWhatsAppHref(
        whatsappNumber,
        'Hola, quiero cotizar un proyecto de carpintería en Guayaquil.',
    );

    return (
        <>
            <Head title="Cotizar por WhatsApp" />

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                    whatsappHref={whatsappHref}
                />

                <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                    <Card className="mx-auto max-w-3xl text-center">
                        <CardHeader className="items-center p-8 sm:p-12 sm:pb-8">
                            <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                                <MessageCircle className="size-7" />
                            </div>
                            <div className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                                Guayaquil · Ecuador
                            </div>
                            <CardTitle className="text-4xl tracking-tight sm:text-5xl">
                                Hablemos por WhatsApp
                            </CardTitle>
                            <CardDescription className="max-w-2xl text-base leading-7 sm:text-lg">
                                Cuéntanos qué espacio quieres transformar y te
                                ayudamos a definir tu proyecto a medida.
                                Envíanos fotos, medidas o una referencia
                                directamente por WhatsApp.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex flex-col items-center gap-5 px-8 sm:px-12">
                            <Button asChild size="lg">
                                <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <MessageCircle data-icon="inline-start" />
                                    Escribir por WhatsApp
                                </a>
                            </Button>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MessageCircle className="size-4" />
                                <span>{displayWhatsapp}</span>
                            </div>
                        </CardContent>

                        <CardFooter className="justify-center p-8 pt-1 sm:p-12 sm:pt-3">
                            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                                Sin formularios ni catálogo: revisamos tu idea,
                                medidas y acabados para preparar una cotización
                                clara.
                            </p>
                        </CardFooter>
                    </Card>
                </main>
            </div>
        </>
    );
}
