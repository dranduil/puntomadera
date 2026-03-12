import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Briefcase,
    FolderGit2,
    Images,
    LayoutGrid,
    Mail,
    Shield,
    Wrench,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as adminBookings } from '@/routes/admin/bookings';
import { index as adminContacts } from '@/routes/admin/contacts';
import { edit as adminHome } from '@/routes/admin/home';
import { index as adminServices } from '@/routes/admin/services';
import { index as adminWorks } from '@/routes/admin/works';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const user = usePage().props.auth.user;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(user?.is_admin
            ? [
                  {
                      title: 'Admin - Home',
                      href: adminHome(),
                      icon: Shield,
                  },
                  {
                      title: 'Admin - Bookings',
                      href: adminBookings(),
                      icon: Wrench,
                  },
                  {
                      title: 'Admin - Contacts',
                      href: adminContacts(),
                      icon: Mail,
                  },
                  {
                      title: 'Admin - Services',
                      href: adminServices(),
                      icon: Briefcase,
                  },
                  {
                      title: 'Admin - Works',
                      href: adminWorks(),
                      icon: Images,
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
