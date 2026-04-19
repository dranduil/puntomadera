import { Link } from '@inertiajs/react';
import { ChevronDown, Hammer, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

type Landing = {
    whatsapp_number: string | null;
};

type Props = {
    landing?: Landing;
    isHome?: boolean;
    whatsappHref?: string;
};

function buildWhatsAppHref(number: string, message: string) {
    const sanitized = number.replace(/[^0-9]/g, '');
    return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}

export function PublicHeader({ landing, isHome = false, whatsappHref }: Props) {
    const appName = import.meta.env.VITE_APP_NAME || 'punto-madera';
    const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);

    const envWhatsapp = import.meta.env.VITE_WHATSAPP_NUMBER?.trim();
    const rawWhatsapp = envWhatsapp || landing?.whatsapp_number?.trim();
    const whatsappNumber = rawWhatsapp ? rawWhatsapp : '593000000000';
    const defaultWhatsappHref =
        whatsappHref ??
        buildWhatsAppHref(
            whatsappNumber,
            'Hola, quiero cotizar con punto-madera.',
        );

    const shopItems = [
        { label: 'Tienda', href: '/tienda' },
    ];

    const exploreItems = [
        { label: 'Servicios', href: '/servicios' },
        { label: 'Trabajos', href: '/trabajos' },
        { label: 'Agendar', href: sectionHref('booking') },
        { label: 'Proceso', href: sectionHref('proceso') },
        { label: 'FAQ', href: sectionHref('faq') },
        { label: 'Contacto', href: '/contacto' },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold tracking-tight"
                >
                    <span className="inline-flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <Hammer className="size-4" />
                    </span>
                    <span>{appName}</span>
                </Link>

                <nav className="hidden items-center gap-6 text-sm md:flex">
                    <Link
                        href="/"
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Inicio
                    </Link>
                    <details className="group relative">
                        <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-muted-foreground hover:text-foreground">
                            Comprar
                            <ChevronDown className="size-4" />
                        </summary>
                        <div className="absolute top-full left-0 z-50 mt-2 min-w-44 rounded-md border border-border/60 bg-background p-2 shadow-sm">
                            {shopItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block rounded-sm px-2 py-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </details>
                    <details className="group relative">
                        <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-muted-foreground hover:text-foreground">
                            Navegar
                            <ChevronDown className="size-4" />
                        </summary>
                        <div className="absolute top-full left-0 z-50 mt-2 min-w-52 rounded-md border border-border/60 bg-background p-2 shadow-sm">
                            {exploreItems.map((item) =>
                                item.href.startsWith('/') ? (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block rounded-sm px-2 py-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className="block rounded-sm px-2 py-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                    >
                                        {item.label}
                                    </a>
                                ),
                            )}
                        </div>
                    </details>
                </nav>

                <div className="flex items-center gap-2">
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <SheetTitle className="sr-only">
                                    Navigation
                                </SheetTitle>
                                <SheetHeader className="text-left">
                                    <div className="font-semibold">{appName}</div>
                                </SheetHeader>
                                <div className="mt-6 grid gap-2 text-sm">
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="justify-start"
                                    >
                                        <Link href="/">Inicio</Link>
                                    </Button>
                                    <details className="rounded-md border border-border/60 p-2">
                                        <summary className="cursor-pointer list-none text-sm font-medium">
                                            Comprar
                                        </summary>
                                        <div className="mt-2 grid gap-1">
                                            {shopItems.map((item) => (
                                                <Button
                                                    key={item.href}
                                                    asChild
                                                    variant="ghost"
                                                    className="justify-start"
                                                >
                                                    <Link href={item.href}>
                                                        {item.label}
                                                    </Link>
                                                </Button>
                                            ))}
                                        </div>
                                    </details>
                                    <details className="rounded-md border border-border/60 p-2">
                                        <summary className="cursor-pointer list-none text-sm font-medium">
                                            Navegar
                                        </summary>
                                        <div className="mt-2 grid gap-1">
                                            {exploreItems.map((item) =>
                                                item.href.startsWith('/') ? (
                                                    <Button
                                                        key={item.href}
                                                        asChild
                                                        variant="ghost"
                                                        className="justify-start"
                                                    >
                                                        <Link href={item.href}>
                                                            {item.label}
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        key={item.href}
                                                        asChild
                                                        variant="ghost"
                                                        className="justify-start"
                                                    >
                                                        <a href={item.href}>
                                                            {item.label}
                                                        </a>
                                                    </Button>
                                                ),
                                            )}
                                        </div>
                                    </details>

                                    <div className="mt-4 grid gap-2">
                                        <Button asChild>
                                            <a
                                                href={defaultWhatsappHref}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                WhatsApp
                                            </a>
                                        </Button>
                                        <Button asChild variant="outline">
                                            <Link href="/contacto">
                                                Contacto
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Button asChild className="hidden sm:inline-flex">
                        <a
                            href={defaultWhatsappHref}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Cotizar por WhatsApp
                        </a>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/contacto">Contacto</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
