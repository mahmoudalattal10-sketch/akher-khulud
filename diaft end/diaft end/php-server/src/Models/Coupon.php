<?php

namespace Diafat\Models;

use Diafat\Config\Database;
use Ramsey\Uuid\Uuid;
use PDO;

class Coupon {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function findByCode($code) {
        $stmt = $this->pdo->prepare("SELECT * FROM Coupon WHERE code = :code LIMIT 1");
        $stmt->execute([':code' => $code]);
        return $stmt->fetch();
    }

    public function findAll() {
        return $this->pdo->query("SELECT * FROM Coupon")->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $id = Uuid::uuid4()->toString();
        $stmt = $this->pdo->prepare("INSERT INTO Coupon (id, code, discount, `limit`, hotelId, isActive) VALUES (:id, :code, :discount, :limit, :hotelId, :isActive)");
        $stmt->execute([
            ':id' => $id,
            ':code' => strtoupper($data['code']),
            ':discount' => $data['discount'],
            ':limit' => $data['limit'] ?? 100,
            ':hotelId' => $data['hotelId'] ?? null,
            ':isActive' => isset($data['isActive']) ? (int)$data['isActive'] : 1
        ]);
        return $id;
    }

    public function update($id, $data) {
        $fields = [];
        $params = [':id' => $id];
        foreach ($data as $key => $value) {
            $fields[] = "`$key` = :$key";
            $params[":$key"] = $value;
        }
        $sql = "UPDATE Coupon SET " . implode(', ', $fields) . " WHERE id = :id";
        return $this->pdo->prepare($sql)->execute($params);
    }

    public function delete($id) {
        return $this->pdo->prepare("DELETE FROM Coupon WHERE id = :id")->execute([':id' => $id]);
    }
}
