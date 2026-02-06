<?php

namespace Diafat\Controllers;

use Diafat\Models\Booking;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class BookingController extends BaseController {
    
    public function create() {
        $user = $this->authenticate();
        $data = $this->getInput();
        
        $userId = $user ? $user->sub : null;

        // 🚀 PROACTIVE LINKING: If not logged in, try to link by email
        if (!$userId && !empty($data['guestEmail'])) {
            $userModel = new \Diafat\Models\User();
            $existingUser = $userModel->findByEmail($data['guestEmail']);
            if ($existingUser) {
                $userId = $existingUser['id'];
            }
        }

        $data['userId'] = $userId;

        if (empty($data['roomId']) || empty($data['checkIn']) || empty($data['checkOut'])) {
            return $this->error('Missing booking details', 400);
        }

        $checkIn = strtotime($data['checkIn']);
        $checkOut = strtotime($data['checkOut']);
        $now = strtotime('today');

        if ($checkIn < $now) {
            return $this->error('Check-in date cannot be in the past', 400);
        }

        if ($checkOut <= $checkIn) {
            return $this->error('Check-out date must be after check-in date', 400);
        }

        $bookingModel = new Booking();
        $roomModel = new \Diafat\Models\Room();
        $room = $roomModel->findById($data['roomId']);

        if (!$room) {
             return $this->error('Room not found', 404);
        }

        // 1. Calculate Base Price
        $nights = ceil(($checkOut - $checkIn) / 86400);
        $basePrice = $room['price'] * $nights * ($data['roomCount'] ?? 1);
        
        // Extra Bed Price
        $extraBedPrice = 0;
        if (!empty($data['extraBedCount']) && $data['extraBedCount'] > 0) {
             $extraBedPrice = ($room['extraBedPrice'] ?? 0) * $data['extraBedCount'] * $nights;
        }

        $subtotal = $basePrice + $extraBedPrice;
        $totalPrice = $subtotal;
        $discountAmount = 0;
        $couponId = null;

        // Fetch Hotel details for snapshot
        $hotelModel = new \Diafat\Models\Hotel();
        $hotel = $hotelModel->findById($room['hotelId']);
        
        // 🚀 Populate Snapshot Data (Prevent Voucher Changes)
        $data['bookedRoomName'] = $room['name'];
        $data['bookedView'] = $room['view'];
        $data['bookedBedding'] = $room['beds']; // Mapping 'beds' col to 'bookedBedding'
        $data['bookedBoardBasis'] = $room['mealPlan'];
        $data['bookedExtraBedPrice'] = $room['extraBedPrice'];
        $data['bookedHotelName'] = $hotel['name'] ?? 'Unknown Hotel';
        $data['bookedHotelAddress'] = $hotel['city'] ?? 'Unknown Address'; // Using city as address per current logic

        // 2. Apply Coupon if provided
        if (!empty($data['promoCode'])) {
            $couponModel = new \Diafat\Models\Coupon();
            $coupon = $couponModel->findByCode($data['promoCode']);

            if ($coupon && $coupon['isActive'] && $coupon['usedCount'] < $coupon['limit']) {
                // Check Hotel Restriction
                if (empty($coupon['hotelId']) || $coupon['hotelId'] === $room['hotelId']) {
                    $discountPercent = $coupon['discount'];
                    $discountAmount = ($subtotal * $discountPercent) / 100;
                    $totalPrice = $subtotal - $discountAmount;
                    $couponId = $coupon['id'];
                }
            }
        }

        // Prepare Final Data
        $data['subtotal'] = $subtotal;
        $data['totalPrice'] = $totalPrice;
        $data['discountAmount'] = $discountAmount;
        $data['couponId'] = $couponId;
        $data['status'] = Booking::STATUS_PENDING;
        $data['paymentStatus'] = Booking::PAYMENT_UNPAID;

        try {
            $booking = $bookingModel->create($data);

            // 🚀 Trigger Notification for Admin
            $hotelModel = new \Diafat\Models\Hotel();
            $hotel = $hotelModel->findById($room['hotelId']);
            $hotelName = $hotel ? $hotel['name'] : 'فندق غير معروف';

            $notificationModel = new \Diafat\Models\Notification();
            $notificationModel->create(
                'BOOKING_NEW',
                'حجز جديد قيد الانتظار',
                "تم إنشاء حجز جديد بواسطة {$data['guestName']} في {$hotelName}",
                ['bookingId' => $booking['id'], 'hotelId' => $room['hotelId']]
            );

            return $this->success($booking, 'Booking created successfully', 201);
        } catch (\Exception $e) {
            $this->logError("Booking failed", ['userId' => $user->sub, 'error' => $e->getMessage()]);
            return $this->error('Booking failed: ' . $e->getMessage(), 500);
        }
    }

    public function show($params) {
        $id = $params['id'] ?? null;
        if (!$id) return $this->error('ID required', 400);

        $user = $this->authenticate();
        if (!$user) return $this->error('Unauthorized access to security document', 401);

        $bookingModel = new Booking();
        $booking = $bookingModel->findById($id);

        if (!$booking) return $this->error('Booking not found', 404);

        // 🛡️ Zero-Trust Authorization check
        $isAdmin = in_array($user->role ?? '', ['ADMIN', 'SUPER_ADMIN']);
        if (!$isAdmin && $booking['userId'] !== $user->sub) {
            $this->logError("Security Breach Attempt", ['userId' => $user->sub, 'bookingId' => $id]);
            return $this->error('Forbidden - Unauthorized access', 403);
        }

        // 🔐 Cryptographic Integrity Signature (HMAC)
        // We use a multi-factor payload to prevent replay or swap attacks
        $payload = implode('|', [
            $booking['id'],
            $booking['totalPrice'],
            $booking['guestEmail'],
            $booking['createdAt']
        ]);
        $secret = $_ENV['JWT_SECRET'] ?? 'secure_pepper_2026';
        $booking['securityHash'] = hash_hmac('sha256', $payload, $secret);

        return $this->success($booking, 'Booking retrieved');
    }

    public function index() {
        $this->validateAdmin();
        $bookingModel = new Booking();
        $bookings = $bookingModel->findAll();
        return $this->success($bookings, 'All bookings retrieved');
    }

    public function myBookings() {
        $user = $this->authenticate();
        if (!$user) {
            return $this->error('Unauthorized', 401);
        }

        $bookingModel = new Booking();
        $bookings = $bookingModel->findByUser($user->sub);
        return $this->success($bookings, 'My bookings retrieved');
    }

    public function updateStatus($params) {
        $user = $this->authenticate();
        if (!$user) return $this->error('Unauthorized', 401);
        
        $id = $params['id'] ?? null;
        if (!$id) return $this->error('ID required', 400);

        $bookingModel = new Booking();
        $booking = $bookingModel->findById($id);

        if (!$booking) return $this->error('Booking not found', 404);

        $isAdmin = in_array($user->role, ['ADMIN', 'SUPER_ADMIN']);
        if (!$isAdmin && $booking['userId'] !== $user->sub) {
            return $this->error('Forbidden - You do not own this booking', 403);
        }

        $data = $this->getInput();
        $status = $data['status'] ?? null;

        if (!$status) return $this->error('Status required', 400);

        $bookingModel->updateStatus($id, $status);
        return $this->success([], 'Status updated successfully');
    }

    public function cancel($params) {
        $user = $this->authenticate();
        if (!$user) return $this->error('Unauthorized', 401);

        $id = $params['id'] ?? null;
        if (!$id) return $this->error('ID required', 400);

        $bookingModel = new Booking();
        $booking = $bookingModel->findById($id);

        if (!$booking) return $this->error('Booking not found', 404);

        $isAdmin = in_array($user->role, ['ADMIN', 'SUPER_ADMIN']);
        if (!$isAdmin && $booking['userId'] !== $user->sub) {
            return $this->error('Forbidden - You do not own this booking', 403);
        }

        $bookingModel->cancel($id);
        return $this->success([], 'Booking cancelled successfully');
    }
}
