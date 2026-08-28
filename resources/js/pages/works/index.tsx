import { Head, Link } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Landing = {
    whatsapp_number: string | null;
};

type Work = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    worked_on: string | null;
    location: string | null;
    images: string[] | null;
    image_alts: string[] | null;
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
    landing: Landing;
    works: Paginator<Work>;
};

function imageAlt(work: Work, index: number): string {
    return (
        work.image_alts?.[index] ??
        `${work.title}${work.location ? ` en ${work.location}` : ''}`
    );
}

export default function WorksIndex({ landing, works }: Props) {
    return (
        <>
            <Head title="Trabajos" />

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                />

                <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                    <div className="max-w-3xl">
                        <div className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                            Proyectos
                        </div>
                        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                            Trabajos recientes
                        </h1>
                        <p className="mt-4 text-base leading-7 text-muted-foreground">
                            Galería de trabajos reales con madera, melamina,
                            closets, cocinas, puertas y reparaciones.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {works.data.map((work) => {
                            const cover = work.images?.[0] ?? null;

                            return (
                                <Card
                                    key={work.id}
                                    className="group overflow-hidden p-0 transition-all duration-200 hover:-translate-y-0.5"
                                >
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                                        {cover ? (
                                            <img
                                                src={cover}
                                                alt={imageAlt(work, 0)}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                                                Sin imagen
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="font-medium text-primary">
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
                                                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                                    {work.images.map(
                                                        (url, index) => (
                                                            <div
                                                                key={`${url}-${index}`}
                                                                className="aspect-square overflow-hidden rounded-md bg-muted"
                                                            >
                                                                <img
                                                                    src={url}
                                                                    alt={imageAlt(
                                                                        work,
                                                                        index,
                                                                    )}
                                                                    className="h-full w-full object-cover"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                        ),
                                                    )}
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
