<?php

namespace Diafat\Controllers;

class BaseController {
    protected function success($data = [], $message = 'Success', $statusCode = 200) {
        return $this->jsonResponse([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }

    protected function error($message = 'Error', $statusCode = 400, $data = []) {
        return $this->jsonResponse([
            'success' => false,
            'message' => $message,
            'errors' => $data
        ], $statusCode);
    }

    protected function jsonResponse($data, $statusCode = 200) {
        if (!headers_sent()) {
            header('Content-Type: application/json');
            http_response_code($statusCode);
        }
        echo json_encode($data);
        exit;
    }

    protected function authenticate() {
        if (!function_exists('getallheaders')) {
            $headers = [];
            foreach ($_SERVER as $name => $value) {
                if (substr($name, 0, 5) == 'HTTP_') {
                    $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
                }
            }
        } else {
            $headers = getallheaders();
        }
        
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            try {
                // Fix: Match AuthController's fallback
                $key = $_ENV['JWT_SECRET'] ?? 'secret'; 
                $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key($key, 'HS256'));
                return $decoded;
            } catch (\Exception $e) {
                // Log the specific error
                error_log("Authentication Failed: " . $e->getMessage());
                return null;
            }
        }
        
        // Log missing token
        error_log("Authentication Failed: No Bearer token found in header. Auth Header length: " . strlen($authHeader));
        return null;
    }

    protected function validateAdmin() {
        $user = $this->authenticate();
        
        // Detailed Logging for Debugging
        if (!$user) {
            error_log("ValidateAdmin Failed: User is null. URI: " . $_SERVER['REQUEST_URI']);
            $this->jsonResponse(['error' => 'Unauthorized - Admin access required'], 403);
        }
        
        if (!isset($user->role)) {
            error_log("ValidateAdmin Failed: No role in token. User ID: " . ($user->sub ?? 'unknown') . ". URI: " . $_SERVER['REQUEST_URI']);
            $this->jsonResponse(['error' => 'Unauthorized - Admin access required'], 403);
        }
        
        if (!in_array($user->role, ['ADMIN', 'SUPER_ADMIN'])) {
            error_log("ValidateAdmin Failed: Role mismatch. Role: " . $user->role . ". User ID: " . $user->sub . ". URI: " . $_SERVER['REQUEST_URI']);
            $this->jsonResponse(['error' => 'Unauthorized - Admin access required'], 403);
        }
        
        return $user;
    }

    protected function getInput() {
        return json_decode(file_get_contents('php://input'), true) ?? [];
    }

    protected function logError($message, $context = []) {
        \Diafat\Utils\Logger::error($message, $context);
    }
}
