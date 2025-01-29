<?php
$host = 'mysql'; // Nama layanan di docker-compose.yml
$user = 'bijhoo-dev';
$password = 'bijhoo_dev';
$database = 'ponpes-db';

// Establishing connection
$conn = new mysqli($host, $user, $password, $database, 3306);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully";
?>
// <?php
// // isi nama host, username mysql, dan password mysql anda
// // $host = mysql_connect("localhost","bijhoo-dev","bijhoo_dev");
// //  
// // if($host){
// // 	echo "koneksi host berhasil.<br/>";
// // }else{
// // 	echo "koneksi gagal.<br/>";
// // }
//
// $host = $_ENV['DB_HOST'] ?? 'mysql';
// $username = $_ENV['DB_USER'] ?? 'bijhoo-dev';
// $password = $_ENV['DB_PASSWORD'] ?? 'bijhoo_dev';
// $database = $_ENV['DB_NAME'] ?? 'ponpes-db';
// $port = $_ENV['DB_PORT'] ?? 3307;
//
// $dsn = "mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4";
// try {
//     // Attempt to establish a database connection
//     $pdo = new PDO($dsn, $username, $password);
//     // Set PDO error mode to exception
//     $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//
//     echo "Connected successfully to the database!\n";
//
// } catch (PDOException $e) {
//     echo "Connection failed: " . $e->getMessage() . "\n";
// }
//
// ?>
