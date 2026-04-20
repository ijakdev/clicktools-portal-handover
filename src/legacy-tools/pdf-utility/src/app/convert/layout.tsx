import { ToolSidebar } from "@/components/layout/ToolSidebar";

export default function ConvertLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container flex-1 items-start md:grid md:grid-cols-[240px_1fr] md:gap-6 lg:grid-cols-[280px_1fr] lg:gap-10 px-4">
            <ToolSidebar />
            <div className="py-6 w-full">
                {children}
            </div>
        </div>
    );
}
