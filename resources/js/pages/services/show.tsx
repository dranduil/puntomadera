import { Head } from '@inertiajs/react';
import { Mail, MessageCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PublicHeader } from '@/components/public-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type Landing = {
    whatsapp_number: string | null;
    contact_email: string | null;
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
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [details, setDetails] = useState('');

    const envWhatsapp = import.meta.env.VITE_WHATSAPP_NUMBER?.trim();
    const rawWhatsapp = envWhatsapp || landing.whatsapp_number?.trim();
    const whatsappNumber = rawWhatsapp ? rawWhatsapp : '593000000000';

    const emailTo = landing.contact_email?.trim() || '';

    const composedMessage = useMemo(() => {
        const header =
            service.default_message?.trim() ||
            `Hola, estoy interesado en el servicio: ${service.name}.`;

        return [
            header,
            '',
            name ? `Nombre: ${name}` : null,
            phone ? `Teléfono: ${phone}` : null,
            email ? `Email: ${email}` : null,
            location ? `Ubicación: ${location}` : null,
            details ? `Detalles: ${details}` : null,
        ]
            .filter(Boolean)
            .join('\n');
    }, [
        details,
        email,
        location,
        name,
        phone,
        service.default_message,
        service.name,
    ]);

    const whatsappHref = buildWhatsAppHref(whatsappNumber, composedMessage);

    const mailtoHref = emailTo
        ? `mailto:${emailTo}?subject=${encodeURIComponent(
              `Servicio: ${service.name}`,
          )}&body=${encodeURIComponent(composedMessage)}`
        : null;

    return (
        <>
            <Head title={`Servicio - ${service.name}`} />

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                    whatsappHref={whatsappHref}
                />

                <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                        <div>
                            <div className="text-sm text-muted-foreground">
                                Servicios
                            </div>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
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
                                <p className="mt-3 text-muted-foreground">
                                    {service.summary}
                                </p>
                            )}
                            {service.description && (
                                <p className="mt-4 text-sm whitespace-pre-wrap text-muted-foreground">
                                    {service.description}
                                </p>
                            )}

                            {service.process_steps &&
                                service.process_steps.length > 0 && (
                                    <Card className="mt-8 p-6">
                                        <div className="text-sm font-semibold">
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
                                    <Label htmlFor="email">
                                        Email (opcional)
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="email@example.com"
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
                                        className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        placeholder="Medidas, material, fotos, referencias..."
                                    />
                                </div>
                            </div>

                            <div className="mt-6 grid gap-2 sm:grid-cols-2">
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
                                {mailtoHref ? (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <a href={mailtoHref}>
                                            <Mail className="size-4" />
                                            Email
                                        </a>
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
