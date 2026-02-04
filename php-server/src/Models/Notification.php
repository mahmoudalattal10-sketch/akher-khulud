<?php
/**
 * =========================================================
 * 🔔 NOTIFICATION MODEL
 * =========================================================
 * Handles system alerts, booking notifications, and admin messages.
 */

namespace Diafat\Models;

use Diafat\Config\Database;
use Ramsey\Uuid\Uuid;
use PDO;

class Notification {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    /**
     * Create a new notification
     */
    public function create($type, $title, $message, $data = null) {
        $id = Uuid::uuid4()->toString();
        $sql = "INSERT INTO Notification (id, type, title, message, data, isRead, createdAt) 
                VALUES (:id, :type, :title, :message, :data, 0, NOW())";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':id' => $id,
            ':type' => $type,
            ':title' => $title,
            ':message' => $message,
            ':data' => $data ? json_encode($data) : null
        ]);
    }

    /**
     * Get recent notifications
     */
    public function getRecent($limit = 20) {
        $stmt = $this->pdo->prepare("SELECT * FROM Notification ORDER BY createdAt DESC LIMIT :limit");
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map(function($n) {
            $n['isRead'] = (bool)$n['isRead'];
            $n['data'] = $n['data'] ? json_decode($n['data'], true) : null;
            return $n;
        }, $notifications);
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead($id) {
        $stmt = $this->pdo->prepare("UPDATE Notification SET isRead = 1 WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    /**
     * Mark all as read
     */
    public function markAllAsRead() {
        return $this->pdo->query("UPDATE Notification SET isRead = 1");
    }

    /**
     * Delete old notifications
     */
    public function deleteOld($days = 30) {
        $stmt = $this->pdo->prepare("DELETE FROM Notification WHERE createdAt < DATE_SUB(NOW(), INTERVAL :days DAY)");
        return $stmt->execute([':days' => $days]);
    }
}
