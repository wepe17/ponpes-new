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

    public function __construct()
    {
        $this->db = Database::getInstance();
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
        // Validate input
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

    public function index()
    {
        $stmt = $this->db->query('SELECT id, username, name, role FROM users ORDER BY created_at DESC');
        return $stmt->fetchAll();
    }

    public function show($id)
    {
        $stmt = $this->db->prepare('SELECT id, username, name, role FROM users WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function store($data)
    {
        $sql = 'INSERT INTO users (id, username, password, name, role) 
                VALUES (UUID(), ?, ?, ?, ?)';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['username'],
            password_hash($data['password'], PASSWORD_DEFAULT),
            $data['name'],
            $data['role'],
        ]);

        return $this->show($this->db->lastInsertId());
    }

    public function update($id, $data)
    {
        $fields = [];
        $values = [];

        if (isset($data['username'])) {
            $fields[] = 'username = ?';
            $values[] = $data['username'];
        }

        if (isset($data['password'])) {
            $fields[] = 'password = ?';
            $values[] = password_hash($data['password'], PASSWORD_DEFAULT);
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

        return $this->show($id);
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

        $secret = (string)$this->jwtSecret;

        return JWT::encode($payload, $secret, 'HS256');
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

    // Middleware-like method to check authentication
    public function authenticate($token)
    {
        try {
            $decoded = $this->validateToken($token);

            // Fetch user to ensure they still exist
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
