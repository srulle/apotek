import { Link } from '@inertiajs/react';
import {
    FileText,
    LayoutGrid,
    ArrowRightLeft,
    Database,
    Pill,
    Tags,
    Users,
    Package,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
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
import {
    dashboard,
    laporan,
    transaksi,
    obat,
    kategoriObat,
    satuan,
    supplier,
    stok,
} from '@/routes';
import { penjualan, pembelian } from '@/routes/transaksi';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Transaksi',
        icon: ArrowRightLeft,
        items: [
            {
                title: 'Penjualan',
                href: penjualan(),
            },
            {
                title: 'Pembelian',
                href: pembelian(),
            },
        ],
    },
    {
        title: 'Stok',
        href: stok(),
        icon: Package,
    },
    {
        title: 'Master Data',
        icon: Database,
        items: [
            {
                title: 'Obat',
                href: obat(),
            },
            {
                title: 'Supplier',
                href: supplier(),
            },
            {
                title: 'Kategori Obat',
                href: kategoriObat(),
            },
            {
                title: 'Satuan',
                href: satuan(),
            },
        ],
    },
    // {
    //     title: 'Laporan',
    //     href: laporan(),
    //     icon: FileText,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard().url} prefetch>
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
