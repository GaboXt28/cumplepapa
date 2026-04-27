<?php
/**
 * Configuración de base de datos MySQL
 * ============================================
 * INSTRUCCIONES:
 * 1. Ve a cPanel → Bases de datos MySQL
 * 2. Crea una base de datos (ej: "cumplepapa")
 * 3. Crea un usuario y asígnalo a la base de datos con TODOS los privilegios
 * 4. Completa los datos abajo
 * ============================================
 */

define('DB_HOST', 'localhost');           // Normalmente es "localhost" en hosting compartido
define('DB_NAME', 'creacion_cumplepapa');
define('DB_USER', 'creacion_cumplepapa');
define('DB_PASS', '24252026Jg');

/**
 * Conectar a la base de datos con PDO
 */
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Error de conexión a la base de datos']);
            exit;
        }
    }
    return $pdo;
}
