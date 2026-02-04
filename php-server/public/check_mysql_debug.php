<?php
// Try connecting with root credentials (as seen in the original PHP seed)
$host = '127.0.0.1';
$user = 'root';
$pass = ''; // Try empty first, then 123456789
$pass2 = '123456789';

function tryConnect($h, $u, $p) {
    try {
        $pdo = new PDO("mysql:host=$h", $u, $p);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        return null;
    }
}

$pdo = tryConnect($host, $user, $pass);
if (!$pdo) {
    echo "Root with empty password failed. Trying 123456789...\n";
    $pdo = tryConnect($host, $user, $pass2);
}

if ($pdo) {
    echo "Connected as root!\n";
    echo "Databases:\n";
    $stmt = $pdo->query("SHOW DATABASES");
    $dbs = $stmt->fetchAll(PDO::FETCH_COLUMN);
    print_r($dbs);

    // Check for u736512769_diaftkhulud
    foreach ($dbs as $db) {
        if (strpos($db, 'u73651') !== false || strpos($db, 'diafat') !== false) {
            echo "\nFound candidate DB: $db\n";
            $pdo->query("USE `$db`");
            $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
            echo "Tables in $db:\n";
            print_r($tables);
            
            // specific check for hotels
            if (in_array('Hotel', $tables) || in_array('hotel', $tables)) {
                $count = $pdo->query("SELECT COUNT(*) FROM Hotel")->fetchColumn();
                echo "Hotel Count: $count\n";
            }
        }
    }
} else {
    echo "Failed to connect as root.\n";
}
