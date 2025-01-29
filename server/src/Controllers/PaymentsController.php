<?php

namespace App\Controllers;

use App\Database;
use PDO;

class PaymentsController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function index($search = '', $page = 1, $limit = 10)
    {

        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;

        $searchQuery = $search ? "WHERE name LIKE ?" : "";
        $searchParam = $search ? ["%{$search}%"] : [];

        $countQuery = "SELECT COUNT(*) as total FROM payments {$searchQuery}";
        $countStmt = $this->db->prepare($countQuery);
        $countStmt->execute($searchParam);
        $total = $countStmt->fetch()['total'];

        $sql = "SELECT p.*, s.name AS santri_name
        FROM payments p
        JOIN santri s ON p.santri_id = s.id
        {$searchQuery}
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?";
        $stmt = $this->db->prepare($sql);


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

        // $sql = 'SELECT p.*, s.name as santri_name
        //         FROM payments p
        //         JOIN santri s ON p.santri_id = s.id
        //         ORDER BY p.date DESC';
        // $stmt = $this->db->query($sql);
        // return $stmt->fetchAll();
    }

    public function show($id)
    {
        $sql = 'SELECT p.*, s.name as santri_name 
                FROM payments p 
                JOIN santri s ON p.santri_id = s.id 
                WHERE p.id = ?';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function store($data)
    {
        $sql = 'INSERT INTO payments (id, santri_id, amount, date, type, status, description) 
                VALUES (UUID(), ?, ?, ?, ?, ?, ?)';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['santri_id'],
            $data['amount'],
            $data['date'],
            $data['type'],
            $data['status'],
            $data['description'] ?? null,
        ]);

        return $this->show($this->db->lastInsertId());
    }

    public function update($id, $data)
    {
        $sql = 'UPDATE payments SET 
                santri_id = ?, amount = ?, date = ?, type = ?, 
                status = ?, description = ? 
                WHERE id = ?';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['santri_id'],
            $data['amount'],
            $data['date'],
            $data['type'],
            $data['status'],
            $data['description'] ?? null,
            $id
        ]);

        return $this->show($id);
    }

    public function destroy($id)
    {
        $stmt = $this->db->prepare('DELETE FROM payments WHERE id = ?');
        return $stmt->execute([$id]);
    }
}

