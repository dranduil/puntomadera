import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Work = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    worked_on: string | null;
    location: string | null;
    images: string[] | null;
};

type Paginator<T> = {
    data: T[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

type Props = {
    works: Paginator<Work>;
};

export default function WorksIndex({ works }: Props) {
    return (
        <>
            <Head title="Trabajos" />

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
                                <Link href="/#servicios">Servicios</Link>
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
                            Trabajos recientes
                        </h1>
                        <p className="mt-3 text-muted-foreground">
                            Galería de trabajos reales: muebles a medida,
                            closets, cocinas, puertas y reparaciones.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {works.data.map((work) => {
                            const cover = work.images?.[0] ?? null;

                            return (
                                <Card key={work.id} className="overflow-hidden">
                                    <div className="relative aspect-[4/3] w-full bg-muted">
                                        {cover ? (
                                            <img
                                                src={cover}
                                                alt={work.title}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                                                Sin imagen
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="font-semibold">
                                            {work.title}
                                        </div>
                                        {(work.location || work.worked_on) && (
                                            <div className="mt-1 text-sm text-muted-foreground">
                                                {[work.location, work.worked_on]
                                                    .filter(Boolean)
                                                    .join(' · ')}
                                            </div>
                                        )}
                                        {work.description && (
                                            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                                                {work.description}
                                            </p>
                                        )}
                                        {work.images &&
                                            work.images.length > 1 && (
                                                <div className="mt-4 grid grid-cols-4 gap-2">
                                                    {work.images
                                                        .slice(0, 4)
                                                        .map((url) => (
                                                            <div
                                                                key={url}
                                                                className="aspect-square overflow-hidden rounded-md bg-muted"
                                                            >
                                                                <img
                                                                    src={url}
                                                                    alt={
                                                                        work.title
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {works.links.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-2">
                            {works.links.map((link) => (
                                <Button
                                    key={link.label}
                                    asChild
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    disabled={!link.url}
                                >
                                    <Link href={link.url ?? '/trabajos'}>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
