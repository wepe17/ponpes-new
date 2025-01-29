<?php

namespace App\Controllers;

use App\Database;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use PDO;

class UsersController
{
    private PDO $db;
    private $jwtSecret = 'very-secret';


    public function __construct()
    {
        $this->db = Database::getInstance();
        // $this->jwtSecret = getenv('JWT_SECRET') || 'verysecret';
        // $this->secretKey = getenv('JWT_SECRET') || 'verysecret';
    }

    public function register($data)
    {
        $stmt = $this->db->prepare('SELECT id FROM users WHERE username = ?');
        $stmt->execute([$data['username']]);

        if ($stmt->rowCount() > 0) {
            return ['error' => 'Username already taken'];
        }

        $stmt = $this->db->prepare('INSERT INTO users (id, username, password, name, role) 
                VALUES (UUID(), ?, ?, ?, ?)');
        $stmt->execute([
            $data['username'],
            password_hash($data['password'], PASSWORD_DEFAULT),
            $data['name'],
            $data['role'],
        ]);

        return $this->show($this->db->lastInsertId());
    }

    public function login($credentials)
    {
        if (!isset($credentials['username']) || !isset($credentials['password'])) {
            throw new Exception('Username and password are required');
        }

        $stmt = $this->db->prepare('SELECT * FROM users WHERE username = ?');
        $stmt->execute([$credentials['username']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verify password
        if (!$user || !password_verify($credentials['password'], $user['password'])) {
            throw new Exception('Invalid credentials');
        }

        $token = $this->generateJwtToken($user);

        return [
          'token' => $token,
          'user' => [
            // 'id' => $user['id'],
            'username' => $user['username'],
            'name' => $user['name'],
            'role' => $user['role']
          ]
        ];
    }

    public function index($search = '', $page = 1, $limit = 10)
    {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;

        $searchQuery = $search ? "WHERE name LIKE ?" : "";
        $searchParam = $search ? ["%{$search}%"] : [];

        $countQuery = "SELECT COUNT(*) as total FROM users {$searchQuery}";
        $countStmt = $this->db->prepare($countQuery);
        $countStmt->execute($searchParam);
        $total = $countStmt->fetch()['total'];

        $query = "SELECT * FROM users {$searchQuery} ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $stmt = $this->db->prepare($query);


        $params = [...$searchParam, $limit, $offset];
        $stmt->execute($params);
        $data = $stmt->fetchAll();

        return [
            'data' => $data,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'statusCode' => 200,
            'total_pages' => ceil($total / $limit)
        ];

    }

    public function show($id)
    {
        $stmt = $this->db->prepare('SELECT id, username, name, role FROM users WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function store($data)
    {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? trim(str_replace('Bearer', '', $headers['Authorization'])) : null;

        if (!$token) {
            return ['error' => 'Authorization token missing', 'statusCode' => 401];
        }

        $currentUser = null;
        if ($token) {
            try {
                $currentUser = $this->authenticate($token);
            } catch (Exception $e) {
                return ['error' => $e->getMessage(), 'statusCode' => 401];
            }
        }

        if (isset($data['role']) && (!$currentUser || $currentUser['role'] !== 'admin')) {
            return ['error' => 'Unauthorized access', 'statusCode' => 401];
        }

        $sql = 'INSERT INTO users (id, username, password, name, role) 
            VALUES (UUID(), ?, ?, ?, ?)';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['username'],
            password_hash($data['password'], PASSWORD_DEFAULT),
            $data['name'],
            $data['role'],
        ]);

        return [
            'data' => $this->show($this->db->lastInsertId()),
            'statusCode' => 201,
        ];
    }

    public function update($id, $data)
    {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? trim(str_replace('Bearer', '', $headers['Authorization'])) : null;

        $currentUser = null;
        if ($token) {
            try {
                $currentUser = $this->authenticate($token);
            } catch (Exception $e) {
                return ['error' => $e->getMessage(), 'statusCode' => 401];
            }
        }

        if (isset($data['role']) && (!$currentUser || $currentUser['role'] !== 'admin')) {
            return ['error' => 'Unauthorized access', 'statusCode' => 401];
        }

        $fields = [];
        $values = [];

        if (isset($data['username'])) {
            $fields[] = 'username = ?';
            $values[] = $data['username'];
        }

        if (isset($data['name'])) {
            $fields[] = 'name = ?';
            $values[] = $data['name'];
        }

        if (isset($data['role'])) {
            $fields[] = 'role = ?';
            $values[] = $data['role'];
        }

        $values[] = $id;
        $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($values);
        return ['data' => $this->show($id), 'statusCode' => 200, 'msg' => 'Data berhasil diupdate'];
    }

    public function destroy($id)
    {
        $stmt = $this->db->prepare('DELETE FROM users WHERE id = ?');
        return $stmt->execute([$id]);
    }

    private function generateJwtToken($user)
    {
        $issuedAt = time();
        $expirationTime = $issuedAt + 36000; // Valid for 1 hour

        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'sub' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role']
        ];

        $secret = (string) $this->jwtSecret;

        if (empty($secret)) {
            throw new \Exception('JWT secret is not set.');
        }

        try {
            return JWT::encode($payload, $secret, 'HS256');
        } catch (\Exception $e) {
            // Tangani error encoding
            throw new \Exception('Failed to generate JWT token: ' . $e->getMessage());
        }
    }

    public function validateToken($token)
    {
        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
            return $decoded;
        } catch (Exception $e) {
            throw new Exception('Invalid or expired token');
        }
    }

    public function authenticate($token)
    {
        try {
            $decoded = $this->validateToken($token);

            $stmt = $this->db->prepare('SELECT id, username, role FROM users WHERE id = ?');
            $stmt->execute([$decoded->sub]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                throw new Exception('User not found');
            }

            return $user;
        } catch (Exception $e) {
            throw new Exception('Authentication failed: ' . $e->getMessage());
        }
    }
}
