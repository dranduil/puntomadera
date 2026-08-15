import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { PublicHeader } from '@/components/public-header';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Landing = {
    whatsapp_number: string | null;
};

type Service = {
    id: number;
    name: string;
    slug: string;
    summary: string | null;
    description: string | null;
    process_steps: string[] | null;
    image_path: string | null;
};

type Props = {
    landing: Landing;
    services: Service[];
};

export default function ServicesIndex({ landing, services }: Props) {
    return (
        <>
            <Head title="Servicios" />

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                />

                <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                    <div className="max-w-3xl">
                        <div className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                            Carpintería a medida
                        </div>
                        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                            Servicios
                        </h1>
                        <p className="mt-4 text-base leading-7 text-muted-foreground">
                            Soluciones cálidas y funcionales para muebles,
                            cocinas, closets, puertas y detalles interiores.
                        </p>
                    </div>

                    {services.length > 0 ? (
                        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => (
                                <Card
                                    key={service.id}
                                    className="group overflow-hidden p-0 transition-all duration-200 hover:-translate-y-0.5"
                                >
                                    <div className="h-48 w-full overflow-hidden bg-muted">
                                        {service.image_path ? (
                                            <img
                                                src={service.image_path}
                                                alt={service.name}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="p-6">
                                        <div className="text-lg font-medium text-primary">
                                            {service.name}
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            {service.summary ??
                                                service.description ??
                                                'Ver detalles del servicio y proceso.'}
                                        </p>

                                        <Button asChild className="mt-5 w-full">
                                            <Link
                                                href={`/servicios/${service.slug}`}
                                            >
                                                Ver proceso
                                                <ChevronRight className="size-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="mt-10 max-w-2xl">
                            <CardHeader>
                                <CardTitle>
                                    Estamos preparando este catálogo
                                </CardTitle>
                                <CardDescription className="leading-6">
                                    Cuéntanos qué necesitas y te orientamos
                                    sobre muebles, puertas, closets y
                                    reparaciones para tu espacio.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex-wrap gap-3">
                                <Button asChild>
                                    <Link href="/contacto">
                                        Solicitar cotización
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/">Volver al inicio</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </main>
            </div>
        </>
    );
}
