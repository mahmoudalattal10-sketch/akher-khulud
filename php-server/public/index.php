<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Diafat\Core\Router;
use Diafat\Controllers\AuthController;
use Diafat\Controllers\HotelController;
use Diafat\Controllers\BookingController;
use Diafat\Controllers\AdminController;
use Diafat\Controllers\ReviewController;
use Diafat\Controllers\CouponController;
use Diafat\Controllers\PaymentController;
use Diafat\Controllers\AiController;
use Diafat\Controllers\UploadController;
use Diafat\Controllers\ContactController;

// 🚀 Performance Optimization: GZIP Compression
if (!ob_start("ob_gzhandler")) ob_start();

// 🚀 Load Environment Variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

// 🚀 Error Reporting Settings
ini_set('display_errors', 0);
error_reporting(E_ALL);

// 🚀 Global Error & Exception Handling
set_exception_handler(function($e) {
    if (class_exists('\Diafat\Utils\Logger')) {
        \Diafat\Utils\Logger::error("Uncaught Exception: " . $e->getMessage(), [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]);
    }

    if (!headers_sent()) {
        header('Content-Type: application/json');
        http_response_code(500);
    }

    $isDev = ($_ENV['APP_ENV'] ?? '') === 'development';

    echo json_encode([
        'success' => false,
        'error' => 'Internal Server Error',
        'message' => $isDev ? $e->getMessage() : 'An unexpected error occurred.',
        'details' => $isDev ? [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => explode("\n", $e->getTraceAsString())
        ] : null
    ]);
    exit;
});

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    if (!(error_reporting() & $errno)) return false;
    
    if (class_exists('\Diafat\Utils\Logger')) {
        \Diafat\Utils\Logger::warning("PHP Error [$errno]: $errstr", [
            'file' => $errfile,
            'line' => $errline
        ]);
    }
    return true; 
});

// 🚀 Performance Optimization: Caching Headers for Static Assets
$uri = $_SERVER['REQUEST_URI'];
if (preg_match('/\.(?:css|js|jpe?g|png|gif|ico|svg|woff2?)$/', $uri)) {
    header("Cache-Control: public, max-age=31536000, immutable");
} else {
    header("Cache-Control: no-cache, no-store, must-revalidate");
}

// CORS Logic
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_origins = [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://localhost:5174',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
];

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
} else {
    if (($_ENV['APP_ENV'] ?? 'production') === 'development' || !isset($origin)) {
        header("Access-Control-Allow-Origin: *");
    }
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$router = new Router();

// Test Route
$router->get('/api/health', function() {
    echo json_encode(['status' => 'ok', 'message' => 'Diafat PHP Backend is running']);
});

// Auth Routes
$router->post('/api/auth/login', [AuthController::class, 'login']);
$router->post('/api/auth/register', [AuthController::class, 'register']);
$router->post('/api/auth/check-email', [AuthController::class, 'checkEmail']);
$router->get('/api/auth/verify', [AuthController::class, 'verify']);
$router->get('/api/auth/profile', [AuthController::class, 'profile']);
$router->put('/api/auth/profile', [AuthController::class, 'updateProfile']);
$router->get('/api/auth/users', [AuthController::class, 'getUsers']);
$router->post('/api/auth/logout', [AuthController::class, 'logout']);

// Destinations Routes
$router->get('/api/destinations', [HotelController::class, 'destinations']);

// Hotel Routes
$router->get('/api/hotels', [HotelController::class, 'index']);
$router->get('/api/hotels/featured', [HotelController::class, 'featured']);
$router->get('/api/hotels/list', [HotelController::class, 'getByIds']);
$router->get('/api/hotels/id/{id}', [HotelController::class, 'showById']);
$router->get('/api/hotels/{slug}', [HotelController::class, 'show']);
$router->post('/api/hotels', [HotelController::class, 'create']);
$router->put('/api/hotels/{id}', [HotelController::class, 'update']);
$router->delete('/api/hotels/{id}', [HotelController::class, 'delete']);
$router->patch('/api/hotels/{id}/visibility', [HotelController::class, 'toggleVisibility']);
$router->patch('/api/hotels/{id}/featured', [HotelController::class, 'toggleFeatured']);

// Room Routes
$router->post('/api/hotels/{hotelId}/rooms', [HotelController::class, 'createRoom']);
$router->put('/api/rooms/{id}', [HotelController::class, 'updateRoom']);
$router->delete('/api/rooms/{id}', [HotelController::class, 'deleteRoom']);

// Booking Routes
$router->post('/api/bookings', [BookingController::class, 'create']);
$router->get('/api/bookings', [BookingController::class, 'index']);
$router->get('/api/bookings/me', [BookingController::class, 'myBookings']);
$router->patch('/api/bookings/{id}/status', [BookingController::class, 'updateStatus']);
$router->get('/api/bookings/{id}', [BookingController::class, 'show']);
$router->post('/api/bookings/{id}/cancel', [BookingController::class, 'cancel']);

// Debug Routes
$router->get('/api/debug/show-me-the-money', function() {
    require __DIR__ . '/../analyze_names.php';
});

// Admin Routes
$router->get('/api/admin/stats', [AdminController::class, 'dashboardStats']);
$router->get('/api/admin/analytics', [AdminController::class, 'analytics']);
$router->get('/api/admin/bookings', [AdminController::class, 'allBookings']);
$router->get('/api/admin/pilgrims', [AdminController::class, 'getPilgrims']);
$router->get('/api/admin/notifications', [AdminController::class, 'getNotifications']);
$router->put('/api/admin/notifications/{id}/read', [AdminController::class, 'markNotificationAsRead']);
$router->post('/api/admin/update-credentials', [AdminController::class, 'updateCredentials']);

// Review Routes
$router->get('/api/hotels/{id}/reviews', [ReviewController::class, 'index']);
$router->post('/api/reviews', [ReviewController::class, 'create']);
$router->delete('/api/reviews/{id}', [ReviewController::class, 'delete']);

// Coupon Routes
$router->get('/api/coupons', [CouponController::class, 'index']);
$router->post('/api/coupons', [CouponController::class, 'create']);
$router->put('/api/coupons/{id}', [CouponController::class, 'update']);
$router->delete('/api/coupons/{id}', [CouponController::class, 'delete']);
$router->post('/api/coupons/verify', [CouponController::class, 'verify']);

// Payment Routes
$router->post('/api/payment/initiate', [PaymentController::class, 'initiate']);
$router->post('/api/payment/callback', [PaymentController::class, 'callback']);

// AI Routes
$router->post('/api/ai/parse-search', [AiController::class, 'parseSearch']);
$router->post('/api/ai/welcome', [AiController::class, 'generateWelcome']);
$router->post('/api/ai/translate', [AiController::class, 'translate']);

// General Upload Route
$router->post('/api/upload', [UploadController::class, 'upload']);

// Contact Routes
$router->post('/api/contact', [ContactController::class, 'submit']);
$router->get('/api/admin/messages', [ContactController::class, 'index']);
$router->get('/api/admin/messages/unread-count', [ContactController::class, 'unreadCount']);
$router->put('/api/admin/messages/{id}/read', [ContactController::class, 'markRead']);
$router->delete('/api/admin/messages/{id}', [ContactController::class, 'delete']);

$router->dispatch();
