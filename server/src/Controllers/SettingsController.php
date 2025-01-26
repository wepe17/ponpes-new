<?php

namespace App\Controllers;

use App\Database;
use PDO;

class SettingsController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function index($search = '', $page = 1, $limit = 10)
    {
        $stmt = $this->db->query('SELECT * FROM settings');
        return $stmt->fetchAll();
    }

    public function createOrUpdate($data)
    {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM settings');
        $stmt->execute();
        $exists = $stmt->fetchColumn() > 0;

        if ($exists) {
            $sql = 'UPDATE settings SET 
                school_name = ?, 
                address = ?, 
                phone_number = ?, 
                email = ?, 
                spp_amount = ?, 
                registration_fee = ?, 
                is_email_notification = ?, 
                is_sms_notification = ?, 
                updated_at = CURRENT_TIMESTAMP';

            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                $data['school_name'] ?? null,
                $data['address'] ?? null,
                $data['phone_number'] ?? null,
                $data['email'] ?? null,
                $data['spp_amount'] ?? null,
                $data['registration_fee'] ?? null,
                isset($data['is_email_notification']) ? (bool)$data['is_email_notification'] : false,
                isset($data['is_sms_notification']) ? (bool)$data['is_sms_notification'] : false,
            ]);

            return [
                'data' => $this->show('1'), // Mengasumsikan hanya ada satu row di tabel settings
                'statusCode' => 200,
                'msg' => 'Data berhasil diupdate'
            ];
        } else {
            $sql = 'INSERT INTO settings (id, school_name, address, phone_number, email, spp_amount, registration_fee, is_email_notification, is_sms_notification, created_at, updated_at) 
                VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';

            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                $data['school_name'] ?? null,
                $data['address'] ?? null,
                $data['phone_number'] ?? null,
                $data['email'] ?? null,
                $data['spp_amount'] ?? null,
                $data['registration_fee'] ?? null,
                isset($data['is_email_notification']) ? (bool)$data['is_email_notification'] : false,
                isset($data['is_sms_notification']) ? (bool)$data['is_sms_notification'] : false,
            ]);

            return [
                'data' => $this->show($this->db->lastInsertId()),
                'statusCode' => 201,
                'msg' => 'Data berhasil disimpan'
            ];
        }
    }

    public function show($id)
    {
        $stmt = $this->db->prepare('SELECT * FROM settings WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function store($data)
    {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM settings');
        $stmt->execute();
        $exists = $stmt->fetchColumn() > 0;

        $isEmailNotification = isset($data['is_email_notification']) ? (int) $data['is_email_notification'] : 0;
        $isSmsNotification = isset($data['is_sms_notification']) ? (int) $data['is_sms_notification'] : 0;

        if ($exists) {
            $sql = 'UPDATE settings SET 
            school_name = ?, 
            address = ?, 
            phone_number = ?, 
            email = ?, 
            spp_amount = ?, 
            registration_fee = ?, 
            is_email_notification = ?, 
            is_sms_notification = ?, 
            updated_at = CURRENT_TIMESTAMP';

            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                $data['school_name'] ?? null,
                $data['address'] ?? null,
                $data['phone_number'] ?? null,
                $data['email'] ?? null,
                $data['spp_amount'] ?? null,
                $data['registration_fee'] ?? null,
                $isEmailNotification,
                $isSmsNotification,
            ]);

            return [
                'data' => $this->show('1'), // Mengasumsikan hanya ada satu row di tabel settings
                'statusCode' => 200,
                'msg' => 'Data berhasil diupdate'
            ];
        } else {
            $sql = 'INSERT INTO settings (id, school_name, address, phone_number, email, spp_amount, registration_fee, is_email_notification, is_sms_notification, created_at, updated_at) 
            VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';

            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                $data['school_name'] ?? null,
                $data['address'] ?? null,
                $data['phone_number'] ?? null,
                $data['email'] ?? null,
                $data['spp_amount'] ?? null,
                $data['registration_fee'] ?? null,
                $isEmailNotification,
                $isSmsNotification,
            ]);

            return [
                'data' => $this->show($this->db->lastInsertId()),
                'statusCode' => 201,
                'msg' => 'Data berhasil disimpan'
            ];
        }
    }

    public function update($id, $data)
    {
        $sql = 'UPDATE settings SET 
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

        return [
            'data' => $this->show($id),
            'statusCode' => 200,
            'msg' => 'Data berhasil diupdate'
        ];
    }

    public function destroy($id)
    {
        $stmt = $this->db->prepare('DELETE FROM settings WHERE id = ?');
        return $stmt->execute([$id]);
    }
}
