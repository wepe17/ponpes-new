<?php

namespace App\Controllers;

use App\Database;
use PDO;

class AlumniController {
    private PDO $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function index() {
        $stmt = $this->db->query('SELECT * FROM alumni ORDER BY graduation_year DESC, name ASC');
        return $stmt->fetchAll();
    }
    
    public function show($id) {
        $stmt = $this->db->prepare('SELECT * FROM alumni WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    public function store($data) {
        $sql = 'INSERT INTO alumni (id, name, nis, graduation_year, address, 
                phone_number, occupation, email) 
                VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)';
                
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['nis'],
            $data['graduationYear'],
            $data['address'],
            $data['phoneNumber'],
            $data['occupation'],
            $data['email'],
        ]);
        
        return $this->show($this->db->lastInsertId());
    }
    
    public function update($id, $data) {
        $sql = 'UPDATE alumni SET 
                name = ?, nis = ?, graduation_year = ?, address = ?, 
                phone_number = ?, occupation = ?, email = ? 
                WHERE id = ?';
                
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['nis'],
            $data['graduationYear'],
            $data['address'],
            $data['phoneNumber'],
            $data['occupation'],
            $data['email'],
            $id
        ]);
        
        return $this->show($id);
    }
    
    public function destroy($id) {
        $stmt = $this->db->prepare('DELETE FROM alumni WHERE id = ?');
        return $stmt->execute([$id]);
    }
}