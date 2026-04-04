import { useSidebar } from '@/components/ui/sidebar';

export default function AppLogo() {
    let collapsed = false;
    try {
        const { state } = useSidebar();
        collapsed = state === 'collapsed';
    } catch {}

    return (
        <>
            <div
                className={`flex aspect-square items-center justify-center transition-all duration-300 ease-in-out ${collapsed ? 'size-8' : 'size-10'}`}
            >
                <img
                    src="/apotek.svg"
                    alt="Apotek Logo"
                    className={`transition-all duration-300 ease-in-out ${collapsed ? 'size-5' : 'size-8'}`}
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-base">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Apotek
                </span>
            </div>
        </>
    );
}
