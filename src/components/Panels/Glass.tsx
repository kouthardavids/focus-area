export function Glass({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={
                "bg-white/[0.07] backdrop-blur-2xl border border-white/[0.14] shadow-[0_8px_32px_rgba(0,0,0,0.35)] " +
                className
            }
        >
            {children}
        </div>
    );
}