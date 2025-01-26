<?php

namespace App\Controllers;

use App\Database;
use PDO;

class AsatidzController {
    private PDO $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function index() {
        $stmt = $this->db->query('SELECT * FROM asatidz ORDER BY created_at DESC');
        return $stmt->fetchAll();
    }
    
    public function show($id) {
        $stmt = $this->db->prepare('SELECT * FROM asatidz WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    public function store($data) {
        $sql = 'INSERT INTO asatidz (id, name, nip, subject, phone_number, address, join_date, status) 
                VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)';
                
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['nip'],
            $data['subject'],
            $data['phoneNumber'],
            $data['address'],
            $data['joinDate'],
            $data['status'],
        ]);
        
        return $this->show($this->db->lastInsertId());
    }
    
    public function update($id, $data) {
        $sql = 'UPDATE asatidz SET 
                name = ?, nip = ?, subject = ?, phone_number = ?, 
                address = ?, join_date = ?, status = ? 
                WHERE id = ?';
                
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['nip'],
            $data['subject'],
            $data['phoneNumber'],
            $data['address'],
            $data['joinDate'],
            $data['status'],
            $id
        ]);
        
        return $this->show($id);
    }
    
    public function destroy($id) {
        $stmt = $this->db->prepare('DELETE FROM asatidz WHERE id = ?');
        return $stmt->execute([$id]);
    }
}