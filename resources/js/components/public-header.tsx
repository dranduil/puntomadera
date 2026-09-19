import { Link } from '@inertiajs/react';
import { ArrowUpRight, Menu } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
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

const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Trabajos', href: '/trabajos' },
    { label: 'Opiniones', href: '/resenas' },
    { label: 'Contacto', href: '/contacto' },
];

const moreItems = [
    { label: 'Instalación de puertas', href: '/instalacion-puertas-guayaquil' },
    { label: 'Reparación de puertas', href: '/reparacion-puertas-guayaquil' },
    { label: 'Carpintería a medida', href: '/carpinteria-a-medida-guayaquil' },
];

export function PublicHeader({ landing, whatsappHref }: Props) {
    const appName = import.meta.env.VITE_APP_NAME || 'punto madera';
    const envWhatsapp =
        import.meta.env.VITE_WHATSAPP_NUMBER?.trim() ?? '593998897813';
    const rawWhatsapp = envWhatsapp || landing?.whatsapp_number?.trim();
    const whatsappNumber = rawWhatsapp || '593998897813';
    const defaultWhatsappHref =
        whatsappHref ??
        buildWhatsAppHref(
            whatsappNumber,
            'Hola, quiero cotizar con punto-madera.',
        );

    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
            <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="flex shrink-0 items-center gap-3 text-primary"
                    aria-label="punto madera"
                >
                    <AppLogoIcon
                        className="size-11 text-primary"
                        aria-hidden="true"
                    />
                    <span className="hidden leading-none sm:block">
                        <span className="block text-sm font-light tracking-[0.38em] lowercase">
                            {appName.replace('-', ' ')}
                        </span>
                        <span className="mt-1 block text-[0.58rem] tracking-[0.32em] text-muted-foreground uppercase">
                            Guayaquil, Ecuador
                        </span>
                    </span>
                </Link>

                <nav
                    aria-label="Navegación principal"
                    className="hidden items-center gap-7 text-sm font-medium lg:flex"
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-muted-foreground transition-colors hover:text-primary"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label="Abrir menú"
                                >
                                    <Menu aria-hidden="true" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <SheetTitle className="sr-only">
                                    Navegación
                                </SheetTitle>
                                <SheetHeader className="text-left">
                                    <div className="flex items-center gap-3">
                                        <AppLogoIcon
                                            className="size-9 text-primary"
                                            aria-hidden="true"
                                        />
                                        <div>
                                            <div className="font-light tracking-[0.32em] text-primary lowercase">
                                                {appName.replace('-', ' ')}
                                            </div>
                                            <div className="mt-1 text-xs tracking-[0.22em] text-muted-foreground uppercase">
                                                Guayaquil, Ecuador
                                            </div>
                                        </div>
                                    </div>
                                </SheetHeader>
                                <nav
                                    aria-label="Navegación móvil"
                                    className="mt-8 grid gap-1"
                                >
                                    {navItems.map((item) => (
                                        <Button
                                            key={item.href}
                                            asChild
                                            variant="ghost"
                                            className="justify-start text-base"
                                        >
                                            <Link href={item.href}>
                                                {item.label}
                                            </Link>
                                        </Button>
                                    ))}
                                    <div className="my-3 border-t border-border/60 pt-3">
                                        <div className="px-4 pb-2 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                                            Más páginas
                                        </div>
                                        {moreItems.map((item) => (
                                            <Button
                                                key={item.href}
                                                asChild
                                                variant="ghost"
                                                className="justify-start text-sm text-muted-foreground"
                                            >
                                                <a href={item.href}>
                                                    {item.label}
                                                </a>
                                            </Button>
                                        ))}
                                    </div>
                                    <Button asChild className="mt-4">
                                        <a
                                            href={defaultWhatsappHref}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Cotizar por WhatsApp
                                            <ArrowUpRight data-icon="inline-end" />
                                        </a>
                                    </Button>
                                </nav>
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
                            <ArrowUpRight data-icon="inline-end" />
                        </a>
                    </Button>
                </div>
            </div>
        </header>
    );
}
