<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\SantriController;
use App\Controllers\AsatidzController;
use App\Controllers\UsersController;
use App\Controllers\PaymentsController;
use App\Controllers\TransactionsController;
use App\Controllers\AlumniController;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', trim($uri, '/'));

if ($uri[0] !== 'api') {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
    exit;
}

try {
    $controller = null;
    switch ($uri[1]) {
        case 'santri':
            $controller = new SantriController();
            break;
        case 'asatidz':
            $controller = new AsatidzController();
            break;
        case 'users':
            $controller = new UsersController();
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
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Not Found']);
            exit;
    }
    
    $id = $uri[2] ?? null;
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            if ($id) {
                $result = $controller->show($id);
            } else {
                $result = $controller->index();
            }
            echo json_encode($result);
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $result = $controller->store($data);
            echo json_encode($result);
            break;
            
        case 'PUT':
            if (!$id) {
                throw new Exception('ID is required');
            }
            $data = json_decode(file_get_contents('php://input'), true);
            $result = $controller->update($id, $data);
            echo json_encode($result);
            break;
            
        case 'DELETE':
            if (!$id) {
                throw new Exception('ID is required');
            }
            $result = $controller->destroy($id);
            echo json_encode(['success' => $result]);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method Not Allowed']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}