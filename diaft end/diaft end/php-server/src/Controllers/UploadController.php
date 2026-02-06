<?php

namespace Diafat\Controllers;

class UploadController extends BaseController {

    public function upload() {
        // CORS Headers are already handled in index.php, but for safety in direct access:
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, OPTIONS");
        header("Content-Type: application/json");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        if (!isset($_FILES['image'])) {
            $this->jsonResponse(['error' => 'No image file provided'], 400);
            return;
        }

        $file = $_FILES['image'];
        
        // Basic Validation
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $this->jsonResponse(['error' => 'File upload error code: ' . $file['error']], 500);
            return;
        }

        // Validate Mime Type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);

        if (!in_array($mimeType, $allowedTypes)) {
            $this->jsonResponse(['error' => 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.'], 400);
            return;
        }

        // Generate Unique Filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        if (!$extension) {
            // Fallback extension based on mime type if missing
            $extension = str_replace('image/', '', $mimeType);
        }
        
        $filename = uniqid('img_', true) . '.' . $extension;
        $uploadDir = __DIR__ . '/../../public/uploads/';
        
        // Ensure upload directory exists
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $destination = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            // Return the relative URL
            // The frontend expects the full URL or relative path usually. 
            // Looking at ImageUploader.tsx, it returns `data.url`.
            // And getImageUrl helper likely prepends base URL if needed.
            // Let's return the relative path from public root.
            
            $publicUrl = '/uploads/' . $filename;
            
            $this->jsonResponse([
                'success' => true,
                'url' => $publicUrl,
                'message' => 'Image uploaded successfully'
            ]);
        } else {
            $this->jsonResponse(['error' => 'Failed to move uploaded file'], 500);
        }
    }
}
