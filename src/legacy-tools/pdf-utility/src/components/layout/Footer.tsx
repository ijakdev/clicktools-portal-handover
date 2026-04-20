export function Footer() {
    return (
        <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 text-sm text-slate-500">
                <p>
                    &copy; {new Date().getFullYear()} PDF Utility. All rights reserved.
                </p>
                <p>
                    Secure logic-side processing. Your files never leave your device.
                </p>
            </div>
        </footer>
    );
}
