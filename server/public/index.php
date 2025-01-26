<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\SantriController;
use App\Controllers\AsatidzController;
use App\Controllers\SettingsController;
use App\Controllers\UsersController;
use App\Controllers\PaymentsController;
use App\Controllers\TransactionsController;
use App\Controllers\AlumniController;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle OPTIONS requests for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', trim($uri, '/'));
$uri = array_slice($uri, 2);

error_log("Request URI: " . $_SERVER['REQUEST_URI']);
error_log("Parsed URI: " . print_r($uri, true));

if ($uri[0] === 'api' && $uri[1] === 'health') {
    $response = [
        'status' => 'ok',
        'timestamp' => time(),
        'version' => '1.0',
        'environment' => php_uname('n')
    ];
    echo json_encode($response);
    exit;
}

if ($uri[0] !== 'api') {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
    exit;
}

try {
    $controller = null;
    $id = $uri[2] ?? null; // Optional ID for specific resource

    switch ($uri[1]) {
        case 'santri':
            $controller = new SantriController();
            break;
        case 'asatidz':
            $controller = new AsatidzController();
            break;
        case 'users':
            $controller = new UsersController();
            if ($uri[2] === 'register') {
                $data = json_decode(file_get_contents('php://input'), true);
                $result = $controller->register($data);
                echo json_encode($result);
                exit;
            }

            if ($uri[2] === 'login') {
                $data = json_decode(file_get_contents('php://input'), true);
                $result = $controller->login($data);
                echo json_encode($result);
                exit;
            }

            if ($uri[2] === 'add') {
                $data = json_decode(file_get_contents('php://input'), true);
                $result = $controller->store($data);
                echo json_encode($result);
                exit;
            }
            break;
        case 'payments':
            $controller = new PaymentsController();
            break;
        case 'transactions':
            $controller = new TransactionsController();
            break;
        case 'alumni':
            $controller = new AlumniController();
            break;
        case 'settings':
            $controller = new SettingsController();
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Not Found']);
            exit;
    }

    // Handle the method (GET, POST, PUT, DELETE)
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            if ($id) {
                $result = $controller->show($id); // Show single resource by ID
            } else {
                $result = $controller->index(); // List all resources
            }
            echo json_encode($result);
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true); // Get data from POST body
            $result = $controller->store($data); // Store new resource
            echo json_encode($result);
            break;

        case 'PUT':
            if (!$id) {
                throw new Exception('ID is required');
            }
            $data = json_decode(file_get_contents('php://input'), true); // Get data from PUT body
            $result = $controller->update($id, $data); // Update resource by ID
            echo json_encode($result);
            break;

        case 'DELETE':
            if (!$id) {
                throw new Exception('ID is required');
            }
            $result = $controller->destroy($id); // Delete resource by ID
            echo json_encode(['success' => $result]);
            break;

        default:
            http_response_code(405); // Method not allowed
            echo json_encode(['error' => 'Method Not Allowed']);
            break;
    }
} catch (Exception $e) {
    // Handle exceptions
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
