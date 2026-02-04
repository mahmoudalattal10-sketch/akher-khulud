<?php

namespace Diafat\Controllers;

use Diafat\Models\User;
use Firebase\JWT\JWT;

class AuthController extends BaseController {
    public function register($params = []) {
        $data = $this->getInput();
        
        if (empty($data['email']) || empty($data['password']) || empty($data['name'])) {
            return $this->error('Missing required fields', 400);
        }

        $userModel = new User();
        
        if ($userModel->findByEmail($data['email'])) {
            return $this->error('User already exists', 409);
        }

        try {
            $user = $userModel->create($data);
            $token = $this->generateToken($user);
            
            return $this->success([
                'user' => $user,
                'token' => $token
            ], 'User registered successfully', 201);
        } catch (\Exception $e) {
            $this->logError("Registration failed", ['error' => $e->getMessage()]);
            return $this->error('Registration failed', 500);
        }
    }

    public function login($params = []) {
        $data = $this->getInput();
        
        if (empty($data['email']) || empty($data['password'])) {
            return $this->error('Email and password required', 400);
        }

        $userModel = new User();
        $user = $userModel->findByEmail($data['email']);
        
        if (!$user) {
            return $this->error('EMAIL_NOT_FOUND', 401);
        }

        if (!$userModel->verifyPassword($data['password'], $user['password'])) {
            return $this->error('INCORRECT_PASSWORD', 401);
        }

        unset($user['password']);
        $token = $this->generateToken($user);

        return $this->success([
            'user' => $user,
            'token' => $token
        ], 'Login successful');
    }

    public function verify($params = []) {
        $user = $this->authenticate();
        
        if (!$user) {
            return $this->error('Invalid or expired token', 401);
        }

        try {
            $userModel = new User();
            $userData = $userModel->findById($user->sub);

            if (!$userData) {
                return $this->error('User not found', 401);
            }
            
            return $this->success([
                'valid' => true,
                'user' => [
                    'userId' => $userData['id'],
                    'email' => $userData['email'],
                    'role' => $userData['role'],
                    'name' => $userData['name']
                ]
            ], 'Token is valid');
        } catch (\Exception $e) {
            return $this->error('Verification failed', 401);
        }
    }

    public function profile($params = []) {
        $user = $this->authenticate();
        
        if (!$user) {
            return $this->error('Unauthorized', 401);
        }

        try {
            $userModel = new User();
            $userData = $userModel->findById($user->sub);

            if (!$userData) {
                return $this->error('User not found', 404);
            }

            $bookingModel = new \Diafat\Models\Booking();
            $bookings = $bookingModel->findByUser($userData['id']);

            return $this->success([
                'user' => array_merge($userData, ['bookings' => $bookings])
            ], 'Profile retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Unauthorized', 401);
        }
    }

    public function updateProfile($params = []) {
        $user = $this->authenticate();
        
        if (!$user) {
            return $this->error('Unauthorized', 401);
        }

        try {
            $data = $this->getInput();
            $userModel = new User();
            
            $updateData = [];
            $allowed = ['name', 'phone', 'country', 'email'];
            foreach ($allowed as $field) {
                if (isset($data[$field])) $updateData[$field] = $data[$field];
            }

            if (!empty($updateData)) {
                $userModel->update($user->sub, $updateData);
            }

            return $this->success([], 'Profile updated successfully');
        } catch (\Exception $e) {
            return $this->error('Update failed', 401);
        }
    }

    public function getUsers($params = []) {
        $this->validateAdmin();

        try {
            $userModel = new User();
            $users = $userModel->findAll();
            
            return $this->success(['users' => $users], 'Users retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch users', 500);
        }
    }

    public function logout($params = []) {
        return $this->success([], 'Logged out successfully');
    }

    public function checkEmail($params = []) {
        $data = $this->getInput();
        $email = $data['email'] ?? '';

        if (empty($email)) {
            return $this->error('Email required', 400);
        }

        $userModel = new User();
        $user = $userModel->findByEmail($email);

        return $this->success([
            'exists' => !!$user,
            'email' => $email
        ], 'Email check completed');
    }

    private function generateToken($user) {
        $key = $_ENV['JWT_SECRET'] ?? 'secret';
        $payload = [
            'iss' => $_ENV['BASE_URL'] ?? 'http://localhost:3001',
            'aud' => $_ENV['FRONTEND_URL'] ?? 'http://localhost:3000',
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60), // 24 hours
            'sub' => $user['id'],
            'role' => $user['role'],
            'email' => $user['email']
        ];

        return JWT::encode($payload, $key, 'HS256');
    }
}
