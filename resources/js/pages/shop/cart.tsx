import { Head, Link } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PublicHeader } from '@/components/public-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Landing = {
    whatsapp_number: string | null;
};

type Props = {
    landing: Landing;
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

export default function ShopCart({ landing }: Props) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setItems(parseCart(window.localStorage.getItem('pm_cart_v1')));
    }, []);

    const persist = (nextItems: CartItem[]) => {
        setItems(nextItems);
        if (typeof window === 'undefined') return;
        window.localStorage.setItem('pm_cart_v1', JSON.stringify(nextItems));
    };

    const totalCents = useMemo(
        () => items.reduce((sum, item) => sum + item.price_cents * item.qty, 0),
        [items],
    );

    const currency = items[0]?.currency || 'USD';

    const envWhatsapp = import.meta.env.VITE_WHATSAPP_NUMBER?.trim();
    const whatsappNumber = sanitizeWhatsapp(
        envWhatsapp || landing.whatsapp_number || '593000000000',
    );

    const whatsappHref = useMemo(() => {
        const lines = [
            'Hola, quiero confirmar compra:',
            ...items.map(
                (item) =>
                    `- ${item.name} x${item.qty} = ${formatMoney(item.price_cents * item.qty, item.currency)}`,
            ),
            '',
            `Total: ${formatMoney(totalCents, currency)}`,
        ];
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
    }, [items, totalCents, currency, whatsappNumber]);

    return (
        <>
            <Head title="Carrito" />

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                />

                <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                    <div className="flex items-end justify-between">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Carrito
                        </h1>
                        <Button asChild variant="outline">
                            <Link href="/tienda">Seguir comprando</Link>
                        </Button>
                    </div>

                    {items.length === 0 ? (
                        <Card className="mt-8 p-8 text-center">
                            <p className="text-muted-foreground">
                                Carrito vacío.
                            </p>
                            <Button asChild className="mt-4">
                                <Link href="/tienda">Ir a tienda</Link>
                            </Button>
                        </Card>
                    ) : (
                        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
                            <div className="grid gap-3">
                                {items.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <div className="font-semibold">
                                                {item.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {formatMoney(
                                                    item.price_cents,
                                                    item.currency,
                                                )}{' '}
                                                c/u
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.qty}
                                                onChange={(e) => {
                                                    const qty = Math.max(
                                                        1,
                                                        Number(
                                                            e.target.value || 1,
                                                        ),
                                                    );
                                                    persist(
                                                        items.map((current) =>
                                                            current.id === item.id
                                                                ? {
                                                                      ...current,
                                                                      qty,
                                                                  }
                                                                : current,
                                                        ),
                                                    );
                                                }}
                                                className="h-9 w-20 rounded-md border border-input bg-background px-3 text-sm"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    persist(
                                                        items.filter(
                                                            (current) =>
                                                                current.id !==
                                                                item.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <Card className="h-fit p-5">
                                <div className="text-sm text-muted-foreground">
                                    Resumen
                                </div>
                                <div className="mt-2 text-2xl font-semibold">
                                    {formatMoney(totalCents, currency)}
                                </div>
                                <div className="mt-4 grid gap-2">
                                    <Button asChild>
                                        <a
                                            href={whatsappHref}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Finalizar por WhatsApp
                                        </a>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => persist([])}
                                    >
                                        Vaciar carrito
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
