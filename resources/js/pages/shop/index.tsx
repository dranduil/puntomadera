import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
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
    is_featured: boolean;
};

type Props = {
    landing: Landing;
    products: Product[];
};

export default function ShopIndex({ landing, products }: Props) {
    return (
        <>
            <Head title="Tienda" />

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                />

                <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Tienda
                        </h1>
                        <p className="mt-3 text-muted-foreground">
                            Próximamente. Catálogo de productos para solicitud
                            de cotización por WhatsApp.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <Card key={product.id} className="overflow-hidden p-0">
                                <div className="relative h-44 w-full bg-muted/30">
                                    {product.image_path ? (
                                        <img
                                            src={product.image_path}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : null}
                                </div>
                                <div className="p-5">
                                    <div className="text-lg font-semibold">
                                        {product.name}
                                    </div>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        SKU: {product.sku ?? product.slug}
                                    </div>
                                    <div className="mt-3 text-sm text-muted-foreground">
                                        {product.summary ?? 'Producto disponible'}
                                    </div>
                                    <div className="mt-4 inline-flex rounded-full border border-border/60 px-2 py-1 text-xs text-muted-foreground">
                                        Próximamente
                                    </div>
                                    <Button asChild className="mt-4 w-full">
                                        <Link href={`/tienda/${product.slug}`}>
                                            Solicitar cotización
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
