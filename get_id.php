<?php
$paths = [
    './database/diafat.sqlite',
    '../database/diafat.sqlite',
    '../../database/diafat.sqlite',
    '/Users/el3attal/OneDrive/Desktop/dd (7)/dd/database/diafat.sqlite'
];

$db = null;
foreach ($paths as $path) {
    if (file_exists($path)) {
        try {
            $db = new PDO('sqlite:' . $path);
            break;
        } catch (Exception $e) {}
    }
}

if (!$db) {
    die("Database not found");
}

$stmt = $db->query("SELECT id FROM Booking LIMIT 1");
$row = $stmt->fetch(PDO::FETCH_ASSOC);
echo $row['id'] ?? 'none';
