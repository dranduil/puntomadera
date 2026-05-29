import { Head } from '@inertiajs/react';
import { Check, Minus, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
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
    description: string | null;
    stock_qty: number;
    image_path: string | null;
    price_cents: number;
    currency: string;
};

type Props = {
    landing: Landing;
    product: Product;
};

function sanitizeWhatsapp(number: string) {
    return number.replace(/[^0-9]/g, '');
}

export default function ShopShow({ landing, product }: Props) {
    const [qty, setQty] = useState(1);
    const maxQty = Math.max(1, product.stock_qty);
    const price =
        product.price_cents > 0
            ? new Intl.NumberFormat('es-EC', {
                  style: 'currency',
                  currency: product.currency || 'USD',
              }).format(product.price_cents / 100)
            : 'Cotización personalizada';

    const envWhatsapp = import.meta.env.VITE_WHATSAPP_NUMBER?.trim();
    const whatsappNumber = sanitizeWhatsapp(
        envWhatsapp || landing.whatsapp_number || '593000000000',
    );

    const whatsappHref = useMemo(() => {
        const message = [
            'Hola, quiero cotizar este producto:',
            `Producto: ${product.name}`,
            product.sku ? `SKU: ${product.sku}` : null,
            `Cantidad: ${qty}`,
        ]
            .filter(Boolean)
            .join('\n');
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    }, [product, qty, whatsappNumber]);

    return (
        <>
            <Head title={`Tienda - ${product.name}`} />

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                />

                <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
                    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                        <Card className="overflow-hidden p-0">
                            <div className="aspect-[4/3] bg-muted">
                                {product.image_path ? (
                                    <img
                                        src={product.image_path}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src="/images/works/service04.jpg"
                                        alt={product.name}
                                        className="h-full w-full object-cover opacity-80"
                                    />
                                )}
                            </div>
                        </Card>

                        <div>
                            <div className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                                Producto · {product.sku ?? product.slug}
                            </div>
                            <h1 className="mt-3 text-4xl leading-tight font-semibold text-balance">
                                {product.name}
                            </h1>
                            <div className="mt-4 text-2xl font-medium text-primary">
                                {price}
                            </div>
                            {product.summary ? (
                                <p className="mt-4 text-base leading-7 text-muted-foreground">
                                    {product.summary}
                                </p>
                            ) : null}
                            {product.description ? (
                                <p className="mt-5 text-sm leading-7 whitespace-pre-wrap text-muted-foreground">
                                    {product.description}
                                </p>
                            ) : null}

                            <div className="mt-8 rounded-lg border border-border/80 bg-card p-5 shadow-[0_10px_30px_rgba(59,44,32,0.05)]">
                                <div className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                                    A medida
                                </div>
                                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                                    Solicita cotización y disponibilidad por
                                    WhatsApp. Confirmamos medidas, acabado,
                                    material y tiempo de entrega antes de
                                    fabricar.
                                </p>
                                <div className="mt-3 text-sm text-muted-foreground">
                                    Stock referencial: {product.stock_qty}
                                </div>
                                <div className="mt-5 flex items-center gap-3">
                                    <label
                                        htmlFor="qty"
                                        className="text-sm font-medium"
                                    >
                                        Cantidad
                                    </label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        aria-label="Reducir cantidad"
                                        onClick={() =>
                                            setQty((value) =>
                                                Math.max(1, value - 1),
                                            )
                                        }
                                    >
                                        <Minus className="size-4" />
                                    </Button>
                                    <input
                                        id="qty"
                                        type="number"
                                        min={1}
                                        max={maxQty}
                                        value={qty}
                                        onChange={(e) =>
                                            setQty(
                                                Math.max(
                                                    1,
                                                    Math.min(
                                                        maxQty,
                                                        Number(
                                                            e.target.value || 1,
                                                        ),
                                                    ),
                                                ),
                                            )
                                        }
                                        className="h-10 w-20 rounded-md border border-input bg-card px-3 text-center text-sm outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/30"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        aria-label="Aumentar cantidad"
                                        onClick={() =>
                                            setQty((value) =>
                                                Math.min(maxQty, value + 1),
                                            )
                                        }
                                    >
                                        <Plus className="size-4" />
                                    </Button>
                                </div>
                                <Button asChild className="mt-5 w-full">
                                    <a
                                        href={whatsappHref}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Solicitar por WhatsApp
                                    </a>
                                </Button>
                            </div>

                            <div className="mt-6 grid gap-2">
                                {[
                                    'Diseño cálido y funcional para espacios reales.',
                                    'Materiales y acabados definidos antes de producir.',
                                    'Precio final confirmado con medidas y detalles.',
                                ].map((line) => (
                                    <div
                                        key={line}
                                        className="flex items-start gap-3 text-sm"
                                    >
                                        <Check className="mt-0.5 size-4 text-primary" />
                                        <span className="text-muted-foreground">
                                            {line}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
