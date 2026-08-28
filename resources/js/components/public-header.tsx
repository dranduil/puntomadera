import { Link } from '@inertiajs/react';
import { ChevronDown, Menu } from 'lucide-react';
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

type ExploreItem = {
    label: string;
    href: string;
    inertia: boolean;
};

function buildWhatsAppHref(number: string, message: string) {
    const sanitized = number.replace(/[^0-9]/g, '');
    return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}

export function PublicHeader({ landing, isHome = false, whatsappHref }: Props) {
    const appName = import.meta.env.VITE_APP_NAME || 'punto madera';
    const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);

    const envWhatsapp =
        import.meta.env.VITE_WHATSAPP_NUMBER?.trim() ?? '593998897813';
    const rawWhatsapp = envWhatsapp || landing?.whatsapp_number?.trim();
    const whatsappNumber = rawWhatsapp ? rawWhatsapp : '593998897813';
    const defaultWhatsappHref =
        whatsappHref ??
        buildWhatsAppHref(
            whatsappNumber,
            'Hola, quiero cotizar con punto-madera.',
        );

    const exploreItems: ExploreItem[] = [
        { label: 'Servicios', href: '/servicios', inertia: true },
        {
            label: 'Instalación de puertas',
            href: '/instalacion-puertas-guayaquil',
            inertia: false,
        },
        {
            label: 'Reparación de puertas',
            href: '/reparacion-puertas-guayaquil',
            inertia: false,
        },
        {
            label: 'Carpintería a medida',
            href: '/carpinteria-a-medida-guayaquil',
            inertia: false,
        },
        { label: 'Trabajos', href: '/trabajos', inertia: true },
        { label: 'Agendar', href: sectionHref('booking'), inertia: false },
        { label: 'Proceso', href: sectionHref('proceso'), inertia: false },
        { label: 'FAQ', href: sectionHref('faq'), inertia: false },
        { label: 'Contacto', href: '/contacto', inertia: true },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
                <Link
                    href="/"
                    className="flex items-center gap-3 text-primary"
                    aria-label="punto madera"
                >
                    <span className="relative inline-flex size-11 items-center justify-center rounded-full border border-[#8B6F4E]/45 bg-[#F2EDE6] text-[0.68rem] font-semibold tracking-[0.16em]">
                        PM
                        <span className="absolute inset-2 rounded-full border border-[#CDBAA2]/70" />
                    </span>
                    <span className="hidden leading-none sm:block">
                        <span className="block text-sm font-light tracking-[0.38em] lowercase">
                            {appName.replace('-', ' ')}
                        </span>
                        <span className="mt-1 block text-[0.58rem] tracking-[0.32em] text-muted-foreground uppercase">
                            Guayaquil · Ecuador
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
                    <Link
                        href="/"
                        className="text-muted-foreground transition-colors hover:text-primary"
                    >
                        Inicio
                    </Link>
                    <details className="group relative">
                        <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-muted-foreground transition-colors hover:text-primary">
                            Navegar
                            <ChevronDown className="size-4" />
                        </summary>
                        <div className="absolute top-full left-0 z-50 mt-3 min-w-52 rounded-md border border-border/80 bg-background p-2 shadow-lg">
                            {exploreItems.map((item) =>
                                item.inertia ? (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block rounded-sm px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-primary"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className="block rounded-sm px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-primary"
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
                                    <div>
                                        <div className="font-light tracking-[0.32em] text-primary lowercase">
                                            {appName.replace('-', ' ')}
                                        </div>
                                        <div className="mt-1 text-xs tracking-[0.22em] text-muted-foreground uppercase">
                                            Guayaquil · Ecuador
                                        </div>
                                    </div>
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
                                            Navegar
                                        </summary>
                                        <div className="mt-2 grid gap-1">
                                            {exploreItems.map((item) =>
                                                item.inertia ? (
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
                    <Button
                        asChild
                        variant="outline"
                        className="hidden sm:inline-flex"
                    >
                        <Link href="/contacto">Contacto</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
