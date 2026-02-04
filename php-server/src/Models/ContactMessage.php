<?php

namespace Diafat\Models;

use Diafat\Config\Database;
use Ramsey\Uuid\Uuid;
use PDO;

class ContactMessage {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function create($data) {
        $id = Uuid::uuid4()->toString();
        $sql = "INSERT INTO ContactMessage (id, name, email, phone, message, isRead, createdAt) 
                VALUES (:id, :name, :email, :phone, :message, 0, NOW())";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':id' => $id,
            ':name' => $name = trim($data['name'] ?? ''),
            ':email' => trim($data['email'] ?? ''),
            ':phone' => trim($data['phone'] ?? ''),
            ':message' => trim($data['message'] ?? '')
        ]);
    }

    public function findAll() {
        $stmt = $this->pdo->prepare("SELECT * FROM ContactMessage ORDER BY createdAt DESC");
        $stmt->execute();
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map(function($m) {
            $m['isRead'] = (bool)$m['isRead'];
            return $m;
        }, $messages);
    }

    public function markAsRead($id) {
        $stmt = $this->pdo->prepare("UPDATE ContactMessage SET isRead = 1 WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM ContactMessage WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function getUnreadCount() {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM ContactMessage WHERE isRead = 0");
        $stmt->execute();
        return (int)$stmt->fetchColumn();
    }
}
