import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Bell,
    CalendarClock,
    Check,
    ChevronRight,
    Eye,
    Plus,
    User as UserIcon,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import type { User } from '@/types';

export interface GroupMember {
    id: string;
    name: string;
    nim: string;
}

export interface GroupDetails {
    name: string;
    leaderName: string;
    nim: string;
    studyProgram: string;
    members: GroupMember[];
}

export interface PitchBooking {
    date: string;
    time: string;
    groupName: string;
    reviewer: string;
    proofUrl?: string;
}

export type JourneyStepStatus = 'completed' | 'process' | 'not-started';

export interface JourneyStep {
    id: string;
    title: string;
    status: JourneyStepStatus;
    statusLabel: string;
}

export type PitchingStatus = 'PENDING' | 'PASSED' | 'FAILED';

export interface PitchingResult {
    status: PitchingStatus;
    moderationNote?: string;
}

export interface DashboardProps {
    group?: GroupDetails | null;
    pitchBooking?: PitchBooking | null;
    journeySteps?: JourneyStep[];
    pitchingResult?: PitchingResult | null;
}

export default function Dashboard({
    group,
    pitchBooking,
    journeySteps = [],
    pitchingResult,
}: DashboardProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth?.user;
    const userGreetingName = user?.username || user?.name || 'Mahasiswa';

    const activeGroup = group ?? null;
    const activeBooking = pitchBooking ?? null;
    const activeJourney = journeySteps ?? [];
    const activeResult = pitchingResult ?? null;

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 lg:gap-7 pb-10">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#7A1418] dark:text-rose-300">
                            Good morning, {userGreetingName}
                        </h1>
                        <p className="text-xs sm:text-sm text-[#7C7474] dark:text-neutral-400 mt-1 font-normal">
                            Track your group&apos;s progress from registration to funding.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                        {/* Notification Bell */}
                        <div className="relative flex size-10 items-center justify-center rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                            <Bell className="size-5 text-[#7A1418] dark:text-rose-300" />
                            <span className="absolute top-2 right-2 size-2 rounded-full bg-[#7A1418] ring-2 ring-white dark:ring-card" />
                        </div>
                    </div>
                </div>

                {/* 1. Funding Journey Card */}
                <Card className="rounded-2xl border border-neutral-100/90 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-neutral-800 dark:bg-card">
                    <CardHeader className="p-0 pb-6">
                        <CardTitle className="text-base sm:text-lg font-bold text-[#7A1418] dark:text-rose-300">
                            Funding journey
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {activeJourney.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <div className="size-10 rounded-full bg-rose-50 text-[#7A1418] flex items-center justify-center mb-2 dark:bg-rose-950/40 dark:text-rose-300">
                                    <AlertCircle className="size-5" />
                                </div>
                                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                    Tahapan pendanaan belum dimulai
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                                    Silakan selesaikan pendaftaran kelompok Anda terlebih dahulu untuk mengaktifkan tahapan seleksi pendanaan.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto pb-2">
                                <div className="min-w-[560px]">
                                    {/* Timeline line and node icons */}
                                    <div className="flex items-center justify-between">
                                        {activeJourney.map((step, index) => {
                                            const isLast = index === activeJourney.length - 1;
                                            const nextStep = !isLast ? activeJourney[index + 1] : null;
                                            const lineCompleted =
                                                step.status === 'completed' &&
                                                (nextStep?.status === 'completed' || nextStep?.status === 'process');

                                            return (
                                                <div
                                                    key={step.id}
                                                    className={`flex items-center ${isLast ? 'flex-none' : 'flex-1'}`}
                                                >
                                                    {/* Node Indicator */}
                                                    <div className="relative flex flex-col items-center">
                                                        {step.status === 'completed' && (
                                                            <div className="flex size-6 items-center justify-center rounded-full bg-[#1B6F48] text-white shadow-xs">
                                                                <Check className="size-3.5 stroke-[3]" />
                                                            </div>
                                                        )}
                                                        {step.status === 'process' && (
                                                            <div className="flex size-6 items-center justify-center rounded-full bg-[#7A1418] text-white shadow-xs">
                                                                <div className="size-2 rounded-full bg-white" />
                                                            </div>
                                                        )}
                                                        {step.status === 'not-started' && (
                                                            <div className="size-6 rounded-full bg-[#E3DFDE] dark:bg-neutral-700 shadow-xs" />
                                                        )}
                                                    </div>

                                                    {/* Connecting Line */}
                                                    {!isLast && (
                                                        <div
                                                            className={`h-[2.5px] flex-1 mx-2 transition-colors ${
                                                                lineCompleted
                                                                    ? 'bg-[#7A1418] dark:bg-rose-700'
                                                                    : 'bg-[#E3DFDE] dark:bg-neutral-700'
                                                            }`}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Timeline Labels & Badges */}
                                    <div className="grid grid-cols-4 mt-3">
                                        {activeJourney.map((step) => {
                                            const isCompleted = step.status === 'completed';
                                            const isProcess = step.status === 'process';

                                            return (
                                                <div key={`label-${step.id}`} className="flex flex-col items-start pr-2">
                                                    <span className="text-xs sm:text-sm font-bold text-[#7A1418] dark:text-rose-300 leading-snug">
                                                        {step.title}
                                                    </span>
                                                    <div className="mt-1.5">
                                                        {isCompleted && (
                                                            <span className="inline-flex items-center rounded-full bg-[#FCEAEB] px-2.5 py-0.5 text-[11px] font-semibold text-[#9A272D] dark:bg-rose-950/60 dark:text-rose-300">
                                                                {step.statusLabel}
                                                            </span>
                                                        )}
                                                        {isProcess && (
                                                            <span className="inline-flex items-center rounded-full bg-[#FEF5E7] px-2.5 py-0.5 text-[11px] font-semibold text-[#B58500] dark:bg-amber-950/60 dark:text-amber-300">
                                                                {step.statusLabel}
                                                            </span>
                                                        )}
                                                        {!isCompleted && !isProcess && (
                                                            <span className="inline-flex items-center rounded-full bg-[#FEF5E7] px-2.5 py-0.5 text-[11px] font-semibold text-[#B58500] dark:bg-amber-950/60 dark:text-amber-300">
                                                                {step.statusLabel}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 2. Middle Row: Detail Kelompok (7 cols) + Pitch booking (5 cols) */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Detail Kelompok Card */}
                    <Card className="rounded-2xl border border-neutral-100/90 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:col-span-7 xl:col-span-8 dark:border-neutral-800 dark:bg-card">
                        <CardHeader className="flex flex-row items-center justify-between p-0 pb-5">
                            <CardTitle className="text-base sm:text-lg font-bold text-[#7A1418] dark:text-rose-300">
                                Detail Kelompok
                            </CardTitle>
                            {activeGroup && (
                                <button
                                    type="button"
                                    className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 cursor-pointer"
                                >
                                    lihat semua
                                </button>
                            )}
                        </CardHeader>
                        <CardContent className="p-0">
                            {!activeGroup ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-[#7A1418] mb-3 dark:bg-rose-950/40 dark:text-rose-300">
                                        <Users className="size-7" />
                                    </div>
                                    <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                        Belum Ada Kelompok Terdaftar
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mb-4">
                                        Kelompok Anda belum terdaftar dalam sistem. Daftarkan kelompok beserta anggota untuk memulai program.
                                    </p>
                                    <Button className="rounded-xl bg-[#7A1418] px-4 py-2 text-xs font-semibold text-white hover:bg-[#631013] transition-colors shadow-xs">
                                        <Plus className="size-3.5 mr-1.5" />
                                        Daftar Kelompok Baru
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Left Details */}
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <span className="text-[11px] font-semibold text-[#5C6479] dark:text-neutral-400 block">
                                                Nama Kelompok
                                            </span>
                                            <span className="text-sm font-bold text-[#7A1418] dark:text-rose-200 mt-0.5 block">
                                                {activeGroup.name}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-[11px] font-semibold text-[#5C6479] dark:text-neutral-400 block">
                                                Nama Ketua Kelompok
                                            </span>
                                            <span className="text-sm font-bold text-[#7A1418] dark:text-rose-200 mt-0.5 block">
                                                {activeGroup.leaderName}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-[11px] font-semibold text-[#5C6479] dark:text-neutral-400 block">
                                                NIM
                                            </span>
                                            <span className="text-sm font-bold text-[#7A1418] dark:text-rose-200 mt-0.5 block">
                                                {activeGroup.nim}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-[11px] font-semibold text-[#5C6479] dark:text-neutral-400 block">
                                                Program Studi
                                            </span>
                                            <span className="text-sm font-bold text-[#7A1418] dark:text-rose-200 mt-0.5 block">
                                                {activeGroup.studyProgram}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right Members */}
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-3 block">
                                            Anggota Kelompok
                                        </span>

                                        <div className="flex flex-col gap-2.5">
                                            {activeGroup.members.map((member, idx) => (
                                                <div
                                                    key={`${member.id}-${idx}`}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-200/90 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                                        <UserIcon className="size-4" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-xs font-bold text-[#7A1418] dark:text-rose-200 leading-tight truncate">
                                                            {member.name}
                                                        </span>
                                                        <span className="text-[11px] text-muted-foreground font-normal leading-tight mt-0.5">
                                                            {member.nim}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pitch booking Card */}
                    <Card className="flex flex-col justify-between rounded-2xl border border-neutral-100/90 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:col-span-5 xl:col-span-4 dark:border-neutral-800 dark:bg-card">
                        <div>
                            <CardHeader className="p-0 pb-4">
                                <CardTitle className="text-base sm:text-lg font-bold text-[#7A1418] dark:text-rose-300">
                                    Pitch booking
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {!activeBooking ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500 mb-3 dark:bg-neutral-800 dark:text-neutral-400">
                                            <CalendarClock className="size-6" />
                                        </div>
                                        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                            Belum Ada Jadwal Pitching
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                                            Jadwal sesi pitching belum dipesan untuk kelompok ini.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1 text-xs">
                                        <p className="font-medium text-neutral-800 dark:text-neutral-200">
                                            {activeBooking.date}
                                        </p>
                                        <p className="font-medium text-neutral-800 dark:text-neutral-200">
                                            {activeBooking.time}
                                        </p>
                                        <p className="font-semibold text-[#7A1418] dark:text-rose-300 mt-2">
                                            {activeBooking.groupName}
                                        </p>
                                        <p className="font-semibold text-[#7A1418] dark:text-rose-300">
                                            {activeBooking.reviewer}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </div>

                        <div className="pt-6">
                            {activeBooking ? (
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl border-neutral-200/90 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors shadow-2xs"
                                >
                                    View proof
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl border-dashed border-neutral-300 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                >
                                    Pesan Jadwal Pitching
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>

                {/* 3. Final Pitching Result Card */}
                <Card className="rounded-2xl border border-neutral-100/90 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-neutral-800 dark:bg-card">
                    <CardHeader className="flex flex-row items-center justify-between p-0 pb-3">
                        <CardTitle className="text-base sm:text-lg font-bold text-[#7A1418] dark:text-rose-300">
                            Final pitching result
                        </CardTitle>
                        {activeResult && (
                            <span className="inline-flex items-center rounded-full bg-[#FEF5E7] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#B58500] dark:bg-amber-950/60 dark:text-amber-300">
                                {activeResult.status}
                            </span>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        {!activeResult ? (
                            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                Tahapan presentasi dan penilaian belum selesai dilaksanakan. Hasil review panelis akan diterbitkan di sini.
                            </p>
                        ) : (
                            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                                Your lecturer will publish the outcome after panel moderation. Final treatments will appear as{' '}
                                <strong className="font-bold text-neutral-900 dark:text-neutral-100">PASSED</strong> or{' '}
                                <strong className="font-bold text-neutral-900 dark:text-neutral-100">FAILED</strong>, with feedback and next steps.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
