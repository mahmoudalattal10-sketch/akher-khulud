<?php

namespace Diafat\Models;

use Diafat\Config\Database;
use PDO;

class Room {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM Room WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getHotelId($id) {
        $stmt = $this->pdo->prepare("SELECT hotelId FROM Room WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        return $stmt->fetchColumn();
    }
}
