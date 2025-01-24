<?php

namespace App\Controllers;

use App\Database;
use PDO;

class UsersController {
    private PDO $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function index() {
        $stmt = $this->db->query('SELECT id, username, name, role FROM users ORDER BY created_at DESC');
        return $stmt->fetchAll();
    }
    
    public function show($id) {
        $stmt = $this->db->prepare('SELECT id, username, name, role FROM users WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    public function store($data) {
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
    
    public function update($id, $data) {
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
    
    public function destroy($id) {
        $stmt = $this->db->prepare('DELETE FROM users WHERE id = ?');
        return $stmt->execute([$id]);
    }
}