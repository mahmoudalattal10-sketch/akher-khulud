<?php
header('Content-Type: application/json');

try {
    // Explicit connection for reliability in debug
    $dsn = "mysql:host=localhost;dbname=diafat_db;charset=utf8mb4";
    $pdo = new PDO($dsn, "root", "123456789", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    // 1. Overall counts by city and visibility
    $stmt = $pdo->query('SELECT city, isVisible, COUNT(*) as count FROM Hotel GROUP BY city, isVisible');
    $counts = $stmt->fetchAll();
    
    // 2. Makkah specific details to see variants
    $stmt2 = $pdo->query("SELECT id, name, city, isVisible, basePrice FROM Hotel WHERE city LIKE '%مكة%' OR city = 'makkah' OR city = 'مكة المكرمة'");
    $makkah = $stmt2->fetchAll();

    // 3. Count how many have active rooms
    $stmt3 = $pdo->query("SELECT h.id, h.name, COUNT(r.id) as roomCount 
                          FROM Hotel h 
                          LEFT JOIN Room r ON h.id = r.hotelId AND r.isVisible = 1 AND r.availableStock > 0
                          WHERE h.city LIKE '%مكة%' OR h.city = 'makkah'
                          GROUP BY h.id");
    $roomStats = $stmt3->fetchAll();

    echo json_encode([
        'summary' => $counts,
        'makkahCount' => count($makkah),
        'makkahDetails' => $makkah,
        'roomStats' => $roomStats
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
