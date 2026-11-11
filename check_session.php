<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/db.php';

if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id']) && !empty($_SESSION['user_email'])) {
    echo json_encode([
        'authenticated' => true,
        'user' => [
            'id'       => $_SESSION['user_id'],
            'email'    => $_SESSION['user_email'] ?? '',
            'fullname' => $_SESSION['user_name'] ?? '',
            'company'  => $_SESSION['user_company'] ?? ''
        ]
    ]);
} else {
    echo json_encode([
        'authenticated' => false
    ]);
}
