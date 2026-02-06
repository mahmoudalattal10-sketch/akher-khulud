<?php

namespace Diafat\Models;

use Diafat\Config\Database;
use PDO;
use Ramsey\Uuid\Uuid;

class User {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function create($data) {
        $id = Uuid::uuid4()->toString();
        // Default values
        $role = $data['role'] ?? 'USER';
        
        $sql = "INSERT INTO User (id, email, password, name, phone, country, role) 
                VALUES (:id, :email, :password, :name, :phone, :country, :role)";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':email' => $data['email'],
            ':password' => password_hash($data['password'], PASSWORD_BCRYPT),
            ':name' => $data['name'],
            ':phone' => $data['phone'] ?? null,
            ':country' => $data['country'] ?? null,
            ':role' => $role
        ]);

        return $this->findById($id);
    }

    public function findByEmail($email) {
        $stmt = $this->pdo->prepare("SELECT * FROM User WHERE email = :email LIMIT 1");
        $stmt->execute([':email' => $email]);
        return $stmt->fetch();
    }

    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT id, name, email, phone, role, country, createdAt FROM User WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    public function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    public function findAll() {
        $stmt = $this->pdo->query("SELECT id, name, email, phone, role, country, createdAt FROM User");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function update($id, $data) {
        $allowedFields = ['name', 'phone', 'country', 'email', 'password']; 
        $fields = [];
        $params = [':id' => $id];
        
        foreach ($data as $key => $value) {
            if (in_array($key, $allowedFields)) {
                $fields[] = "$key = :$key";
                $params[":$key"] = $value;
            }
        }
        
        if (empty($fields)) return false;

        $sql = "UPDATE User SET " . implode(', ', $fields) . " WHERE id = :id";
        return $this->pdo->prepare($sql)->execute($params);
    }
}
