import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Heart, ShoppingBag } from 'lucide-react';
import { PublicHeader } from '@/components/public-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Landing = {
    whatsapp_number: string | null;
};

type Product = {
    id: number;
    name: string;
    slug: string;
    sku: string | null;
    summary: string | null;
    image_path: string | null;
    price_cents: number;
    currency: string;
    is_featured: boolean;
};

type Props = {
    landing: Landing;
    products: Product[];
};

export default function ShopIndex({ landing, products }: Props) {
    const formatPrice = (product: Product) =>
        product.price_cents > 0
            ? new Intl.NumberFormat('es-EC', {
                  style: 'currency',
                  currency: product.currency || 'USD',
              }).format(product.price_cents / 100)
            : 'Cotización';

    return (
        <>
            <Head title="Productos" />

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                />

                <main>
                    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                        <div className="max-w-2xl">
                            <div className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                                Productos · Guayaquil
                            </div>
                            <h1 className="mt-4 text-4xl leading-tight font-semibold text-balance sm:text-5xl">
                                Madera que transforma tu espacio.
                            </h1>
                            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                                Diseñamos piezas cálidas, funcionales y
                                auténticas para hogares y proyectos. Explora el
                                catálogo y solicita una cotización directa por
                                WhatsApp.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg">
                                    <a href="#productos">
                                        Ver productos
                                        <ChevronRight className="size-4" />
                                    </a>
                                </Button>
                                <Button asChild size="lg" variant="outline">
                                    <a href="/contacto">Diseño a medida</a>
                                </Button>
                            </div>
                        </div>

                        <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-border/80 bg-muted sm:min-h-[420px]">
                            <img
                                src="/images/works/service01.jpg"
                                alt="Interior cálido con trabajo de madera"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-[#3B2C20]/20" />
                            <div className="absolute right-4 bottom-4 left-4 rounded-md border border-white/35 bg-background/85 p-4 backdrop-blur">
                                <div className="text-sm font-medium text-primary">
                                    Diseñado en Guayaquil, hecho para durar.
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="productos"
                        className="border-t border-border/70 bg-[#F2EDE6]/45 py-12 sm:py-16"
                    >
                        <div className="mx-auto max-w-6xl px-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <div className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                                        Catálogo
                                    </div>
                                    <h2 className="mt-3 text-3xl font-medium">
                                        Piezas seleccionadas
                                    </h2>
                                </div>
                                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                                    Acabados naturales, líneas limpias y medidas
                                    que se ajustan al espacio real.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {products.map((product) => (
                                    <Card
                                        key={product.id}
                                        className="group overflow-hidden p-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(59,44,32,0.09)]"
                                    >
                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                                            {product.image_path ? (
                                                <img
                                                    src={product.image_path}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <img
                                                    src="/images/works/service04.jpg"
                                                    alt={product.name}
                                                    className="h-full w-full object-cover opacity-80"
                                                    loading="lazy"
                                                />
                                            )}
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="absolute top-3 right-3 rounded-full bg-background/90"
                                                aria-label={`Guardar ${product.name}`}
                                            >
                                                <Heart className="size-4" />
                                            </Button>
                                            {product.is_featured ? (
                                                <div className="absolute top-3 left-3 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                                                    Más vendido
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="p-5">
                                            <div className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                                                {product.sku ?? 'A medida'}
                                            </div>
                                            <div className="mt-2 text-lg font-medium text-primary">
                                                {product.name}
                                            </div>
                                            <div className="mt-2 text-sm leading-6 text-muted-foreground">
                                                {product.summary ??
                                                    'Producto disponible para cotización personalizada.'}
                                            </div>
                                            <div className="mt-4 flex items-center justify-between gap-3">
                                                <div className="font-medium text-primary">
                                                    {formatPrice(product)}
                                                </div>
                                                <Button asChild size="sm">
                                                    <Link
                                                        href={`/tienda/${product.slug}`}
                                                    >
                                                        <ShoppingBag className="size-4" />
                                                        Cotizar
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
