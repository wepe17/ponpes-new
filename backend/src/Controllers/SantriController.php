<?php

namespace App\Controllers;

use App\Database;
use PDO;

class SantriController {
    private PDO $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function index() {
        $stmt = $this->db->query('SELECT * FROM santri ORDER BY created_at DESC');
        return $stmt->fetchAll();
    }
    
    public function show($id) {
        $stmt = $this->db->prepare('SELECT * FROM santri WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    public function store($data) {
        $sql = 'INSERT INTO santri (id, name, nis, date_of_birth, address, parent_name, 
                phone_number, enrollment_date, class, status) 
                VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['nis'],
            $data['dateOfBirth'],
            $data['address'],
            $data['parentName'],
            $data['phoneNumber'],
            $data['enrollmentDate'],
            $data['class'],
            $data['status'],
        ]);
        
        return $this->show($this->db->lastInsertId());
    }
    
    public function update($id, $data) {
        $sql = 'UPDATE santri SET 
                name = ?, nis = ?, date_of_birth = ?, address = ?, 
                parent_name = ?, phone_number = ?, enrollment_date = ?, 
                class = ?, status = ? 
                WHERE id = ?';
                
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['nis'],
            $data['dateOfBirth'],
            $data['address'],
            $data['parentName'],
            $data['phoneNumber'],
            $data['enrollmentDate'],
            $data['class'],
            $data['status'],
            $id
        ]);
        
        return $this->show($id);
    }
    
    public function destroy($id) {
        $stmt = $this->db->prepare('DELETE FROM santri WHERE id = ?');
        return $stmt->execute([$id]);
    }
}