<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Diafat\Config\Database;

// 1. Load Env
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

// 2. Connect
try {
    $pdo = Database::getConnection();
} catch (Exception $e) {
    die("Database connection failed: " . $e->getMessage());
}

// 3. Settings
$dbName = $_ENV['DB_NAME'] ?? 'diafat_db';
$filename = 'backup_' . date('Y-m-d_H-i-s') . '.sql';

header('Content-Type: application/octet-stream');
header("Content-Transfer-Encoding: Binary");
header("Content-disposition: attachment; filename=\"" . $filename . "\"");

// 4. Dump Logic
try {
    // Get all tables
    $tables = [];
    $stmt = $pdo->query("SHOW TABLES");
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        $tables[] = $row[0];
    }
    
    $return = "-- Diafat Database Backup\n";
    $return .= "-- Generated: " . date('Y-m-d H:i:s') . "\n\n";
    $return .= "SET FOREIGN_KEY_CHECKS = 0;\n\n";
    
    foreach ($tables as $table) {
        $return .= "-- Table: $table\n";
        $return .= "DROP TABLE IF EXISTS `$table`;\n";
        
        $row2 = $pdo->query("SHOW CREATE TABLE `$table`")->fetch(PDO::FETCH_NUM);
        $return .= $row2[1] . ";\n\n";
        
        $stmt3 = $pdo->query("SELECT * FROM `$table`");
        while ($row = $stmt3->fetch(PDO::FETCH_ASSOC)) {
            $keys = array_keys($row);
            $values = array_values($row);
            
            // Format values
            $values = array_map(function($val) use ($pdo) {
                if ($val === null) return "NULL";
                return $pdo->quote($val);
            }, $values);
            
            $return .= "INSERT INTO `$table` (`" . implode("`, `", $keys) . "`) VALUES (" . implode(", ", $values) . ");\n";
        }
        $return .= "\n\n";
    }
    
    $return .= "SET FOREIGN_KEY_CHECKS = 1;\n";
    
    echo $return;
    
} catch (Exception $e) {
    // If output started, we can't do much but echo error at end or log
    error_log("Backup failed: " . $e->getMessage());
    echo "\n-- BACKUP FAILED: " . $e->getMessage();
}

exit;
