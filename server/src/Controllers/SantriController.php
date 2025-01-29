<?php

namespace App\Controllers;

use App\Database;
use PDO;

class SantriController
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

        $countQuery = "SELECT COUNT(*) as total FROM santri {$searchQuery}";
        $countStmt = $this->db->prepare($countQuery);
        $countStmt->execute($searchParam);
        $total = $countStmt->fetch()['total'];

        $query = "SELECT * FROM santri {$searchQuery} ORDER BY created_at DESC LIMIT ? OFFSET ?";
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
        $stmt = $this->db->prepare('SELECT * FROM santri WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function store($data)
    {
        $sql = 'INSERT INTO santri (id, name, nis, date_of_birth, address, parent_name, 
                phone_number, enrollment_date, class, status) 
                VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['nis'],
            $data['date_of_birth'],
            $data['address'],
            $data['parent_name'],
            $data['phone_number'],
            $data['enrollment_date'],
            $data['class'],
            $data['status'],
        ]);

        $santri = $this->show($this->db->lastInsertId());

        return [
            'santri' => $santri,
            'statusCode' => 201,
            'msg' => 'Data berhasil disimpan'
        ];
    }

    public function update($id, $data)
    {
        $sql = 'UPDATE santri SET 
                name = ?, nis = ?, date_of_birth = ?, address = ?, 
                parent_name = ?, phone_number = ?, enrollment_date = ?, 
                class = ?, status = ? 
                WHERE id = ?';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['nis'],
            $data['date_of_birth'],
            $data['address'],
            $data['parent_name'],
            $data['phone_number'],
            $data['enrollment_date'],
            $data['class'],
            $data['status'],
            $id
        ]);

        return [
            'santri' => $this->show($id),
            'statusCode' => 200,
            'msg' => 'Data berhasil diupdate'
        ];
    }

    public function destroy($id)
    {
        $stmt = $this->db->prepare('DELETE FROM santri WHERE id = ?');
        return $stmt->execute([$id]);
    }
}

