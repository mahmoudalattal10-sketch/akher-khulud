<?php

namespace Diafat\Models;

use Diafat\Config\Database;
use Ramsey\Uuid\Uuid;
use PDO;

class Review {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function create($data) {
        $id = Uuid::uuid4()->toString();
        $date = date('Y-m-d'); // Current date

        $sql = "INSERT INTO Review (id, userName, rating, text, date, hotelId) 
                VALUES (:id, :userName, :rating, :text, :date, :hotelId)";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':userName' => $data['userName'],
            ':rating' => $data['rating'],
            ':text' => $data['text'],
            ':date' => $date,
            ':hotelId' => $data['hotelId']
        ]);

        // Update Hotel Aggregate Rating (Simple Average)
        $this->updateHotelRating($data['hotelId']);

        return $this->findById($id);
    }

    public function findByHotel($hotelId) {
        $stmt = $this->pdo->prepare("SELECT * FROM Review WHERE hotelId = :hotelId ORDER BY createdAt DESC");
        $stmt->execute([':hotelId' => $hotelId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM Review WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function delete($id) {
        $review = $this->findById($id);
        if ($review) {
            $stmt = $this->pdo->prepare("DELETE FROM Review WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $this->updateHotelRating($review['hotelId']);
            return true;
        }
        return false;
    }

    private function updateHotelRating($hotelId) {
        // Calculate new average
        $stmt = $this->pdo->prepare("SELECT AVG(rating) as avgRating, COUNT(*) as count FROM Review WHERE hotelId = :hotelId");
        $stmt->execute([':hotelId' => $hotelId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        $newRating = $result['avgRating'] ?? 5;
        $count = $result['count'] ?? 0;

        // Update Hotel Table
        $update = $this->pdo->prepare("UPDATE Hotel SET rating = :rating, reviews = :reviews WHERE id = :id");
        $update->execute([
            ':rating' => (float)$newRating,
            ':reviews' => (int)$count,
            ':id' => $hotelId
        ]);
    }
}
