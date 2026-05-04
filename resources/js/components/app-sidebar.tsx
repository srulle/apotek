import { Link, usePage } from '@inertiajs/react';
import { ArrowRightLeft, Database, Package, Users } from 'lucide-react';
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
    laporan,
    transaksi,
    obat,
    kategoriObat,
    satuan,
    supplier,
    stok,
    pengguna,
} from '@/routes';
import { penjualan, pembelian } from '@/routes/transaksi';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    // {
    //     title: 'Dashboard',
    //     href: dashboard(),
    //     icon: LayoutGrid,
    // },
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
];

const adminNavItems: NavItem[] = [
    {
        title: 'Pengguna',
        href: pengguna(),
        icon: Users,
    },
    // {
    //     title: 'Laporan',
    //     href: laporan(),
    //     icon: FileText,
    // },
];

export function AppSidebar() {
    const { props } = usePage();
    const isSuperAdmin = props.auth?.user?.is_super_admin;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={penjualan().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {isSuperAdmin && (
                    <NavMain items={adminNavItems} groupLabel="Superadmin" />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
