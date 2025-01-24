<?php

namespace App\Controllers;

use App\Database;
use PDO;

class PaymentsController {
    private PDO $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function index() {
        $sql = 'SELECT p.*, s.name as santri_name 
                FROM payments p 
                JOIN santri s ON p.santri_id = s.id 
                ORDER BY p.date DESC';
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll();
    }
    
    public function show($id) {
        $sql = 'SELECT p.*, s.name as santri_name 
                FROM payments p 
                JOIN santri s ON p.santri_id = s.id 
                WHERE p.id = ?';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    public function store($data) {
        $sql = 'INSERT INTO payments (id, santri_id, amount, date, type, status, description) 
                VALUES (UUID(), ?, ?, ?, ?, ?, ?)';
                
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['santriId'],
            $data['amount'],
            $data['date'],
            $data['type'],
            $data['status'],
            $data['description'] ?? null,
        ]);
        
        return $this->show($this->db->lastInsertId());
    }
    
    public function update($id, $data) {
        $sql = 'UPDATE payments SET 
                santri_id = ?, amount = ?, date = ?, type = ?, 
                status = ?, description = ? 
                WHERE id = ?';
                
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['santriId'],
            $data['amount'],
            $data['date'],
            $data['type'],
            $data['status'],
            $data['description'] ?? null,
            $id
        ]);
        
        return $this->show($id);
    }
    
    public function destroy($id) {
        $stmt = $this->db->prepare('DELETE FROM payments WHERE id = ?');
        return $stmt->execute([$id]);
    }
}