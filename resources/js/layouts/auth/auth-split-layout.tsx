import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col lg:grid lg:grid-cols-3">
            {/* Left Panel: Maroon / Crimson Brand Hero (1/3 width) */}
            <div className="relative flex min-h-[320px] flex-col justify-between bg-primary p-8 text-white sm:p-10 lg:col-span-1 lg:min-h-svh lg:p-12 xl:p-16">
                <div className="hidden lg:block" />

                <div className="my-auto max-w-lg py-8 lg:py-14">
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/75">
                        STUDENT ENTERPRISE FUND
                    </span>
                    <h1 className="mt-4 text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-[2.5rem] leading-[1.18]">
                        Turn your idea into a <br className="hidden sm:inline" />
                        funded venture.
                    </h1>
                    <p className="mt-4 max-w-md text-sm font-normal text-white/85 sm:text-base leading-relaxed">
                        Register your group, book a pitch, and follow every funding milestone in one secure workspace.
                    </p>
                </div>

                <div className="mt-auto pt-6 text-xs font-normal text-white/65">
                    Enterprise & Innovation Office · 2026
                </div>
            </div>

            {/* Right Panel: Dominant 2/3 width, with comfortable dark mode background */}
            <div className="flex min-h-[500px] flex-1 items-center justify-center bg-[#FAF8F8] p-6 sm:p-8 lg:col-span-2 lg:p-12 dark:bg-[#18191E]">
                <div className="w-full max-w-[440px] rounded-2xl border border-neutral-100/90 bg-white p-8 sm:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-[#222328] dark:shadow-[0_15px_40px_rgba(0,0,0,0.35)]">
                    {title && (
                        <div className="mb-6 space-y-1.5 text-center">
                            <h2 className="text-2xl font-medium tracking-tight text-primary dark:text-rose-300">
                                {title}
                            </h2>
                            {description && (
                                <p className="text-sm text-muted-foreground dark:text-zinc-400">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
