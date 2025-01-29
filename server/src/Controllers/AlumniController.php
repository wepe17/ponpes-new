<?php

namespace App\Controllers;

use App\Database;
use PDO;

class AlumniController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function index($search = '', $page = 1, $limit = 10)
    {
        // $stmt = $this->db->query('SELECT * FROM alumni ORDER BY graduation_year DESC, name ASC');
        // return $stmt->fetchAll();
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;

        $searchQuery = $search ? "WHERE name LIKE ?" : "";
        $searchParam = $search ? ["%{$search}%"] : [];

        $countQuery = "SELECT COUNT(*) as total FROM alumni {$searchQuery}";
        $countStmt = $this->db->prepare($countQuery);
        $countStmt->execute($searchParam);
        $total = $countStmt->fetch()['total'];

        $query = "SELECT * FROM alumni {$searchQuery} ORDER BY graduation_year DESC LIMIT ? OFFSET ?";
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
        $stmt = $this->db->prepare('SELECT * FROM alumni WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function store($data)
    {
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


        return [
            'data' => $this->show($this->db->lastInsertId()),
            'statusCode' => 201,
            'msg' => 'Data berhasil disimpan'
        ];
    }

    public function update($id, $data)
    {
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

        return [
            'data' => $this->show($id),
            'statusCode' => 200,
            'msg' => 'Data berhasil diupdate'
        ];
    }

    public function destroy($id)
    {
        $stmt = $this->db->prepare('DELETE FROM alumni WHERE id = ?');
        return $stmt->execute([$id]);
    }
}

