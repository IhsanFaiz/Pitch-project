<?php

namespace App\Http\Controllers;

use App\Models\GroupMember;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the student dashboard with real database data.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Find user's group membership
        $membership = GroupMember::where('user_id', $user->id)
            ->with([
                'group.members.user.studentProfile',
                'group.registrations.schedule.lecturer',
                'group.registrations.assessment',
            ])
            ->first();

        $groupPayload = null;
        $bookingPayload = null;
        $journeySteps = [];
        $resultPayload = null;

        if ($membership && $membership->group) {
            $group = $membership->group;
            $leader = $group->members->firstWhere('role', 'leader') ?? $group->members->first();

            $groupPayload = [
                'name' => $group->business_name ?: $group->group_name,
                'leaderName' => $leader?->user?->name ?? 'Belum ditentukan',
                'nim' => $leader?->user?->studentProfile?->nim ?? '-',
                'studyProgram' => $leader?->user?->studentProfile?->study_program ?? 'D3 Rekayasa Perangkat Lunak Aplikasi',
                'members' => $group->members->map(function ($m) {
                    return [
                        'id' => (string) $m->id,
                        'name' => $m->user?->name ?? 'Anggota',
                        'nim' => $m->user?->studentProfile?->nim ?? '-',
                    ];
                })->values()->all(),
            ];

            // Get latest registration
            $registration = $group->registrations->sortByDesc('id')->first();
            $schedule = $registration?->schedule;

            if ($schedule) {
                $carbonDate = Carbon::parse($schedule->date);
                $bookingPayload = [
                    'date' => $carbonDate->isoFormat('dddd, D MMMM Y'),
                    'time' => substr($schedule->start_time, 0, 5).'-'.substr($schedule->end_time, 0, 5).' (WIB)',
                    'groupName' => $group->group_name,
                    'reviewer' => $schedule->lecturer?->name ?? 'Dr. Ahmad',
                    'proofUrl' => '#',
                ];
            }

            // Calculate journey steps based on current status
            $isPitched = in_array($registration?->status, ['pitched', 'passed', 'failed']);
            $isPassed = $registration?->status === 'passed';

            $journeySteps = [
                [
                    'id' => 'registration',
                    'title' => 'Registration',
                    'status' => 'completed',
                    'statusLabel' => 'Completed',
                ],
                [
                    'id' => 'schedule_booking',
                    'title' => 'Schedule booking',
                    'status' => $schedule ? 'completed' : 'process',
                    'statusLabel' => $schedule ? 'Completed' : ($group->status === 'validated' ? 'Process' : 'Not started'),
                ],
                [
                    'id' => 'confirmation',
                    'title' => 'Confirmation',
                    'status' => $isPitched ? 'completed' : ($schedule ? 'process' : 'not-started'),
                    'statusLabel' => $isPitched ? 'Completed' : ($schedule ? 'Process' : 'Not started'),
                ],
                [
                    'id' => 'disbursement',
                    'title' => 'Disbursement',
                    'status' => $isPassed ? 'completed' : 'not-started',
                    'statusLabel' => $isPassed ? 'Completed' : 'Not started',
                ],
            ];

            // Calculate pitching result
            if ($registration) {
                if ($registration->status === 'passed') {
                    $resultPayload = [
                        'status' => 'PASSED',
                        'moderationNote' => $registration->signing_notes ?: 'Selamat! Kelompok Anda dinyatakan LOLOS seleksi pendanaan. Silakan hadir ke BPA untuk proses penandatanganan.',
                    ];
                } elseif ($registration->status === 'failed') {
                    $resultPayload = [
                        'status' => 'FAILED',
                        'moderationNote' => 'Mohon maaf, kelompok Anda belum memenuhi kualifikasi seleksi pendanaan periode ini.',
                    ];
                } else {
                    $resultPayload = [
                        'status' => 'PENDING',
                        'moderationNote' => 'Your lecturer will publish the outcome after panel moderation. Final treatments will appear as PASSED or FAILED, with feedback and next steps.',
                    ];
                }
            }
        }

        return Inertia::render('dashboard', [
            'group' => $groupPayload,
            'pitchBooking' => $bookingPayload,
            'journeySteps' => $journeySteps,
            'pitchingResult' => $resultPayload,
        ]);
    }
}
