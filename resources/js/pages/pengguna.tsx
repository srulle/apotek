import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { VerifyConfirm, UnverifyConfirm } from '@/components/confirm-action';
import { DataTable } from '@/components/datatable/datatable';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { pengguna } from '@/routes';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
};

interface PenggunaPageProps {
    users: User[];
}

export default function Pengguna({ users }: PenggunaPageProps) {
    const columns = [
        {
            accessorKey: 'name',
            header: 'Nama',
            cell: ({ row }: any) => (
                <div className="flex items-center gap-2">
                    <span>{row.original.name}</span>
                    <Badge
                        variant="secondary"
                        className="rounded-sm px-1.5 py-px text-[10px] capitalize"
                    >
                        {row.original.role.replace('_', ' ')}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'email_verified_at',
            header: 'Status Verifikasi',
            cell: ({ row }: any) => {
                const user = row.original;
                const handleVerify = () => {
                    router.post(`/pengguna/${user.id}/verify`);
                };
                const handleUnverify = () => {
                    router.post(`/pengguna/${user.id}/unverify`);
                };

                return (
                    <div className="flex items-center gap-2">
                        {user.email_verified_at ? (
                            <UnverifyConfirm onConfirm={handleUnverify}>
                                <div className="flex cursor-pointer items-center gap-2">
                                    <Checkbox
                                        checked
                                        className="cursor-pointer"
                                    />
                                    <span className="cursor-pointer">
                                        {new Date(
                                            user.email_verified_at,
                                        ).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </UnverifyConfirm>
                        ) : (
                            <VerifyConfirm onConfirm={handleVerify}>
                                <div className="flex cursor-pointer items-center gap-2">
                                    <Checkbox
                                        checked={false}
                                        className="cursor-pointer"
                                    />
                                    <span className="cursor-pointer text-destructive">
                                        Belum terverifikasi
                                    </span>
                                </div>
                            </VerifyConfirm>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Pengguna" />
            <div className="m-2 flex flex-1 flex-col overflow-auto rounded-xl border border-sidebar-border/70 p-2 md:m-4 md:p-4 dark:border-sidebar-border">
                <div className="max-w-2xl space-y-4">
                    <h1 className="text-xl font-semibold">Pengguna</h1>
                    <DataTable
                        data={users || []}
                        columns={columns}
                        initialPagination={{ pageIndex: 0, pageSize: 10 }}
                        emptyMessage="Belum ada data pengguna"
                        enableGlobalFilter
                        searchPlaceholder="Cari nama, email..."
                    />
                </div>
            </div>
        </>
    );
}

Pengguna.layout = {
    breadcrumbs: [
        {
            title: 'Pengguna',
            href: pengguna(),
        },
    ],
};
