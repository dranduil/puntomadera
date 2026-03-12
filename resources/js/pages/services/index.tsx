import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Service = {
    id: number;
    name: string;
    slug: string;
    summary: string | null;
    description: string | null;
    process_steps: string[] | null;
};

type Props = {
    services: Service[];
};

export default function ServicesIndex({ services }: Props) {
    return (
        <>
            <Head title="Servicios" />

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
                                <Link href="/trabajos">Trabajos</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/contacto">
                                    Contacto
                                    <ChevronRight className="size-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Servicios
                        </h1>
                        <p className="mt-3 text-muted-foreground">
                            Selecciona un servicio para ver el proceso y enviar
                            un mensaje con tus datos por WhatsApp o email.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <Card key={service.id} className="p-6">
                                <div className="text-lg font-semibold">
                                    {service.name}
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {service.summary ??
                                        service.description ??
                                        'Ver detalles del servicio y proceso.'}
                                </p>

                                <div className="mt-5">
                                    <Button asChild className="w-full">
                                        <Link
                                            href={`/servicios/${service.slug}`}
                                        >
                                            Ver proceso y contactar
                                            <ChevronRight className="size-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}
