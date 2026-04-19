import { Head, Link } from '@inertiajs/react';
import { Check, ShoppingCart } from 'lucide-react';
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
    process_steps: string[] | null;
    price_cents: number;
    currency: string;
    stock_qty: number;
    image_path: string | null;
};

type Props = {
    landing: Landing;
    product: Product;
};

type CartItem = {
    id: number;
    slug: string;
    name: string;
    price_cents: number;
    currency: string;
    qty: number;
    image_path: string | null;
};

function formatMoney(cents: number, currency = 'USD') {
    return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency,
    }).format(cents / 100);
}

function parseCart(raw: string | null): CartItem[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw) as CartItem[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function sanitizeWhatsapp(number: string) {
    return number.replace(/[^0-9]/g, '');
}

export default function ShopShow({ landing, product }: Props) {
    const [qty, setQty] = useState(1);
    const maxQty = Math.max(1, product.stock_qty);

    const envWhatsapp = import.meta.env.VITE_WHATSAPP_NUMBER?.trim();
    const whatsappNumber = sanitizeWhatsapp(
        envWhatsapp || landing.whatsapp_number || '593000000000',
    );

    const whatsappHref = useMemo(() => {
        const message = [
            'Hola, quiero comprar este producto:',
            `Producto: ${product.name}`,
            product.sku ? `SKU: ${product.sku}` : null,
            `Cantidad: ${qty}`,
            `Precio unitario: ${formatMoney(product.price_cents, product.currency)}`,
            `Total: ${formatMoney(product.price_cents * qty, product.currency)}`,
        ]
            .filter(Boolean)
            .join('\n');
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    }, [product, qty, whatsappNumber]);

    const addToCart = () => {
        if (typeof window === 'undefined') return;
        const current = parseCart(window.localStorage.getItem('pm_cart_v1'));
        const index = current.findIndex((item) => item.id === product.id);

        if (index >= 0) {
            const nextQty = Math.min(maxQty, current[index].qty + qty);
            current[index] = { ...current[index], qty: nextQty };
        } else {
            current.push({
                id: product.id,
                slug: product.slug,
                name: product.name,
                price_cents: product.price_cents,
                currency: product.currency,
                qty: Math.min(maxQty, qty),
                image_path: product.image_path,
            });
        }

        window.localStorage.setItem('pm_cart_v1', JSON.stringify(current));
    };

    return (
        <>
            <Head title={`Tienda - ${product.name}`} />

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                />

                <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                    <div className="grid gap-8 lg:grid-cols-2">
                        <Card className="overflow-hidden p-0">
                            <div className="h-80 bg-muted/30 sm:h-96">
                                {product.image_path ? (
                                    <img
                                        src={product.image_path}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : null}
                            </div>
                        </Card>

                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight">
                                {product.name}
                            </h1>
                            {product.summary ? (
                                <p className="mt-3 text-muted-foreground">
                                    {product.summary}
                                </p>
                            ) : null}
                            {product.description ? (
                                <p className="mt-4 text-sm whitespace-pre-wrap text-muted-foreground">
                                    {product.description}
                                </p>
                            ) : null}

                            <div className="mt-6 rounded-md border border-border/60 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-semibold">
                                        {formatMoney(
                                            product.price_cents,
                                            product.currency,
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Stock: {product.stock_qty}
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                    <label htmlFor="qty" className="text-sm">
                                        Cantidad
                                    </label>
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
                                        className="h-9 w-24 rounded-md border border-input bg-background px-3 text-sm"
                                    />
                                </div>
                                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                                    <Button onClick={addToCart}>
                                        <ShoppingCart className="size-4" />
                                        Agregar al carrito
                                    </Button>
                                    <Button asChild variant="outline">
                                        <a
                                            href={whatsappHref}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Comprar por WhatsApp
                                        </a>
                                    </Button>
                                </div>
                                <Button asChild variant="ghost" className="mt-2 w-full">
                                    <Link href="/tienda/carrito">Ir al carrito</Link>
                                </Button>
                            </div>

                            {product.process_steps && product.process_steps.length > 0 ? (
                                <div className="mt-6 grid gap-2">
                                    {product.process_steps.map((step) => (
                                        <div key={step} className="flex items-start gap-2 text-sm">
                                            <Check className="mt-0.5 size-4 text-primary" />
                                            <span className="text-muted-foreground">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
