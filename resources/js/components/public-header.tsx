import { Link } from '@inertiajs/react';
import { Hammer, Menu } from 'lucide-react';
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
            'Hola, quiero comprar en punto-madera.',
        );

    const navItems = [
        { label: 'Tienda', href: '/tienda', type: 'page' as const },
        { label: 'Carrito', href: '/tienda/carrito', type: 'page' as const },
        { label: 'Servicios', href: '/servicios', type: 'page' as const },
        { label: 'Trabajos', href: '/trabajos', type: 'page' as const },
        { label: 'Agendar', href: sectionHref('booking') },
        { label: 'Proceso', href: sectionHref('proceso') },
        { label: 'FAQ', href: sectionHref('faq') },
        { label: 'Contacto', href: '/contacto', type: 'page' as const },
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
                    {navItems.map((item) =>
                        item.type === 'page' ? (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <a
                                key={item.href}
                                href={item.href}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                {item.label}
                            </a>
                        ),
                    )}
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
                                    {navItems.map((item) =>
                                        item.type === 'page' ? (
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
                            Comprar por WhatsApp
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
