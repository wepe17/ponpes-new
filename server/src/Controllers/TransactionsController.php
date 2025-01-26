<?php

namespace App\Controllers;

use App\Database;
use PDO;

class TransactionsController {
    private PDO $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function index() {
        $stmt = $this->db->query('SELECT * FROM transactions ORDER BY date DESC');
        return $stmt->fetchAll();
    }
    
    public function show($id) {
        $stmt = $this->db->prepare('SELECT * FROM transactions WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    public function store($data) {
        $sql = 'INSERT INTO transactions (id, date, amount, type, category, description) 
                VALUES (UUID(), ?, ?, ?, ?, ?)';
                
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['date'],
            $data['amount'],
            $data['type'],
            $data['category'],
            $data['description'],
        ]);
        
        return $this->show($this->db->lastInsertId());
    }
    
    public function update($id, $data) {
        $sql = 'UPDATE transactions SET 
                date = ?, amount = ?, type = ?, category = ?, description = ? 
                WHERE id = ?';
                
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['date'],
            $data['amount'],
            $data['type'],
            $data['category'],
            $data['description'],
            $id
        ]);
        
        return $this->show($id);
    }
    
    public function destroy($id) {
        $stmt = $this->db->prepare('DELETE FROM transactions WHERE id = ?');
        return $stmt->execute([$id]);
    }
}