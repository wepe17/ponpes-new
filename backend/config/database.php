<?php

return [
    'host' => $_ENV['DB_HOST'] ?? 'localhost',
    'username' => $_ENV['DB_USER'] ?? 'bijhoo-dev',
    'password' => $_ENV['DB_PASSWORD'] ?? 'bijhoo_dev',
    'database' => $_ENV['DB_NAME'] ?? 'ponpes-db',
    'port' => $_ENV['DB_PORT'] ?? 3306,
];
