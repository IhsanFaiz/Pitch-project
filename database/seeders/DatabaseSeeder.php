<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\GroupMember;
use App\Models\PitchingPeriod;
use App\Models\PitchingSchedule;
use App\Models\Registration;
use App\Models\Role;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with roles, sample student, group, and pitching schedule.
     */
    public function run(): void
    {
        // 1. Roles
        $roleMahasiswa = Role::firstOrCreate(['name' => 'mahasiswa'], ['display_name' => 'Mahasiswa']);
        $roleDosen = Role::firstOrCreate(['name' => 'dosen'], ['display_name' => 'Dosen Penguji']);
        $roleAdmin = Role::firstOrCreate(['name' => 'admin_bpa'], ['display_name' => 'Admin BPA']);
        Role::firstOrCreate(['name' => 'super_admin'], ['display_name' => 'Super Admin']);

        // 2. Default Password
        $password = Hash::make('admin123');

        // 3. User Mahasiswa (Faiz)
        $userFaiz = User::updateOrCreate(
            ['username' => 'Faiz'],
            [
                'role_id' => $roleMahasiswa->id,
                'email' => 'faiz@example.com',
                'password' => $password,
                'email_verified_at' => now(),
            ]
        );

        StudentProfile::updateOrCreate(
            ['user_id' => $userFaiz->id],
            [
                'nim' => '102067543290',
                'faculty' => 'Fakultas Ilmu Terapan',
                'study_program' => 'D3 Rekayasa Perangkat Lunak Aplikasi',
                'phone' => '081234567890',
            ]
        );

        // 4. Team Members
        $membersData = [
            ['username' => 'Putri Aulia', 'nim' => '607062430010', 'email' => 'putri@example.com'],
            ['username' => 'Budi Santoso', 'nim' => '607062430011', 'email' => 'budi@example.com'],
            ['username' => 'Erda Sutresna', 'nim' => '607062430012', 'email' => 'erda@example.com'],
            ['username' => 'Maysaroh Diningrat', 'nim' => '607062430013', 'email' => 'maysarohri4@example.com'],
        ];

        $memberUsers = [];
        foreach ($membersData as $m) {
            $memberUser = User::updateOrCreate(
                ['username' => $m['username']],
                [
                    'role_id' => $roleMahasiswa->id,
                    'email' => $m['email'],
                    'password' => $password,
                    'email_verified_at' => now(),
                ]
            );

            StudentProfile::updateOrCreate(
                ['user_id' => $memberUser->id],
                [
                    'nim' => $m['nim'],
                    'faculty' => 'Fakultas Ilmu Terapan',
                    'study_program' => 'D3 Rekayasa Perangkat Lunak Aplikasi',
                ]
            );

            $memberUsers[] = $memberUser;
        }

        // 5. Lecturer (Dosen Penguji)
        $dosenErna = User::updateOrCreate(
            ['username' => 'dosenPenguji'],
            [
                'role_id' => $roleDosen->id,
                'email' => 'dosenPenguji@telkomuniversity.ac.id',
                'password' => $password,
                'email_verified_at' => now(),
            ]
        );

        // 6. Admin BPA
        User::updateOrCreate(
            ['username' => 'Admin BPA'],
            [
                'role_id' => $roleAdmin->id,
                'email' => 'bpa@telkomuniversity.ac.id',
                'password' => $password,
                'email_verified_at' => now(),
            ]
        );

        // 7. Pitching Period
        $period = PitchingPeriod::firstOrCreate(
            ['name' => 'Pitching Semester Ganjil 2026'],
            [
                'academic_year' => '2026/2027',
                'start_date' => now()->toDateString(),
                'end_date' => now()->addMonths(3)->toDateString(),
                'status' => 'active',
                'is_active' => true,
            ]
        );

        // 8. Group
        // $group = Group::firstOrCreate(
        //     ['group_name' => 'Innovation'],
        //     [
        //         'business_name' => 'Innovation',
        //         'business_field' => 'Software & Digital Services',
        //         'business_category' => 'Teknologi Informasi',
        //         'description' => 'Aplikasi inovatif berbasis web untuk Student Enterprise Fund.',
        //         'product_service' => 'Sistem Informasi Manajemen Kewirausahaan',
        //         'target_market' => 'Mahasiswa dan Perguruan Tinggi',
        //         'status' => 'validated',
        //     ]
        // );

        // // 9. Assign Group Members
        // GroupMember::firstOrCreate(
        //     ['group_id' => $group->id, 'user_id' => $userFaiz->id],
        //     ['role' => 'leader']
        // );

        // foreach ($memberUsers as $mUser) {
        //     GroupMember::firstOrCreate(
        //         ['group_id' => $group->id, 'user_id' => $mUser->id],
        //         ['role' => 'member']
        //     );
        // }

        // 10. Pitching Schedule
        // $schedule = PitchingSchedule::firstOrCreate(
        //     [
        //         'period_id' => $period->id,
        //         'room' => 'R101',
        //         'date' => '2026-10-20',
        //     ],
        //     [
        //         'lecturer_id' => $dosenErna->id,
        //         'start_time' => '11:00:00',
        //         'end_time' => '11:30:00',
        //         'is_booked' => true,
        //     ]
        // );

        // 11. Registration
        // Registration::firstOrCreate(
        //     [
        //         'group_id' => $group->id,
        //         'period_id' => $period->id,
        //     ],
        //     [
        //         'schedule_id' => $schedule->id,
        //         'status' => 'scheduled',
        //     ]
        // );
    }
}
