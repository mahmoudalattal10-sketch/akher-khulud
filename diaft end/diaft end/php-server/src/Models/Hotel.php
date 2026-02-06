<?php

namespace Diafat\Models;

use Diafat\Config\Database;
use PDO;
use Ramsey\Uuid\Uuid;

class Hotel {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function findAll($filters = []) {
        // [UPDATED] Include lowest room price calculation directly in main query
        $sql = "SELECT h.*, (
            SELECT MIN(price) FROM Room r_min 
            WHERE r_min.hotelId = h.id 
            AND r_min.isVisible = 1 
            AND r_min.availableStock > 0
        ) as calculatedMinPrice, (
            SELECT MAX(availableStock) FROM Room r_stock
            WHERE r_stock.hotelId = h.id
            AND r_stock.isVisible = 1
        ) as totalAvailableStock FROM Hotel h";
        $params = [];
        $conditions = [];

        // Visibility Filter (Default: Visible only, unless adminView is active)
        if (empty($filters['adminView'])) {
            $conditions[] = "isVisible = 1";
        }

        if (!empty($filters['city'])) {
            $city = $filters['city'];
            // Broader matching:
            // 1. Exact match (ID or Label)
            // 2. Predefined label match
            // 3. Partial match for Arabic names (LIKE)
            $conditions[] = "(h.city = :city OR h.city = :cityLabel OR h.city LIKE :cityLike)";
            $params[':city'] = $city;
            
            // Predefined Mapping for common city IDs to Arabic Labels
            $labels = [
                'makkah' => 'مكة المكرمة',
                'madinah' => 'المدينة المنورة',
                'jeddah' => 'جدة',
                'riyadh' => 'الرياض',
                'khobar' => 'الخبر',
                'dammam' => 'الدمام',
                'abha' => 'أبها',
                'dubai' => 'دبي',
                'abu_dhabi' => 'أبوظبي',
                'doha' => 'الدوحة',
                'kuwait_city' => 'مدينة الكويت',
                'muscat' => 'مسقط',
                'cairo' => 'القاهرة',
                'alexandria' => 'الإسكندرية',
                'sharm_el_sheikh' => 'شرم الشيخ',
                'hurghada' => 'الغردقة',
                'amman' => 'عمان',
                'aqaba' => 'العقبة'
            ];
            $params[':cityLabel'] = $labels[$city] ?? $city;
            $params[':cityLike'] = '%' . $city . '%';
        }

        if (!empty($filters['featured'])) {
            $conditions[] = "isFeatured = 1";
        }

        if (!empty($filters['offer'])) {
            $conditions[] = "isOffer = 1";
        }

        // Date Availability Filter (Overlap check for Partial Period feature)
        if (empty($filters['adminView']) && !empty($filters['checkIn']) && !empty($filters['checkOut'])) {
            // Include hotels that have at least one room with ANY overlap in the requested range AND stock > 0
            $conditions[] = "EXISTS (
                SELECT 1 FROM Room r 
                JOIN PricingPeriod pp ON r.id = pp.roomId
                WHERE r.hotelId = h.id 
                AND r.isVisible = 1
                AND r.availableStock > 0
                AND (:guests_Overlap IS NULL OR (
                    r.capacity <= :guests_Overlap_In AND 
                    (r.capacity + (CASE WHEN r.allowExtraBed = 1 THEN r.maxExtraBeds ELSE 0 END)) >= :guests_Overlap_Out
                ))
                AND pp.startDate < :checkOut_Where 
                AND pp.endDate > :checkIn_Where
            )";
            $ci = $this->normalizeDate($filters['checkIn']);
            $co = $this->normalizeDate($filters['checkOut']);
            $guests = !empty($filters['guests']) ? (int)$filters['guests'] : null;

            // Detect if it's a Partial Match (no room covers the FULL range, but some overlap exists)
            $sql = str_replace("FROM Hotel h", ", (
                SELECT CASE 
                    WHEN :checkIn_NullCheck IS NULL THEN 0
                    WHEN EXISTS (
                        SELECT 1 FROM Room r3 
                        JOIN PricingPeriod pp3 ON r3.id = pp3.roomId
                        WHERE r3.hotelId = h.id 
                        AND r3.isVisible = 1
                        AND r3.availableStock > 0
                        AND (:guests_Full IS NULL OR (
                            r3.capacity <= :guests_Full_In AND 
                            (r3.capacity + (CASE WHEN r3.allowExtraBed = 1 THEN r3.maxExtraBeds ELSE 0 END)) >= :guests_Full_Out
                        ))
                        AND pp3.startDate <= :checkIn_Full AND pp3.endDate >= :checkOut_Full
                    ) THEN 0 
                    WHEN EXISTS (
                        SELECT 1 FROM Room r4 
                        JOIN PricingPeriod pp4 ON r4.id = pp4.roomId
                        WHERE r4.hotelId = h.id 
                        AND r4.isVisible = 1
                        AND r4.availableStock > 0
                        AND (:guests_Part IS NULL OR (
                            r4.capacity <= :guests_Part_In AND 
                            (r4.capacity + (CASE WHEN r4.allowExtraBed = 1 THEN r4.maxExtraBeds ELSE 0 END)) >= :guests_Part_Out
                        ))
                        AND pp4.startDate < :checkOut_Part AND pp4.endDate > :checkIn_Part
                    ) THEN 1
                    ELSE 0
                END
            ) as partialMatch, (
                SELECT MIN(pp.price + (CASE WHEN :guests_Price_Add > r2.capacity THEN (:guests_Price_Extra - r2.capacity) * r2.extraBedPrice ELSE 0 END)) 
                FROM Room r2 
                JOIN PricingPeriod pp ON r2.id = pp.roomId 
                WHERE r2.hotelId = h.id AND r2.isVisible = 1 
                AND r2.availableStock > 0
                AND (:guests_Price IS NULL OR (
                    r2.capacity <= :guests_Price_In AND 
                    (r2.capacity + (CASE WHEN r2.allowExtraBed = 1 THEN r2.maxExtraBeds ELSE 0 END)) >= :guests_Price_Out
                ))
                AND pp.startDate < :checkOut_Price AND pp.endDate > :checkIn_Price
            ) as dynamicPrice FROM Hotel h", $sql);

            $params[':checkIn_Where'] = $ci;
            $params[':checkOut_Where'] = $co;
            $params[':guests_Overlap'] = $guests;
            $params[':guests_Overlap_In'] = $guests;
            $params[':guests_Overlap_Out'] = $guests;

            $params[':checkIn_NullCheck'] = $ci;
            $params[':guests_Full'] = $guests;
            $params[':guests_Full_In'] = $guests;
            $params[':guests_Full_Out'] = $guests;
            $params[':checkIn_Full'] = $ci;
            $params[':checkOut_Full'] = $co;

            $params[':guests_Part'] = $guests;
            $params[':guests_Part_In'] = $guests;
            $params[':guests_Part_Out'] = $guests;
            $params[':checkIn_Part'] = $ci;
            $params[':checkOut_Part'] = $co;

            $params[':guests_Price_Add'] = $guests;
            $params[':guests_Price_Extra'] = $guests;
            $params[':guests_Price'] = $guests;
            $params[':guests_Price_In'] = $guests;
            $params[':guests_Price_Out'] = $guests;
            $params[':checkIn_Price'] = $ci;
            $params[':checkOut_Price'] = $co;
        } else if (empty($filters['adminView'])) {
            // [RELAXED] General Visibility Logic: Just ensure the hotel is set to visible.
            // Previously this required at least one priced room with stock, which hid "Sold Out" hotels.
            $conditions[] = "isVisible = 1";
        }

        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }
        
        $sql .= " ORDER BY createdAt DESC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $hotels = $stmt->fetchAll();

        if (empty($hotels)) return [];

        $hotelIds = array_column($hotels, 'id');
        
        // Batch Load Images
        $allImages = $this->batchGetImages($hotelIds);
        
        // Batch Load Amenities
        $allAmenities = $this->batchGetAmenities($hotelIds);

        // Batch Load Rooms (Only for Admin View or if explicitly requested)
        $allRooms = [];
        // [FIX] Always load rooms if adminView to ensure dashboard has data
        if (!empty($filters['adminView'])) { 
             $allRooms = $this->batchGetRooms($hotelIds);
        }

        foreach ($hotels as &$hotel) {
            $hotel['images'] = $allImages[$hotel['id']] ?? [];
            $hotel['amenities'] = $allAmenities[$hotel['id']] ?? [];
            
            // Format basic hotel data first
            $hotel = $this->formatHotelSimple($hotel);
            
            // Attach rooms if loaded
            if (!empty($filters['adminView'])) {
                 $hotelRooms = $allRooms[$hotel['id']] ?? [];
                 // Format rooms
                 foreach ($hotelRooms as &$room) {
                     $room = $this->formatRoom($room);
                     // Fetch room details for admin correctness (though expensive, it's safer)
                     $room['features'] = $this->getRoomFeatures($room['id']);
                     $room['images'] = $this->getRoomImages($room['id']);
                     $room['pricingPeriods'] = $this->getPricingPeriods($room['id']);
                 }
                 $hotel['rooms'] = $hotelRooms;
            }

            // [NEW] Attach Partial Metadata for specific date searches (Public View)
            if (!empty($filters['checkIn']) && !empty($filters['checkOut'])) {
                // If rooms aren't already loaded (which is typical for public list view)
                if (empty($hotel['rooms'])) {
                    $meta = $this->getPartialPeriodMetadata($hotel['id'], $filters['checkIn'], $filters['checkOut']);
                    if ($meta) {
                        // Embed in a mock room structure to satisfy frontend "get from rooms" requirement
                        // [FIX] Add isPartial flag and normalize dates
                        $hotel['rooms'] = [
                            [
                                'id' => 'partial-match-room',
                                'partialMetadata' => [
                                    'isPartial' => true,
                                    'availableFrom' => $this->normalizeDate($meta['availableFrom']),
                                    'availableTo' => $this->normalizeDate($meta['availableTo'])
                                ]
                            ]
                        ];
                    }
                }
            }
        }

        return $hotels;
    }

    private function getPartialPeriodMetadata($hotelId, $checkIn, $checkOut) {
        $sql = "SELECT pp.startDate as availableFrom, pp.endDate as availableTo 
                FROM PricingPeriod pp
                JOIN Room r ON pp.roomId = r.id
                WHERE r.hotelId = :hotelId
                AND r.isVisible = 1
                AND r.availableStock > 0
                AND pp.startDate < :checkOut AND pp.endDate > :checkIn
                ORDER BY pp.startDate ASC 
                LIMIT 1";
                
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':hotelId' => $hotelId,
            ':checkIn' => $checkIn,
            ':checkOut' => $checkOut
        ]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    private function batchGetRooms($hotelIds) {
        if (empty($hotelIds)) return [];
        $placeholders = implode(',', array_fill(0, count($hotelIds), '?'));
        // Fetch all ACTIVE rooms for these hotels. 
        // Admin dashboard uses this, and we should respect the isVisible=0 (soft-delete) behavior.
        $stmt = $this->pdo->prepare("SELECT * FROM Room WHERE isVisible = 1 AND hotelId IN ($placeholders)");
        $stmt->execute($hotelIds);
        $rooms = $stmt->fetchAll();
        
        $grouped = [];
        foreach ($rooms as $room) {
            $grouped[$room['hotelId']][] = $room;
        }
        return $grouped;
    }
    
    private function formatRoom($room) {
        $room['isVisible'] = (bool)$room['isVisible'];
        $room['sofa'] = (bool)$room['sofa'];
        $room['allowExtraBed'] = (bool)$room['allowExtraBed'];
        $room['price'] = (float)$room['price'];
        $room['extraBedPrice'] = (float)($room['extraBedPrice'] ?? 0);
        $room['capacity'] = (int)$room['capacity'];
        $room['maxExtraBeds'] = (int)($room['maxExtraBeds'] ?? 1);
        $room['availableStock'] = (int)$room['availableStock'];
        $room['area'] = (float)($room['area'] ?? 0);
        return $room;
    }

    private function getPricingPeriods($roomId) {
        $stmt = $this->pdo->prepare("SELECT * FROM PricingPeriod WHERE roomId = :roomId");
        $stmt->execute([':roomId' => $roomId]);
        return $stmt->fetchAll();
    }

    private function batchGetImages($hotelIds) {
        $placeholders = implode(',', array_fill(0, count($hotelIds), '?'));
        $stmt = $this->pdo->prepare("SELECT hotelId, url FROM HotelImage WHERE hotelId IN ($placeholders)");
        $stmt->execute($hotelIds);
        $rows = $stmt->fetchAll();
        
        $grouped = [];
        foreach ($rows as $row) {
            $grouped[$row['hotelId']][] = $row['url'];
        }
        return $grouped;
    }

    private function batchGetAmenities($hotelIds) {
        $placeholders = implode(',', array_fill(0, count($hotelIds), '?'));
        $sql = "SELECT ha.hotelId, a.name FROM Amenity a 
                JOIN HotelAmenity ha ON a.id = ha.amenityId 
                WHERE ha.hotelId IN ($placeholders)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($hotelIds);
        $rows = $stmt->fetchAll();
        
        $grouped = [];
        foreach ($rows as $row) {
            $grouped[$row['hotelId']][] = $row['name'];
        }
        return $grouped;
    }

    private function formatHotelSimple($hotel) {
        // Coords - Handle 0,0 gracefully
        $lat = floatval($hotel['lat'] ?? 0);
        $lng = floatval($hotel['lng'] ?? 0);
        
        // Return actual values even if 0, frontend filters them now. 
        // Or strictly set to null if 0 to be cleaner? Let's keep data raw but typed.
        $hotel['coords'] = [$lat, $lng];
        $hotel['lat'] = $lat;
        $hotel['lng'] = $lng;

        // Booleans
        $boolFields = ['isOffer', 'isFeatured', 'hasFreeBreakfast', 'hasFreeTransport', 'isVisible', 'partialMatch'];
        foreach ($boolFields as $field) {
            $hotel[$field] = (bool)($hotel[$field] ?? false);
        }
        
        // Numbers
        $floatFields = ['rating', 'basePrice', 'price'];
        foreach ($floatFields as $field) {
            if (isset($hotel[$field])) $hotel[$field] = (float)$hotel[$field];
        }

        // Apply Dynamic Search Price if available
        if (!empty($hotel['dynamicPrice']) && (float)$hotel['dynamicPrice'] > 0) {
            $hotel['basePrice'] = (float)$hotel['dynamicPrice'];
        } 
        // [NEW] Else, fallback to the calculated minimum room price (lowest available)
        elseif (!empty($hotel['calculatedMinPrice']) && (float)$hotel['calculatedMinPrice'] > 0) {
            $hotel['basePrice'] = (float)$hotel['calculatedMinPrice'];
        }

        $intFields = ['reviews', 'extraBedStock', 'distanceFromHaram', 'totalAvailableStock'];
        foreach ($intFields as $field) {
            if (isset($hotel[$field])) $hotel[$field] = (int)$hotel[$field];
        }

        return $hotel;
    }

    public function findBySlug($slug, $filters = []) {
        $params = [':slug' => $slug];
        $sql = "SELECT h.* FROM Hotel h WHERE h.slug = :slug";
        if (empty($filters['adminView'])) {
            $sql .= " AND h.isVisible = 1";
        }
        $sql .= " LIMIT 1";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $hotel = $stmt->fetch();

        if ($hotel) {
            $hotel = $this->formatHotel($hotel);
            $hotel['rooms'] = $this->getRooms($hotel['id'], $filters);
            
            // Calculate partialMatch for individual hotel view
            if (!empty($filters['checkIn'])) {
                $hasFull = false;
                foreach($hotel['rooms'] as $room) {
                    if (isset($room['partialMetadata']) && !$room['partialMetadata']['isPartial']) {
                        $hasFull = true;
                        break;
                    }
                }
                $hotel['partialMatch'] = $hotel['rooms'] ? !$hasFull : false;
            }
            
            $hotel['nearbyLandmarks'] = $this->getLandmarks($hotel['id']);
        }

        return $hotel;
    }

    public function findById($id, $filters = []) {
        $params = [':id' => $id];
        $sql = "SELECT h.* FROM Hotel h WHERE h.id = :id";
        if (empty($filters['adminView'])) {
            $sql .= " AND h.isVisible = 1";
        }
        $sql .= " LIMIT 1";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $hotel = $stmt->fetch();

        if ($hotel) {
            $hotel = $this->formatHotel($hotel);
            $hotel['rooms'] = $this->getRooms($hotel['id'], $filters);
            
            // Calculate partialMatch
            if (!empty($filters['checkIn'])) {
                $hasFull = false;
                foreach($hotel['rooms'] as $room) {
                    if (isset($room['partialMetadata']) && !$room['partialMetadata']['isPartial']) {
                        $hasFull = true;
                        break;
                    }
                }
                $hotel['isPartial'] = !$hasFull;
            }
            $hotel['nearbyLandmarks'] = $this->getLandmarks($hotel['id']);
        }

        return $hotel;
    }

    public function findByIds($ids) {
        if (empty($ids)) return [];
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        // Ensure we only get active hotels
        $sql = "SELECT * FROM Hotel WHERE id IN ($placeholders) AND isVisible = 1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($ids);
        $hotels = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($hotels)) return [];

        // 🚀 Optimization: Batch Load Relations to avoid N+1 Queries
        $foundIds = array_column($hotels, 'id');
        $allImages = $this->batchGetImages($foundIds);
        $allAmenities = $this->batchGetAmenities($foundIds);

        foreach ($hotels as &$hotel) {
            $hotel['images'] = $allImages[$hotel['id']] ?? [];
            $hotel['amenities'] = $allAmenities[$hotel['id']] ?? [];
            
            // Use simple formatter which handles type casting but assumes relations are manually attached
            // (Same efficient path used by findAll)
            $hotel = $this->formatHotelSimple($hotel);
        }

        return $hotels;
    }

    private function formatHotel($hotel) {
        // 1. Images (Array of strings for compatibility, or array of objects?)
        // Frontend 'images' in Hotel type says string[], but also checks HotelImage relation.
        // Let's check api.ts: image: string; images: string[];
        // But getImages returns rows. Let's map to urls.
        $imgs = $this->getImages($hotel['id']);
        $hotel['images'] = array_map(function($img) { return $img['url']; }, $imgs);
        
        // 2. Coords lat/lng -> [lat, lng] for frontend compatibility
        $hotel['coords'] = [floatval($hotel['lat'] ?? 0), floatval($hotel['lng'] ?? 0)];
        $hotel['lat'] = floatval($hotel['lat'] ?? 0);
        $hotel['lng'] = floatval($hotel['lng'] ?? 0);

        // 3. Amenities (Objects -> Strings)
        $amenities = $this->getAmenities($hotel['id']);
        $hotel['amenities'] = array_map(function($a) { return $a['name']; }, $amenities);

        // 4. Booleans (MySQL returns 0/1, PHP needs bool for JSON)
        $boolFields = ['isOffer', 'isFeatured', 'hasFreeBreakfast', 'hasFreeTransport', 'isVisible', 'partialMatch'];
        foreach ($boolFields as $field) {
            $hotel[$field] = (bool)($hotel[$field] ?? false);
        }
        
        // 5. Numbers
        $floatFields = ['rating', 'basePrice', 'price']; // price might not exist in row
        foreach ($floatFields as $field) {
            if (isset($hotel[$field])) $hotel[$field] = (float)$hotel[$field];
        }
        $intFields = ['reviews', 'extraBedStock'];
        foreach ($intFields as $field) {
            if (isset($hotel[$field])) $hotel[$field] = (int)$hotel[$field];
        }

        return $hotel;
    }

    private function getImages($hotelId) {
        $stmt = $this->pdo->prepare("SELECT url, caption, isMain FROM HotelImage WHERE hotelId = :hotelId");
        $stmt->execute([':hotelId' => $hotelId]);
        return $stmt->fetchAll();
    }

    private function getAmenities($hotelId) {
        $sql = "SELECT a.name FROM Amenity a 
                JOIN HotelAmenity ha ON a.id = ha.amenityId 
                WHERE ha.hotelId = :hotelId";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':hotelId' => $hotelId]);
        return $stmt->fetchAll();
    }

    private function getRooms($hotelId, $filters = []) {
        // [FIX] Always respect isVisible = 1, even for admin view, to honor soft-deletes (Room Deletion Fix)
        $sql = "SELECT * FROM Room WHERE hotelId = :hotelId AND isVisible = 1";
        $params = [':hotelId' => $hotelId];

        // Strict Stock Check for public view
        if (empty($filters['adminView'])) {
            $sql .= " AND availableStock > 0";
            
            // If no search dates, still ensure it has some future pricing
            if (empty($filters['checkIn'])) {
                $sql .= " AND id IN (SELECT roomId FROM PricingPeriod WHERE endDate >= NOW())";
            }
        }

        // Filter rooms by availability (Overlap for Partial Period)
        if (!empty($filters['checkIn']) && !empty($filters['checkOut'])) {
            $sql .= " AND id IN (
                SELECT roomId FROM PricingPeriod 
                WHERE startDate < :checkOut AND endDate > :checkIn
            )";
            $params[':checkIn'] = $filters['checkIn'];
            $params[':checkOut'] = $filters['checkOut'];
        }

        // Search Guest / Capacity Filter
        if (!empty($filters['guests'])) {
            $guests = (int)$filters['guests'];
            $sql .= " AND capacity <= :guests_In 
                      AND (capacity + (CASE WHEN allowExtraBed = 1 THEN maxExtraBeds ELSE 0 END)) >= :guests_Out";
            $params[':guests_In'] = $guests;
            $params[':guests_Out'] = $guests;
        }

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $rooms = $stmt->fetchAll();
        
        // Format Rooms
        foreach ($rooms as &$room) {
            $room['isVisible'] = (bool)$room['isVisible'];
            $room['sofa'] = (bool)$room['sofa'];
            $room['allowExtraBed'] = (bool)$room['allowExtraBed'];
            $room['price'] = (float)$room['price'];
            $room['extraBedPrice'] = (float)($room['extraBedPrice'] ?? 0);
            $room['capacity'] = (int)$room['capacity'];
            $room['maxExtraBeds'] = (int)($room['maxExtraBeds'] ?? 1);
            $room['availableStock'] = (int)$room['availableStock'];
            // Features separate table? Or comma separated?
            // Schema has RoomFeature table.
            $room['features'] = $this->getRoomFeatures($room['id']);
            $room['images'] = $this->getRoomImages($room['id']);
            $room['pricingPeriods'] = $this->getPricingPeriods($room['id']);
            
            // Apply dynamic price and partial metadata for this specific stay
            if (!empty($filters['checkIn']) && !empty($filters['checkOut'])) {
                $isFullMatch = false;
                $relevantPeriod = null;
                
                // Normalize input dates using Saudi timezone (Asia/Riyadh) for robust comparison
                $ci = $this->normalizeDate($filters['checkIn']);
                $co = $this->normalizeDate($filters['checkOut']);

                $segments = [];
                foreach($room['pricingPeriods'] as $period) {
                    $pStart = $this->normalizeDate($period['startDate']);
                    $pEnd = $this->normalizeDate($period['endDate']);

                    // Check for overlap
                    if ($pStart < $co && $pEnd > $ci) {
                        // Store the first overlapping period as relevant for pricing/metadata
                        if (!$relevantPeriod) $relevantPeriod = $period;

                        // Check if this SINGLE period covers the FULL range
                        if ($pStart <= $ci && $pEnd >= $co) {
                            $isFullMatch = true;
                            $relevantPeriod = $period; // Prefer the full match period
                            break;
                        }

                        // Collect overlapping segments for aggregate coverage check
                        $segments[] = ['start' => $pStart, 'end' => $pEnd];
                    }
                }

                // Check for aggregate coverage (Full stay covered by multiple periods)
                if (!$isFullMatch && !empty($segments)) {
                    $currentEdge = $ci;
                    // Periods are already sorted by startDate in getPricingPeriods
                    foreach ($segments as $seg) {
                        if ($seg['start'] <= $currentEdge) {
                            $currentEdge = max($currentEdge, $seg['end']);
                        }
                    }
                    if ($currentEdge >= $co) {
                        $isFullMatch = true;
                    }
                }

                if ($relevantPeriod) {
                    $basePrice = (float)$relevantPeriod['price'];
                    $finalPrice = $basePrice;

                    // Add extra bed price if guest count exceeds base capacity
                    if (!empty($filters['guests'])) {
                        $guests = (int)$filters['guests'];
                        if ($guests > $room['capacity']) {
                            $extraBedsNeeded = $guests - $room['capacity'];
                            $finalPrice += $extraBedsNeeded * $room['extraBedPrice'];
                        }
                    }

                    $room['price'] = $finalPrice;
                    
                    // Add Partial Metadata if it's not a full match
                    $room['partialMetadata'] = [
                        'isPartial' => (bool)!$isFullMatch,
                        'availableFrom' => $this->normalizeDate($relevantPeriod['startDate']),
                        'availableTo' => $this->normalizeDate($relevantPeriod['endDate'])
                    ];
                }
            }
        }
        return $rooms;
    }

    private function getRoomFeatures($roomId) {
        $stmt = $this->pdo->prepare("SELECT name FROM RoomFeature WHERE roomId = :roomId");
        $stmt->execute([':roomId' => $roomId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    private function getRoomImages($roomId) {
        $stmt = $this->pdo->prepare("SELECT url FROM RoomImage WHERE roomId = :roomId");
        $stmt->execute([':roomId' => $roomId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    private function getLandmarks($hotelId) {
        $stmt = $this->pdo->prepare("SELECT name, distance, icon, type FROM NearbyPlace WHERE hotelId = :hotelId");
        $stmt->execute([':hotelId' => $hotelId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function create($data) {
        $id = Uuid::uuid4()->toString();
        $stmt = $this->pdo->prepare("INSERT INTO Hotel (id, slug, name, nameEn, city, country, location, locationEn, rating, reviews, basePrice, description, image, lat, lng, distanceFromHaram, isVisible, isFeatured, isOffer, coords, hasFreeBreakfast, hasFreeTransport, extraBedStock) VALUES (:id, :slug, :name, :nameEn, :city, :country, :location, :locationEn, :rating, :reviews, :basePrice, :description, :image, :lat, :lng, :distanceFromHaram, :isVisible, :isFeatured, :isOffer, :coords, :hasFreeBreakfast, :hasFreeTransport, :extraBedStock)");
        
        $lat = (float)($data['lat'] ?? 0);
        $lng = (float)($data['lng'] ?? 0);
        $coords = $data['coords'] ?? null;
        if (is_array($coords)) {
            $coords = implode(',', $coords);
        } elseif (!$coords) {
            $coords = "$lat,$lng";
        }

        $stmt->execute([
            ':id' => $id,
            ':slug' => $data['slug'] ?? 'hotel-' . time(),
            ':name' => $data['name'],
            ':nameEn' => $data['nameEn'] ?? $data['name'],
            ':city' => $data['city'],
            ':country' => $data['country'] ?? 'SA',
            ':location' => $data['location'] ?? '',
            ':locationEn' => $data['locationEn'] ?? '',
            ':rating' => (float)($data['rating'] ?? 5),
            ':reviews' => (int)($data['reviews'] ?? 0),
            ':basePrice' => (float)($data['basePrice'] ?? 0),
            ':description' => $data['description'] ?? '',
            ':image' => $data['image'] ?? '',
            ':lat' => $lat,
            ':lng' => $lng,
            ':distanceFromHaram' => (int)($data['distanceFromHaram'] ?? 0),
            ':isVisible' => isset($data['isVisible']) ? (int)$data['isVisible'] : 1,
            ':isFeatured' => isset($data['isFeatured']) ? (int)$data['isFeatured'] : 0,
            ':isOffer' => isset($data['isOffer']) ? (int)$data['isOffer'] : 0,
            ':coords' => $coords,
            ':hasFreeBreakfast' => isset($data['hasFreeBreakfast']) ? (int)$data['hasFreeBreakfast'] : 0,
            ':hasFreeTransport' => isset($data['hasFreeTransport']) ? (int)$data['hasFreeTransport'] : 0,
            ':extraBedStock' => (int)($data['extraBedStock'] ?? 0)
        ]);

        // Sync Amenities
        if (isset($data['amenities']) && is_array($data['amenities'])) {
            $this->syncAmenities($id, $data['amenities']);
        }

        // Sync Nearby Places (Surroundings)
        if (isset($data['nearbyLandmarks']) && is_array($data['nearbyLandmarks'])) {
            $this->syncNearbyPlaces($id, $data['nearbyLandmarks']);
        }

        // Sync Gallery Images [NEW]
        if (isset($data['images']) && is_array($data['images'])) {
            $this->syncHotelImages($id, $data['images']);
        } elseif (isset($data['gallery']) && is_array($data['gallery'])) {
             $this->syncHotelImages($id, $data['gallery']);
        }

        return $id;
    }

    public function update($id, $data) {
        $allowedFields = [
            'slug', 'name', 'nameEn', 'city', 'country', 'location', 'locationEn', 
            'rating', 'reviews', 'basePrice', 'image', 'lat', 'lng', 'coords', 
            'description', 'isOffer', 'isFeatured', 'discount', 'distanceFromHaram', 
            'hasFreeBreakfast', 'hasFreeTransport', 'extraBedStock', 'isVisible', 'view'
        ];
        $fields = [];
        $params = [':id' => $id];
        foreach ($data as $key => $value) {
            if (in_array($key, $allowedFields)) {
                $fields[] = "$key = :$key";
                
                // Type Casting for MySQL consistency
                if (in_array($key, ['isVisible', 'isFeatured', 'isOffer', 'hasFreeBreakfast', 'hasFreeTransport'])) {
                    $value = (int)(bool)$value;
                } elseif (in_array($key, ['lat', 'lng', 'rating', 'basePrice', 'extraBedPrice'])) {
                    $value = (float)($value ?: 0);
                } elseif (in_array($key, ['distanceFromHaram', 'extraBedStock', 'reviews'])) {
                    $value = (int)($value ?: 0);
                }
                
                $params[":$key"] = $value;
            }
        }
        
        if (empty($fields)) return false;
        
        // Ensure :id is safe and not overwritten
        $params[':id'] = $id;
        
        $sql = "UPDATE Hotel SET " . implode(', ', $fields) . " WHERE id = :id";
        $success = $this->pdo->prepare($sql)->execute($params);

        if ($success) {
            // Sync Amenities
            if (isset($data['amenities']) && is_array($data['amenities'])) {
                $this->syncAmenities($id, $data['amenities']);
            }

            // Sync Nearby Places (Surroundings)
            if (isset($data['nearbyLandmarks']) && is_array($data['nearbyLandmarks'])) {
                $this->syncNearbyPlaces($id, $data['nearbyLandmarks']);
            }

            // Sync Gallery Images [NEW]
            if (isset($data['images']) && is_array($data['images'])) {
                $this->syncHotelImages($id, $data['images']);
            } elseif (isset($data['gallery']) && is_array($data['gallery'])) {
                 $this->syncHotelImages($id, $data['gallery']);
            }
        }

        return $success;
    }

    private function syncAmenities($hotelId, $amenityNames) {
        // 1. Delete existing associations
        $this->pdo->prepare("DELETE FROM HotelAmenity WHERE hotelId = :id")->execute([':id' => $hotelId]);

        // 2. Link new amenities
        foreach ($amenityNames as $name) {
            if (empty($name)) continue;

            // Find or create amenity
            $stmt = $this->pdo->prepare("SELECT id FROM Amenity WHERE name = :name LIMIT 1");
            $stmt->execute([':name' => $name]);
            $row = $stmt->fetch();

            if ($row) {
                $amenityId = $row['id'];
            } else {
                $amenityId = Uuid::uuid4()->toString();
                $this->pdo->prepare("INSERT INTO Amenity (id, name, nameEn) VALUES (:id, :name, :nameEn)")
                    ->execute([':id' => $amenityId, ':name' => $name, ':nameEn' => $name]);
            }

            // Link to hotel
            $this->pdo->prepare("INSERT IGNORE INTO HotelAmenity (hotelId, amenityId) VALUES (:hotelId, :amenityId)")
                ->execute([':hotelId' => $hotelId, ':amenityId' => $amenityId]);
        }
    }

    private function syncNearbyPlaces($hotelId, $places) {
        // 1. Delete existing records
        $this->pdo->prepare("DELETE FROM NearbyPlace WHERE hotelId = :id")->execute([':id' => $hotelId]);

        // 2. Insert new ones
        foreach ($places as $place) {
            if (empty($place['name'])) continue;

            $placeId = Uuid::uuid4()->toString();
            $this->pdo->prepare("INSERT INTO NearbyPlace (id, name, distance, icon, type, hotelId) VALUES (:id, :name, :distance, :icon, :type, :hotelId)")
                ->execute([
                    ':id' => $placeId,
                    ':name' => $place['name'],
                    ':distance' => $place['distance'] ?? '',
                    ':icon' => $place['icon'] ?? '',
                    ':type' => $place['type'] ?? '',
                    ':hotelId' => $hotelId
                ]);
        }
    }

    private function syncHotelImages($hotelId, $images) {
        // 1. Delete existing non-main images (or all and re-insert carefully)
        // Simplest strategy: Delete all and re-insert. 
        // Warning: This resets 'caption' data if we aren't careful. 
        // For now, assuming simply list of URLs.
        $this->pdo->prepare("DELETE FROM HotelImage WHERE hotelId = :id")->execute([':id' => $hotelId]);

        foreach ($images as $index => $url) {
            if (empty($url)) continue;
            
            // Check if this URL is the main image to set isMain flag correctly?
            // Actually, main image is stored in Hotel table 'image' col usually. 
            // So these are gallery images. 
            
            $imgId = Uuid::uuid4()->toString();
            $this->pdo->prepare("INSERT INTO HotelImage (id, url, hotelId, isMain) VALUES (:id, :url, :hotelId, :isMain)")
                ->execute([
                    ':id' => $imgId,
                    ':url' => $url,
                    ':hotelId' => $hotelId,
                    ':isMain' => 0 // Default to 0, main is handled by 'image' column in Hotel table
                ]);
        }
    }

    public function delete($id) {
        return $this->pdo->prepare("DELETE FROM Hotel WHERE id = :id")->execute([':id' => $id]);
    }

    public function toggleField($id, $field) {
        return $this->pdo->prepare("UPDATE Hotel SET $field = 1 - $field WHERE id = :id")->execute([':id' => $id]);
    }

    public function createRoom($data) {
        $id = Uuid::uuid4()->toString();
        $stmt = $this->pdo->prepare("INSERT INTO Room (id, name, type, capacity, price, availableStock, hotelId, mealPlan, view, area, beds, isVisible, sofa, allowExtraBed, extraBedPrice, maxExtraBeds) VALUES (:id, :name, :type, :capacity, :price, :availableStock, :hotelId, :mealPlan, :view, :area, :beds, :isVisible, :sofa, :allowExtraBed, :extraBedPrice, :maxExtraBeds)");
        
        $stmt->execute([
            ':id' => $id,
            ':name' => $data['name'],
            ':type' => $data['type'] ?? 'STANDARD',
            ':capacity' => (int)($data['capacity'] ?? 2),
            ':price' => (float)($data['price'] ?? 0),
            ':availableStock' => (int)($data['availableStock'] ?? 10),
            ':hotelId' => $data['hotelId'],
            ':mealPlan' => $data['mealPlan'] ?? '',
            ':view' => $data['view'] ?? '',
            ':area' => (float)($data['area'] ?? 30),
            ':beds' => $data['beds'] ?? '',
            ':isVisible' => isset($data['isVisible']) ? (int)$data['isVisible'] : 1,
            ':sofa' => isset($data['sofa']) ? (int)$data['sofa'] : 0,
            ':allowExtraBed' => isset($data['allowExtraBed']) ? (int)$data['allowExtraBed'] : 0,
            ':extraBedPrice' => (float)($data['extraBedPrice'] ?? 0),
            ':maxExtraBeds' => (int)($data['maxExtraBeds'] ?? 1)
        ]);

        // Sync Relations
        if (isset($data['features']) && is_array($data['features'])) {
            $this->syncRoomFeatures($id, $data['features']);
        }

        if (isset($data['images']) && is_array($data['images'])) {
            $this->syncRoomImages($id, $data['images']);
        }

        if (isset($data['pricingPeriods']) && is_array($data['pricingPeriods'])) {
            $this->syncPricingPeriods($id, $data['pricingPeriods']);
        }

        return $id;
    }

    public function updateRoom($id, $data) {
        $allowedFields = ['name', 'type', 'capacity', 'price', 'availableStock', 'mealPlan', 'view', 'area', 'beds', 'sofa', 'allowExtraBed', 'extraBedPrice', 'maxExtraBeds', 'isVisible'];
        $fields = [];
        $params = [':id' => $id];
        
        foreach ($data as $key => $value) {
            if (in_array($key, $allowedFields)) {
                $fields[] = "$key = :$key";
                
                // Type Casting
                if (in_array($key, ['isVisible', 'sofa', 'allowExtraBed'])) {
                    $value = (int)(bool)$value;
                } elseif (in_array($key, ['capacity', 'availableStock', 'maxExtraBeds'])) {
                    $value = (int)$value;
                } elseif (in_array($key, ['price', 'area', 'extraBedPrice'])) {
                    $value = (float)$value;
                }
                
                $params[":$key"] = $value;
            }
        }
        
        if (!empty($fields)) {
            $sql = "UPDATE Room SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
        }

        // Sync Relations
        if (isset($data['features']) && is_array($data['features'])) {
            $this->syncRoomFeatures($id, $data['features']);
        }

        if (isset($data['images']) && is_array($data['images'])) {
            $this->syncRoomImages($id, $data['images']);
        }

        if (isset($data['pricingPeriods']) && is_array($data['pricingPeriods'])) {
            $this->syncPricingPeriods($id, $data['pricingPeriods']);
        }

        return true;
    }

    private function syncRoomFeatures($roomId, $features) {
        $this->pdo->prepare("DELETE FROM RoomFeature WHERE roomId = :id")->execute([':id' => $roomId]);
        
        foreach ($features as $feature) {
            if (empty($feature)) continue;
            $id = Uuid::uuid4()->toString();
            $this->pdo->prepare("INSERT INTO RoomFeature (id, name, roomId) VALUES (:id, :name, :roomId)")
                ->execute([':id' => $id, ':name' => $feature, ':roomId' => $roomId]);
        }
    }

    private function syncRoomImages($roomId, $images) {
        $this->pdo->prepare("DELETE FROM RoomImage WHERE roomId = :id")->execute([':id' => $roomId]);
        
        foreach ($images as $url) {
            if (empty($url)) continue;
            $id = Uuid::uuid4()->toString();
            $this->pdo->prepare("INSERT INTO RoomImage (id, url, roomId) VALUES (:id, :url, :roomId)")
                ->execute([':id' => $id, ':url' => $url, ':roomId' => $roomId]);
        }
    }

    public function syncPricingPeriods($roomId, $periods) {
        $this->pdo->prepare("DELETE FROM PricingPeriod WHERE roomId = :id")->execute([':id' => $roomId]);
        
        foreach ($periods as $p) {
            $startDate = !empty($p['startDate']) ? strtotime($p['startDate']) : false;
            $endDate = !empty($p['endDate']) ? strtotime($p['endDate']) : false;
            
            if (!$startDate || !$endDate) continue;
            
            $id = Uuid::uuid4()->toString();
            $this->pdo->prepare("INSERT INTO PricingPeriod (id, startDate, endDate, price, roomId) VALUES (:id, :startDate, :endDate, :price, :roomId)")
                ->execute([
                    ':id' => $id, 
                    ':startDate' => date('Y-m-d H:i:s', $startDate),
                    ':endDate' => date('Y-m-d H:i:s', $endDate),
                    ':price' => (float)$p['price'],
                    ':roomId' => $roomId
                ]);
        }
    }

    public function deleteRoom($id) {
        return $this->pdo->prepare("UPDATE Room SET isVisible = 0 WHERE id = :id")->execute([':id' => $id]);
    }

    public function getCities() {
        $stmt = $this->pdo->query("SELECT DISTINCT city FROM Hotel WHERE isVisible = 1");
        $cities = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        // Map to objects if frontend expects it, or just list
        return array_map(function($city) {
            return [
                'id' => $city,
                'name' => $city === 'makkah' ? 'مكة المكرمة' : ($city === 'madinah' ? 'المدينة المنورة' : ucfirst($city)),
                'image' => '/images/cities/' . $city . '.jpg' // Placeholder logic
            ];
        }, $cities);
    }

    private function normalizeDate($dateStr) {
        if (!$dateStr) return null;
        try {
            // Already Y-m-d?
            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateStr)) return $dateStr;
            
            $dt = new \DateTime($dateStr);
            // If it's an ISO string (contains T or Z), set timezone to Riyadh to get the correct local date
            if (strpos($dateStr, 'T') !== false || strpos($dateStr, 'Z') !== false) {
                $dt->setTimezone(new \DateTimeZone('Asia/Riyadh'));
            }
            return $dt->format('Y-m-d');
        } catch (\Exception $e) {
            return substr($dateStr, 0, 10);
        }
    }
}
