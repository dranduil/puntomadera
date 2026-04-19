import { Head } from '@inertiajs/react';
import { Check } from 'lucide-react';
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
                                <div className="text-sm font-medium">
                                    Próximamente
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Producto en etapa de lanzamiento. Solicita
                                    cotización y disponibilidad por WhatsApp.
                                </p>
                                <div className="mt-3 text-sm text-muted-foreground">
                                    Stock referencial: {product.stock_qty}
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
                                    'Producto separado de servicios de carpintería.',
                                    'Solicitud por WhatsApp para confirmar detalles.',
                                    'Precio final confirmado al responder.',
                                ].map((line) => (
                                    <div key={line} className="flex items-start gap-2 text-sm">
                                        <Check className="mt-0.5 size-4 text-primary" />
                                        <span className="text-muted-foreground">{line}</span>
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
