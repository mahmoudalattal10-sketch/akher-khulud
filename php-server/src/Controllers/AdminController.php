<?php

namespace Diafat\Controllers;

use Diafat\Config\Database;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use PDO;

class AdminController extends BaseController {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function dashboardStats($params = []) {
        $this->validateAdmin();

        // Only include CONFIRMED bookings in sales
        $totalSales = (float)$this->sum('Booking', 'totalPrice', "WHERE status = 'CONFIRMED'");
        $totalBookings = (int)$this->count('Booking');
        $confirmedCount = (int)$this->count('Booking', "WHERE status = 'CONFIRMED'");

        // 📈 Fetch Real Monthly Stats (Future Flow based on Check-in)
        $currentYear = date('Y');
        $monthlySql = "
            SELECT 
                MONTH(checkIn) as month_num,
                SUM(totalPrice) as total_value,
                COUNT(DISTINCT userId) as user_count
            FROM Booking
            WHERE status = 'CONFIRMED'
            AND YEAR(checkIn) = $currentYear
            GROUP BY MONTH(checkIn)
            ORDER BY MONTH(checkIn) ASC
        ";
        $monthlyStmt = $this->pdo->query($monthlySql);
        $monthlyRaw = $monthlyStmt->fetchAll(PDO::FETCH_ASSOC);

        $monthMap = [
            1 => 'يناير', 2 => 'فبراير', 3 => 'مارس', 4 => 'أبريل',
            5 => 'مايو', 6 => 'يونيو', 7 => 'يوليو', 8 => 'أغسطس',
            9 => 'سبتمبر', 10 => 'أكتوبر', 11 => 'نوفمبر', 12 => 'ديسمبر'
        ];

        // Initialize all months with 0
        $monthlyStats = [];
        for ($m = 1; $m <= 12; $m++) {
            $monthlyStats[$m] = [
                'name' => $monthMap[$m],
                'value' => 0,
                'users' => 0
            ];
        }

        // Fill with real data
        foreach ($monthlyRaw as $row) {
            $m = (int)$row['month_num'];
            if (isset($monthlyStats[$m])) {
                $monthlyStats[$m]['value'] = (float)$row['total_value'];
                $monthlyStats[$m]['users'] = (int)$row['user_count'];
            }
        }
        
        // Reset keys for JSON array
        $monthlyStats = array_values($monthlyStats);

        // 🗺️ Fetch Destination Distribution
        $destSql = "
            SELECT 
                LOWER(h.city) as raw_name,
                COUNT(b.id) as booking_count
            FROM Booking b
            JOIN Room r ON b.roomId = r.id
            JOIN Hotel h ON r.hotelId = h.id
            WHERE b.status = 'CONFIRMED'
            GROUP BY LOWER(h.city)
        ";
        $destStmt = $this->pdo->query($destSql);
        $destRaw = $destStmt->fetchAll(PDO::FETCH_ASSOC);

        $cityMapping = [
            'مكة' => 'مكة المكرمة',
            'مكة المكرمة' => 'مكة المكرمة',
            'makkah' => 'مكة المكرمة',
            'mecca' => 'مكة المكرمة',
            'makka' => 'مكة المكرمة',
            'المدينة' => 'المدينة المنورة',
            'المدينة المنورة' => 'المدينة المنورة',
            'madinah' => 'المدينة المنورة',
            'medina' => 'المدينة المنورة',
            'madina' => 'المدينة المنورة',
            'دبي' => 'دبي',
            'dubai' => 'دبي',
            'الرياض' => 'الرياض',
            'riyadh' => 'الرياض',
            'جدة' => 'جدة',
            'jeddah' => 'جدة',
            'jedda' => 'جدة',
             'khobar' => 'الخبر',
            'dammam' => 'الدمام',
            'abha' => 'أبها',
            'doha' => 'الدوحة',
            'kuwait' => 'الكويت',
            'manama' => 'المنامة',
            'muscat' => 'مسقط',
            'cairo' => 'القاهرة',
            'sharm' => 'شرم الشيخ',
            'amman' => 'عمان'
        ];

        // [FIX] Explicitly initialize Makkah and Madinah to ensure they appear
        $consolidated = [
            'مكة المكرمة' => 0,
            'المدينة المنورة' => 0
        ];

        foreach ($destRaw as $row) {
            $rawName = trim($row['raw_name']);
            $standardName = $cityMapping[$rawName] ?? $cityMapping[strtolower($rawName)] ?? ucfirst($rawName);
            
            if (!isset($consolidated[$standardName])) {
                $consolidated[$standardName] = 0;
            }
            $consolidated[$standardName] += (int)$row['booking_count'];
        }

        // Filter to only show Makkah, Madinah, and "Others" if requested, or just sort them to top
        // For now, sorting so Makkah/Madinah are first if they have data, or at least present
        arsort($consolidated); 

        $totalDestBookings = array_sum($consolidated);
        $destinations = [];
        $colors = ['#1e3a8a', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];
        $emojiMap = [
            'مكة المكرمة' => '🕋',
            'المدينة المنورة' => '🕌',
            'دبي' => '🏢',
            'الرياض' => '🏗️',
            'جدة' => '🌊',
            'الخبر' => '🏖️',
            'الدمام' => '🏭',
            'أبها' => '⛰️',
            'الدوحة' => '🌆',
            'الكويت' => '🏙️',
            'القاهرة' => '🏺',
            'شرم الشيخ' => '🏝️',
            'عمان' => '🏛️'
        ];

        $index = 0;
        foreach ($consolidated as $name => $count) {
            // Skip if 0 and not Makkah/Madinah (optional cleanup)
            // if ($count === 0 && $name !== 'مكة المكرمة' && $name !== 'المدينة المنورة') continue;

            $destinations[] = [
                'name' => $name,
                'percentage' => $totalDestBookings > 0 ? round(($count / $totalDestBookings) * 100) : 0,
                'color' => $colors[$index % count($colors)],
                'icon' => $emojiMap[$name] ?? '📍'
            ];
            $index++;
        }

        $stats = [
            'sales' => $totalSales,
            'activeBookings' => (int)$this->count('Booking', "WHERE status = 'PENDING'"),
            'profit' => $totalSales * 0.15,
            'visitors' => (int)$this->count('User'), // Real user count as visitors
            'completionRate' => $totalBookings > 0 ? ($confirmedCount / $totalBookings) * 100 : 0,
            'totalBookings' => $totalBookings,
            'confirmedCount' => $confirmedCount,
            'avgBookingValue' => $confirmedCount > 0 ? $totalSales / $confirmedCount : 0,
            'monthlyStats' => !empty($monthlyStats) ? $monthlyStats : [
                ['name' => 'لا يوجد بيانات', 'value' => 0, 'users' => 0]
            ],
            'destinations' => !empty($destinations) ? $destinations : [
                ['name' => 'لا يوجد بيانات', 'percentage' => 0, 'color' => '#ccc', 'icon' => 'kaaba']
            ]
        ];

        return $this->success($stats, 'Dashboard statistics retrieved');
    }

    public function analytics($params = []) {
        $this->validateAdmin();

        // 📅 1. Weekly Trends (Last 7 Days)
        $weeklySql = "
            SELECT 
                DATE(createdAt) as date,
                SUM(totalPrice) as revenue,
                COUNT(*) as bookings
            FROM Booking
            WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
              AND status != 'CANCELLED'
            GROUP BY DATE(createdAt)
            ORDER BY DATE(createdAt) ASC
        ";
        $weeklyStmt = $this->pdo->query($weeklySql);
        $weeklyRaw = $weeklyStmt->fetchAll(PDO::FETCH_ASSOC);

        // Map English week days to Arabic
        $dayMap = [
            'Saturday' => 'السبت', 'Sunday' => 'الأحد', 'Monday' => 'الاثنين',
            'Tuesday' => 'الثلاثاء', 'Wednesday' => 'الأربعاء', 'Thursday' => 'الخميس', 'Friday' => 'الجمعة'
        ];

        $weeklyData = [];
        // Fill last 7 days even if no data
        for ($i = 6; $i >= 0; $i--) {
            $currentDate = date('Y-m-d', strtotime("-$i day"));
            $dayName = $dayMap[date('l', strtotime($currentDate))];
            
            $found = false;
            foreach ($weeklyRaw as $row) {
                if ($row['date'] === $currentDate) {
                    // We'll use "visitors" field for user registrations if needed, 
                    // or just use booking count as a proxy for activity
                    $weeklyData[] = [
                        'name' => $dayName,
                        'visitors' => (int)$row['bookings'] * 5, // Just for visualization, scale bookings
                        'revenue' => (float)$row['revenue']
                    ];
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $weeklyData[] = ['name' => $dayName, 'visitors' => 0, 'revenue' => 0];
            }
        }

        // 🏨 2. Hotel Performance (City Share)
        $hotelStatsSql = "
            SELECT 
                h.city,
                COUNT(b.id) as booking_count
            FROM Booking b
            JOIN Room r ON b.roomId = r.id
            JOIN Hotel h ON r.hotelId = h.id
            WHERE b.status = 'CONFIRMED'
            GROUP BY h.city
        ";
        $hotelStatsStmt = $this->pdo->query($hotelStatsSql);
        $hotelStatsRaw = $hotelStatsStmt->fetchAll(PDO::FETCH_ASSOC);

        $totalConfirmed = array_sum(array_column($hotelStatsRaw, 'booking_count'));
        $hotelData = [];
        $colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de65'];
        
        // Standardize city names (using same logic as dashboard)
        $cityMapping = [
            'مكة' => 'فنادق مكة',
            'مكة المكرمة' => 'فنادق مكة',
            'makkah' => 'فنادق مكة',
            'mecca' => 'فنادق مكة',
            'المدينة' => 'فنادق المدينة',
            'المدينة المنورة' => 'فنادق المدينة',
            'madinah' => 'فنادق المدينة',
            'medina' => 'فنادق المدينة',
            'دبي' => 'فنادق دبي',
            'dubai' => 'فنادق دبي'
        ];

        $consolidatedHotels = [];
        foreach ($hotelStatsRaw as $row) {
            $stdName = $cityMapping[strtolower(trim($row['city']))] ?? 'فنادق أخرى';
            if (!isset($consolidatedHotels[$stdName])) $consolidatedHotels[$stdName] = 0;
            $consolidatedHotels[$stdName] += (int)$row['booking_count'];
        }

        $idx = 0;
        foreach ($consolidatedHotels as $name => $count) {
            $pct = $totalConfirmed > 0 ? round(($count / $totalConfirmed) * 100) : 0;
            $hotelData[] = [
                'name' => $name,
                'val' => $pct . '%',
                'rawVal' => $pct,
                'color' => $colors[$idx % count($colors)]
            ];
            $idx++;
        }

        // 🌍 3. Visitor Sources (By Country)
        $sourceSql = "SELECT country, COUNT(*) as count FROM User GROUP BY country";
        $sourceStmt = $this->pdo->query($sourceSql);
        $sourceRaw = $sourceStmt->fetchAll(PDO::FETCH_ASSOC);

        $ksaCount = 0;
        $gulfCount = 0;
        $intlCount = 0;
        $topCountry = 'السعودية';
        $maxCount = 0;

        $gulfCountries = ['الكويت', 'الإمارات', 'قطر', 'عمان', 'البحرين', 'Kuwait', 'UAE', 'Qatar', 'Oman', 'Bahrain'];

        foreach ($sourceRaw as $row) {
            $country = trim($row['country']);
            $count = (int)$row['count'];

            if ($count > $maxCount) {
                $maxCount = $count;
                $topCountry = $country;
            }

            if ($country === 'السعودية' || $country === 'Saudi Arabia' || strtolower($country) === 'ksa') {
                $ksaCount += $count;
            } elseif (in_array($country, $gulfCountries)) {
                $gulfCount += $count;
            } else {
                $intlCount += $count;
            }
        }

        $totalUsers = $ksaCount + $gulfCount + $intlCount;
        $topPct = $totalUsers > 0 ? round(($maxCount / $totalUsers) * 100) : 0;

        return $this->success([
            'weekly' => $weeklyData,
            'hotels' => !empty($hotelData) ? $hotelData : [
                ['name' => 'لا يوجد بيانات', 'val' => '0%', 'rawVal' => 0, 'color' => '#eee']
            ],
            'visitorSources' => [
                'ksa' => $totalUsers > 0 ? round(($ksaCount / $totalUsers) * 100) : 0,
                'gulf' => $totalUsers > 0 ? round(($gulfCount / $totalUsers) * 100) : 0,
                'intl' => $totalUsers > 0 ? round(($intlCount / $totalUsers) * 100) : 0,
                'top' => ['name' => $topCountry ?: 'السعودية', 'pct' => $topPct]
            ]
        ], 'Analytics data retrieved');
    }

    public function allBookings($params = []) {
        $this->validateAdmin();

        $stmt = $this->pdo->prepare("
            SELECT 
                b.*, 
                u.name as userName, 
                u.email as userEmail, 
                h.name as hotelName,
                r.name as roomName
            FROM Booking b 
            LEFT JOIN User u ON b.userId = u.id 
            LEFT JOIN Room r ON b.roomId = r.id 
            LEFT JOIN Hotel h ON r.hotelId = h.id 
            ORDER BY b.createdAt DESC
        ");
        $stmt->execute();
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $this->success($bookings, 'All bookings retrieved successfully');
    }

    public function getPilgrims($params = []) {
        $this->validateAdmin();

        $stmt = $this->pdo->prepare("
            SELECT 
                b.id as bookingId,
                b.guestName,
                b.guestEmail,
                b.guestPhone,
                b.guestsCount,
                b.checkIn,
                b.checkOut,
                h.name as hotelName,
                b.createdAt as registeredAt
            FROM Booking b
            LEFT JOIN Room r ON b.roomId = r.id
            LEFT JOIN Hotel h ON r.hotelId = h.id
            ORDER BY b.createdAt DESC
        ");
        $stmt->execute();
        $pilgrims = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $this->success($pilgrims, 'Pilgrims data retrieved successfully');
    }

    public function getNotifications($params = []) {
        $this->validateAdmin();
        $notificationModel = new \Diafat\Models\Notification();
        $notifications = $notificationModel->getRecent(50);
        return $this->success(['notifications' => $notifications], 'Notifications retrieved');
    }

    public function markNotificationAsRead($params = []) {
        $this->validateAdmin();
        $id = $params['id'] ?? null;
        if (!$id) return $this->error('Notification ID required', 400);

        $notificationModel = new \Diafat\Models\Notification();
        $notificationModel->markAsRead($id);
        return $this->success(['success' => true], 'Notification marked as read');
    }

    public function updateCredentials($params = []) {
        $user = $this->validateAdmin();

        $data = $this->getInput();
        $currentPassword = $data['currentPassword'] ?? null;
        $newEmail = $data['newEmail'] ?? null;
        $newPassword = $data['newPassword'] ?? null;

        if (!$currentPassword) {
            return $this->error('Current password is required', 400);
        }

        $userModel = new \Diafat\Models\User();
        $userData = $userModel->findByEmail($user->email);

        if (!$userData || !$userModel->verifyPassword($currentPassword, $userData['password'])) {
            return $this->error('كلمة المرور الحالية غير صحيحة', 401);
        }

        $updateData = [];
        if ($newEmail) $updateData['email'] = $newEmail;
        if ($newPassword) $updateData['password'] = password_hash($newPassword, PASSWORD_BCRYPT);

        if (!empty($updateData)) {
            $userModel->update($user->sub, $updateData);
        }

        return $this->success(['success' => true], 'Credentials updated successfully');
    }


    private function count($table, $condition = '') {
        $stmt = $this->pdo->query("SELECT COUNT(*) FROM $table $condition");
        return $stmt->fetchColumn();
    }

    private function sum($table, $column, $condition = '') {
        $stmt = $this->pdo->query("SELECT SUM($column) FROM $table $condition");
        return $stmt->fetchColumn() ?: 0;
    }
}
