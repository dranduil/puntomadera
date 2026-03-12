import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Mail, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Landing = {
    whatsapp_number: string | null;
    contact_email: string | null;
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
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const rawWhatsapp = landing.whatsapp_number?.trim();
    const whatsappNumber = rawWhatsapp ? rawWhatsapp : '593000000000';

    const emailTo = landing.contact_email?.trim() || '';

    const composedMessage = [
        'Hola, necesito una cotización de carpintería en Guayaquil.',
        '',
        name ? `Nombre: ${name}` : null,
        phone ? `Teléfono: ${phone}` : null,
        email ? `Email: ${email}` : null,
        message ? `Mensaje: ${message}` : null,
    ]
        .filter(Boolean)
        .join('\n');

    const whatsappHref = buildWhatsAppHref(whatsappNumber, composedMessage);

    const mailtoHref = emailTo
        ? `mailto:${emailTo}?subject=${encodeURIComponent(
              'Consulta de carpintería',
          )}&body=${encodeURIComponent(composedMessage)}`
        : null;

    return (
        <>
            <Head title="Contacto" />

            <div className="min-h-screen bg-background text-foreground">
                <header className="border-b border-border/60">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-semibold tracking-tight"
                        >
                            <span>Carpintería</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Button asChild variant="outline">
                                <a href={whatsappHref} target="_blank" rel="noreferrer">
                                    WhatsApp
                                    <ChevronRight className="size-4" />
                                </a>
                            </Button>
                            {mailtoHref && (
                                <Button asChild>
                                    <a href={mailtoHref}>
                                        Email
                                        <ChevronRight className="size-4" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight">
                                Contacto
                            </h1>
                            <p className="mt-3 text-muted-foreground">
                                Elige cómo contactarnos: WhatsApp o email. Escribe
                                tus datos y se creará un mensaje por defecto.
                            </p>

                            <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
                                {landing.contact_phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="size-4" />
                                        <span>{landing.contact_phone}</span>
                                    </div>
                                )}
                                {landing.contact_email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="size-4" />
                                        <span>{landing.contact_email}</span>
                                    </div>
                                )}
                                {landing.whatsapp_number && (
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="size-4" />
                                        <span>{landing.whatsapp_number}</span>
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
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Tu nombre"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+593 ..."
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email (opcional)</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="message">Mensaje</Label>
                                    <textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        placeholder="Cuéntanos qué necesitas, medidas, fotos o referencias..."
                                    />
                                </div>
                            </div>

                            <div className="mt-6 grid gap-2 sm:grid-cols-2">
                                <Button asChild className="w-full">
                                    <a href={whatsappHref} target="_blank" rel="noreferrer">
                                        Abrir WhatsApp
                                    </a>
                                </Button>
                                {mailtoHref ? (
                                    <Button asChild variant="outline" className="w-full">
                                        <a href={mailtoHref}>Enviar Email</a>
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        disabled
                                    >
                                        Email no configurado
                                    </Button>
                                )}
                            </div>

                            <div className="mt-6 rounded-md border border-border/60 bg-muted/20 p-3 text-sm whitespace-pre-wrap">
                                {composedMessage}
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </>
    );
}
