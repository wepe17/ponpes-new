<?php

namespace App\Controllers;

use App\Database;
use PDO;

class ReportController
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

        $countQuery = "SELECT COUNT(*) as total FROM reports {$searchQuery}";
        $countStmt = $this->db->prepare($countQuery);
        $countStmt->execute($searchParam);
        $total = $countStmt->fetch()['total'];

        $query = "SELECT * FROM reports {$searchQuery} ORDER BY created_at DESC LIMIT ? OFFSET ?";
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
    }

    public function store($data)
    {
    }

    public function update($id, $data)
    {
    }

    public function destroy($id)
    {
    }
}
