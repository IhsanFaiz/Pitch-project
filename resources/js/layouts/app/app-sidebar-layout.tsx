import { Link, router, usePage } from '@inertiajs/react';
import {
    ChevronUp,
    Lock,
    LogOut,
    Menu,
    Settings,
    User as UserIcon,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { dashboard, logout } from '@/routes';
import type { AppLayoutProps, User } from '@/types';

export default function AppSidebarLayout({ children }: AppLayoutProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth?.user;
    const getInitials = useInitials();
    const initials = getInitials(user?.username || user?.name || 'Amara Okafor');
    const displayName = user?.username || user?.name || 'Amara Okafor';

    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown when clicking outside or pressing Escape
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setProfileMenuOpen(false);
            }
        }

        if (profileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [profileMenuOpen]);

    const handleLogout = () => {
        router.post('/logout');
    };

    const navItems = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: Menu,
            active: true,
        },
        {
            title: 'Group registration',
            href: '#',
            icon: UserIcon,
            active: false,
        },
        {
            title: 'Schedule booking',
            href: '#',
            icon: Settings,
            active: false,
        },
        {
            title: 'Registration confirmation',
            href: '#',
            icon: Lock,
            active: false,
        },
        {
            title: 'Settings',
            href: '#',
            icon: Settings,
            active: false,
        },
    ];

    const sidebarContent = (
        <div className="flex h-full flex-col justify-between p-5 lg:p-6">
            {/* Top Brand & Navigation */}
            <div className="flex flex-col gap-7">
                {/* Brand Header */}
                <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/90 bg-white font-bold text-xs text-primary shadow-xs dark:border-neutral-700 dark:bg-card">
                        TU
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-primary dark:text-rose-300 leading-tight">
                            Telkom University
                        </span>
                        <span className="text-[11px] text-muted-foreground font-normal leading-tight mt-0.5">
                            Student Enterprise Fund
                        </span>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex flex-col gap-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        if (item.active) {
                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/95"
                                >
                                    <Icon className="size-4 shrink-0" />
                                    <span>{item.title}</span>
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100/90 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <Icon className="size-4 shrink-0 text-neutral-500 dark:text-zinc-400" />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Profile & Help Center */}
            <div className="flex flex-col gap-3 pt-6 border-t border-neutral-200/70 dark:border-neutral-800">
                {/* Profile Button with Logout Dropdown Popup */}
                <div className="relative" ref={profileRef}>
                    <button
                        type="button"
                        onClick={() => setProfileMenuOpen((prev) => !prev)}
                        className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-neutral-100/80 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        <Avatar className="size-9 shrink-0 ring-1 ring-primary/20">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs font-bold text-foreground truncate">
                                {displayName}
                            </span>
                            <span className="text-[10px] text-muted-foreground leading-tight">
                                My pitch
                            </span>
                        </div>
                        <ChevronUp
                            className={`size-3.5 text-neutral-400 transition-transform duration-200 ${
                                profileMenuOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    {/* Dropdown Menu Popup */}
                    {profileMenuOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-full min-w-56 rounded-xl border border-neutral-200/90 bg-white p-1.5 shadow-xl dark:border-neutral-800 dark:bg-[#1A1B20] z-50 animate-in fade-in-0 zoom-in-95 duration-100">
                            <div className="flex flex-col px-2.5 py-2 border-b border-neutral-100 dark:border-neutral-800/80 mb-1">
                                <span className="text-xs font-bold text-foreground truncate">
                                    {displayName}
                                </span>
                                <span className="text-[11px] text-muted-foreground truncate">
                                    {user?.email || 'Student'}
                                </span>
                            </div>

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                onClick={() => setProfileMenuOpen(false)}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors cursor-pointer text-left"
                            >
                                <LogOut className="size-4 shrink-0" />
                                <span>Log out</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Help Centre Button */}
                <button
                    type="button"
                    className="flex w-full items-center gap-2.5 rounded-xl border border-neutral-200/80 bg-white px-3.5 py-2 text-xs font-medium text-neutral-800 shadow-2xs hover:bg-neutral-50 dark:border-neutral-800 dark:bg-card dark:text-zinc-200 transition-colors cursor-pointer"
                >
                    <Menu className="size-3.5 text-neutral-500" />
                    <span>Help centre</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F6F4F4] text-foreground dark:bg-[#121316]">
            {/* Mobile Header Bar */}
            <div className="flex items-center justify-between border-b border-neutral-200/70 bg-white px-4 py-3 lg:hidden dark:border-neutral-800 dark:bg-card">
                <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-xs">
                        TU
                    </div>
                    <span className="text-sm font-bold text-primary">Telkom University</span>
                </div>
                <button
                    type="button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                    {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
                    onClick={() => setMobileOpen(false)}
                >
                    <div
                        className="h-full w-68 max-w-[80vw] bg-[#FAF8F8] shadow-xl dark:bg-[#18191E]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {sidebarContent}
                    </div>
                </div>
            )}

            <div className="flex min-h-screen">
                {/* Desktop Sticky Sidebar */}
                <aside className="hidden w-68 shrink-0 border-r border-neutral-200/80 bg-[#FAF8F8] lg:block sticky top-0 h-screen dark:border-neutral-800 dark:bg-[#18191E]">
                    {sidebarContent}
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden p-6 sm:p-8 lg:p-10">
                    <div className="mx-auto max-w-6xl">{children}</div>
                </main>
            </div>
        </div>
    );
}
