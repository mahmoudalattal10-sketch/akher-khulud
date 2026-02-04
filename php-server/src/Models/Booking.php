<?php

namespace Diafat\Models;

use Diafat\Config\Database;
use PDO;
use Ramsey\Uuid\Uuid;

class Booking {
    private $pdo;
    
    // Status Constants
    const STATUS_PENDING   = 'PENDING';
    const STATUS_CONFIRMED = 'CONFIRMED';
    const STATUS_CANCELLED = 'CANCELLED';
    const STATUS_COMPLETED = 'COMPLETED';
    const STATUS_FAILED    = 'FAILED';

    // Payment Status Constants
    const PAYMENT_UNPAID   = 'UNPAID';
    const PAYMENT_PAID     = 'PAID';
    const PAYMENT_REFUNDED = 'REFUNDED';

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function checkAvailability($roomId, $count = 1) {
        $stmt = $this->pdo->prepare("SELECT availableStock FROM Room WHERE id = :id FOR UPDATE");
        $stmt->execute([':id' => $roomId]);
        $room = $stmt->fetch();
        
        if (!$room) return false;
        return $room['availableStock'] >= $count;
    }

    public function updateRoomStock($roomId, $count) {
        $stmt = $this->pdo->prepare("UPDATE Room SET availableStock = availableStock - :count WHERE id = :id AND availableStock >= :required_stock");
        return $stmt->execute([':count' => $count, ':id' => $roomId, ':required_stock' => $count]);
    }

    private function parseDate($dateStr) {
        try {
            // Handle ISO 8601 (2026-02-01T21:59:39.005Z)
            if (strpos($dateStr, 'T') !== false) {
                $date = new \DateTime($dateStr);
                return $date->format('Y-m-d H:i:s');
            }
            // Handle Unix Timestamp
            if (is_numeric($dateStr)) {
                return date('Y-m-d H:i:s', $dateStr);
            }
            // Fallback
            $date = new \DateTime($dateStr);
            return $date->format('Y-m-d H:i:s');
        } catch (\Exception $e) {
            // Last resort: simple date if all else fails
            return date('Y-m-d H:i:s', strtotime($dateStr));
        }
    }

    public function create($data) {
        $id = Uuid::uuid4()->toString();
        
        // Initial check without lock (controller will call this anyway)
        if (!$this->checkAvailability($data['roomId'], $data['roomCount'] ?? 1)) {
            throw new \Exception("Requested room count is not available");
        }

        $sql = "INSERT INTO Booking (
            id, checkIn, checkOut, subtotal, totalPrice, discountAmount, 
            status, paymentStatus, userId, roomId, guestsCount, roomCount, 
            extraBedCount, guestName, guestEmail, guestPhone, nationality, specialRequests,
            bookedRoomName, bookedHotelName, bookedHotelAddress, bookedBoardBasis, 
            bookedView, bookedBedding, bookedExtraBedPrice,
            createdAt, updatedAt
        ) VALUES (
            :id, :checkIn, :checkOut, :subtotal, :totalPrice, :discountAmount, 
            :status, :paymentStatus, :userId, :roomId, :guestsCount, :roomCount, 
            :extraBedCount, :guestName, :guestEmail, :guestPhone, :nationality, :specialRequests,
            :bookedRoomName, :bookedHotelName, :bookedHotelAddress, :bookedBoardBasis, 
            :bookedView, :bookedBedding, :bookedExtraBedPrice,
            NOW(3), NOW(3)
        )";
        
        $stmt = $this->pdo->prepare($sql);

        $stmt->execute([
            ':id' => $id,
            ':checkIn' => $this->parseDate($data['checkIn']),
            ':checkOut' => $this->parseDate($data['checkOut']),
            ':subtotal' => $data['subtotal'] ?? 0,
            ':totalPrice' => $data['totalPrice'],
            ':discountAmount' => $data['discountAmount'] ?? 0,
            ':status' => self::STATUS_PENDING,
            ':paymentStatus' => self::PAYMENT_UNPAID,
            ':userId' => $data['userId'],
            ':roomId' => $data['roomId'],
            ':guestsCount' => $data['guestsCount'],
            ':roomCount' => $data['roomCount'] ?? 1,
            ':extraBedCount' => $data['extraBedCount'] ?? 0,
            ':guestName' => $data['guestName'] ?? null,
            ':guestEmail' => $data['guestEmail'] ?? null,
            ':guestPhone' => $data['guestPhone'] ?? null,
            ':nationality' => $data['nationality'] ?? null,
            ':specialRequests' => $data['specialRequests'] ?? null,
            ':bookedRoomName' => $data['bookedRoomName'] ?? null,
            ':bookedHotelName' => $data['bookedHotelName'] ?? null,
            ':bookedHotelAddress' => $data['bookedHotelAddress'] ?? null,
            ':bookedBoardBasis' => $data['bookedBoardBasis'] ?? null,
            ':bookedView' => $data['bookedView'] ?? null,
            ':bookedBedding' => $data['bookedBedding'] ?? null,
            ':bookedExtraBedPrice' => $data['bookedExtraBedPrice'] ?? 0
        ]);

        return $this->findById($id);
    }

    public function findById($id) {
        // Use COALESCE to prefer Snapshot data (b.booked...) over Live data (r/h...)
        // Fallback for old bookings: use live data
        $sql = "SELECT b.*, 
                COALESCE(b.bookedHotelName, h.name) as hotelName, 
                h.nameEn as hotelNameEn, 
                COALESCE(b.bookedHotelAddress, h.city) as hotelCity, 
                COALESCE(b.bookedHotelAddress, h.city) as hotelAddress, 
                h.locationEn as hotelAddressEn, 
                COALESCE(b.bookedRoomName, r.name) as roomName, 
                COALESCE(b.bookedBoardBasis, r.mealPlan) as mealPlan, 
                COALESCE(b.bookedView, r.view) as view, 
                COALESCE(b.bookedBedding, r.beds) as beds, 
                r.capacity, 
                COALESCE(b.bookedExtraBedPrice, r.extraBedPrice) as extraBedPrice, 
                u.name as userName, c.code as couponCode, c.discount as couponDiscount
                FROM Booking b
                LEFT JOIN Room r ON b.roomId = r.id
                LEFT JOIN Hotel h ON r.hotelId = h.id
                LEFT JOIN User u ON b.userId = u.id
                LEFT JOIN Coupon c ON b.couponId = c.id
                WHERE b.id = :id 
                LIMIT 1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
        $booking = $stmt->fetch();
        if ($booking) {
            $booking = $this->formatBooking($booking);
        }
        return $booking;
    }

    private function formatBooking($booking) {
        $floatFields = ['subtotal', 'totalPrice', 'discountAmount'];
        foreach ($floatFields as $field) {
            if (isset($booking[$field])) $booking[$field] = (float)$booking[$field];
        }
        $intFields = ['guestsCount', 'roomCount', 'extraBedCount'];
        foreach ($intFields as $field) {
            if (isset($booking[$field])) $booking[$field] = (int)$booking[$field];
        }

        // Nest Room and Hotel data for Frontend
        if (isset($booking['roomName'])) {
            $booking['room'] = [
                'id' => $booking['roomId'] ?? null,
                'name' => $booking['roomName'],
                'mealPlan' => $booking['mealPlan'] ?? null,
                'view' => $booking['view'] ?? null,
                'beds' => $booking['beds'] ?? null,
                'capacity' => (int)($booking['capacity'] ?? 0),
                'extraBedPrice' => (float)($booking['extraBedPrice'] ?? 0),
                'hotel' => [
                    'id' => $booking['hotelId'] ?? null,
                    'name' => $booking['hotelName'] ?? null,
                    'image' => $booking['hotelImage'] ?? null,
                    'city' => $booking['hotelCity'] ?? null,
                    'slug' => $booking['hotelSlug'] ?? null
                ]
            ];
        }

        // Format Coupon object if fields exist
        if (!empty($booking['couponCode'])) {
            $booking['coupon'] = [
                'code' => $booking['couponCode'],
                'discount' => (float)($booking['couponDiscount'] ?? 0)
            ];
        }

        return $booking;
    }

    public function findAll() {
        $sql = "SELECT b.*, h.name as hotelName, h.image as hotelImage, h.slug as hotelSlug, h.city as hotelCity, h.id as hotelId, r.name as roomName, u.name as userName, c.code as couponCode, c.discount as couponDiscount
                FROM Booking b
                LEFT JOIN Room r ON b.roomId = r.id
                LEFT JOIN Hotel h ON r.hotelId = h.id
                LEFT JOIN User u ON b.userId = u.id
                LEFT JOIN Coupon c ON b.couponId = c.id
                ORDER BY b.createdAt DESC";
        $stmt = $this->pdo->query($sql);
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'formatBooking'], $bookings);
    }

    public function findByUser($userId) {
        $sql = "SELECT b.*, h.name as hotelName, h.image as hotelImage, h.slug as hotelSlug, h.city as hotelCity, h.id as hotelId, r.name as roomName, u.name as userName, c.code as couponCode, c.discount as couponDiscount
                FROM Booking b
                LEFT JOIN Room r ON b.roomId = r.id
                LEFT JOIN Hotel h ON r.hotelId = h.id
                LEFT JOIN User u ON b.userId = u.id
                LEFT JOIN Coupon c ON b.couponId = c.id
                WHERE b.userId = :userId 
                ORDER BY b.createdAt DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':userId' => $userId]);
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'formatBooking'], $bookings);
    }

    public function updateStatus($id, $status) {
        return $this->pdo->prepare("UPDATE Booking SET status = :status, updatedAt = NOW(3) WHERE id = :id")->execute([
            ':id' => $id,
            ':status' => $status
        ]);
    }

    public function cancel($id) {
        return $this->pdo->prepare("UPDATE Booking SET status = 'CANCELLED' WHERE id = :id")->execute([':id' => $id]);
    }
}
