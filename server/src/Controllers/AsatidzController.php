<?php

namespace App\Controllers;

use App\Database;
use PDO;

class AsatidzController
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

        $countQuery = "SELECT COUNT(*) as total FROM asatidz {$searchQuery}";
        $countStmt = $this->db->prepare($countQuery);
        $countStmt->execute($searchParam);
        $total = $countStmt->fetch()['total'];

        $query = "SELECT * FROM asatidz {$searchQuery} ORDER BY created_at DESC LIMIT ? OFFSET ?";
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
        $stmt = $this->db->prepare('SELECT * FROM asatidz WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function store($data)
    {
        $sql = 'INSERT INTO asatidz (id, name, nip, subject, phone_number, address, join_date, status) 
                VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['nip'],
            $data['subject'],
            $data['phone_number'],
            $data['address'],
            $data['join_date'],
            $data['status'],
        ]);

        $asatidz = $this->show($this->db->lastInsertId());

        return [
            'data' => $asatidz,
            'statusCode' => 201,
            'msg' => 'Data berhasil disimpan'
        ];
    }

    public function update($id, $data)
    {
        $sql = 'UPDATE asatidz SET 
                name = ?, nip = ?, subject = ?, phone_number = ?, 
                address = ?, join_date = ?, status = ? 
                WHERE id = ?';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['nip'],
            $data['subject'],
            $data['phone_number'],
            $data['address'],
            $data['join_date'],
            $data['status'],
            $id
        ]);

        return [
            'data' => $this->show($id),
            'statusCode' => 200,
            'msg' => 'Data berhasil diupdate'
        ];
    }

    public function destroy($id)
    {
        $stmt = $this->db->prepare('DELETE FROM asatidz WHERE id = ?');
        return $stmt->execute([$id]);
    }
}

