import { Head } from '@inertiajs/react';
import { MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { PublicHeader } from '@/components/public-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Landing = {
    whatsapp_number: string | null;
    contact_phone: string | null;
};

type Props = {
    landing: Landing;
};

function buildWhatsAppHref(number: string, message: string) {
    const sanitized = number.replace(/[^0-9]/g, '');
    return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}

export default function ContactPage({ landing }: Props) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    const envWhatsapp = import.meta.env.VITE_WHATSAPP_NUMBER?.trim() ?? '593998897813';
    const rawWhatsapp = envWhatsapp || landing.whatsapp_number?.trim();
    const whatsappNumber = rawWhatsapp ? rawWhatsapp : '593998897813';
    const displayWhatsapp = envWhatsapp || landing.whatsapp_number;

    const composedMessage = [
        'Hola, necesito una cotización de carpintería en Guayaquil.',
        '',
        name ? `Nombre: ${name}` : null,
        phone ? `Teléfono: ${phone}` : null,
        message ? `Mensaje: ${message}` : null,
    ]
        .filter(Boolean)
        .join('\n');

    const whatsappHref = buildWhatsAppHref(whatsappNumber, composedMessage);

    return (
        <>
            <Head title="Contacto" />

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                    whatsappHref={whatsappHref}
                />

                <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                        <div>
                            <div className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                                Guayaquil · Ecuador
                            </div>
                            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                                Contacto
                            </h1>
                            <p className="mt-4 text-base leading-7 text-muted-foreground">
                                Cuéntanos qué espacio quieres transformar y
                                preparamos un mensaje claro para coordinar todo
                                por WhatsApp.
                            </p>

                            <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
                                {landing.contact_phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="size-4" />
                                        <span>{landing.contact_phone}</span>
                                    </div>
                                )}
                                {displayWhatsapp && (
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="size-4" />
                                        <span>{displayWhatsapp}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Card className="p-6 sm:p-8">
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
                                    <Label htmlFor="message">Mensaje</Label>
                                    <textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        className="min-h-32 w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
                                        placeholder="Cuéntanos qué necesitas, medidas, fotos o referencias..."
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
                                        Abrir WhatsApp
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
