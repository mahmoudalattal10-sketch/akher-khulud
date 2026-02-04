<?php
require __DIR__ . '/../src/Config/Database.php';
use Diafat\Config\Database;

header('Content-Type: application/json');

try {
    $pdo = Database::getConnection();
    $stmt = $pdo->query('SELECT city, isVisible, COUNT(*) as count FROM Hotel GROUP BY city, isVisible');
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Also get Makkah names to check variants
    $stmt2 = $pdo->query("SELECT name, city, isVisible FROM Hotel WHERE city LIKE '%مكة%' OR city = 'makkah'");
    $makkahHotels = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'counts' => $results,
        'makkahDetails' => $makkahHotels
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
