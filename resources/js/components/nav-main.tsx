import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({
    items = [],
    groupLabel = 'Platform',
}: {
    items: NavItem[];
    groupLabel?: string;
}) {
    const { isCurrentUrl } = useCurrentUrl();
    const { state, isMobile, setOpenMobile } = useSidebar();
    const isCollapsed = state === 'collapsed';
    const [openMenus, setOpenMenus] = React.useState<string[]>(() =>
        items
            .filter((item) => item.items && item.items.length > 0)
            .map((item) => item.title),
    );

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title],
        );
    };

    const closeSidebarOnMobile = () => {
        if (isMobile) {
            setTimeout(() => setOpenMobile(false), 0);
        }
    };

    const hasActiveChild = (item: NavItem): boolean => {
        if (item.href && isCurrentUrl(item.href)) {
            return true;
        }

        if (item.items) {
            return item.items.some((child) => hasActiveChild(child));
        }

        return false;
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {item.items && item.items.length > 0 ? (
                            isCollapsed ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={{ children: item.title }}
                                            isActive={hasActiveChild(item)}
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        side="right"
                                        align="start"
                                    >
                                        {item.items.map((subItem) => (
                                            <DropdownMenuItem
                                                key={subItem.title}
                                                asChild
                                                onClick={closeSidebarOnMobile}
                                            >
                                                <Link
                                                    href={subItem.href}
                                                    prefetch
                                                    onClick={
                                                        closeSidebarOnMobile
                                                    }
                                                >
                                                    {subItem.icon && (
                                                        <subItem.icon />
                                                    )}
                                                    <span>{subItem.title}</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Collapsible
                                    open={
                                        openMenus.includes(item.title) ||
                                        hasActiveChild(item)
                                    }
                                    onOpenChange={() => toggleMenu(item.title)}
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={{ children: item.title }}
                                            isActive={hasActiveChild(item)}
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isCurrentUrl(
                                                            subItem.href,
                                                        )}
                                                        onClick={
                                                            closeSidebarOnMobile
                                                        }
                                                    >
                                                        <Link
                                                            href={subItem.href}
                                                            prefetch
                                                        >
                                                            {subItem.icon && (
                                                                <subItem.icon />
                                                            )}
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            )
                        ) : (
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(item.href)}
                                tooltip={{ children: item.title }}
                                onClick={closeSidebarOnMobile}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    onClick={closeSidebarOnMobile}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
