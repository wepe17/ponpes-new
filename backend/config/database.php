<?php

return [
    'host' => $_ENV['DB_HOST'] ?? 'localhost',
    'username' => $_ENV['DB_USER'] ?? 'root',
    'password' => $_ENV['DB_PASSWORD'] ?? '',
    'database' => $_ENV['DB_NAME'] ?? 'pesantren_db',
    'port' => $_ENV['DB_PORT'] ?? 3306,
];