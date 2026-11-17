import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type SiteLink = { label: string; href: string };

export type FooterGroup = {
    title: string;
    links: SiteLink[];
};

/** Shared `site` prop from App\Support\SiteLinks::shared(). */
export type SiteInfo = {
    header: SiteLink[];
    footer: FooterGroup[];
    whatsappNumber: string;
    contactPhone: string | null;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
};
