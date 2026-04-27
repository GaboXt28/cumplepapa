<?php
/**
 * SETUP — Crear tablas e insertar datos iniciales.
 * Ejecutar UNA SOLA VEZ visitando: https://macurelio.creacionesmym.com/setup.php
 * Después de ejecutar, ELIMINA este archivo del servidor por seguridad.
 */

require_once __DIR__ . '/db_config.php';

$pdo = getDB();

echo "<h2>🔧 Configurando base de datos...</h2><pre>";

// ===== Crear tabla de dedicatorias =====
$pdo->exec("
    CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        author VARCHAR(100) NOT NULL,
        text TEXT NOT NULL,
        date_display VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
");
echo "✅ Tabla 'messages' creada\n";

// ===== Crear tabla de razones =====
$pdo->exec("
    CREATE TABLE IF NOT EXISTS love_reasons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        text VARCHAR(500) NOT NULL,
        icon VARCHAR(20) NOT NULL DEFAULT '❤️',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
");
echo "✅ Tabla 'love_reasons' creada\n";

// ===== Insertar datos iniciales (solo si están vacías) =====
$msgCount = $pdo->query("SELECT COUNT(*) FROM messages")->fetchColumn();
if ($msgCount == 0) {
    $stmt = $pdo->prepare("INSERT INTO messages (author, text, date_display) VALUES (?, ?, ?)");
    $stmt->execute([
        'La familia',
        'Cada día a tu lado es un regalo. Gracias por ser el pilar de esta familia, por tus risas, tu fuerza y tu amor incondicional. ¡Feliz cumpleaños, Marco!',
        '26 de abril de 2026'
    ]);
    echo "✅ Mensaje inicial insertado\n";
} else {
    echo "ℹ️ Ya hay mensajes, no se insertó el inicial\n";
}

$loveCount = $pdo->query("SELECT COUNT(*) FROM love_reasons")->fetchColumn();
if ($loveCount == 0) {
    $stmt = $pdo->prepare("INSERT INTO love_reasons (text, icon) VALUES (?, ?)");
    $reasons = [
        ['Por tu sonrisa que ilumina cualquier día', '❤️'],
        ['Por tu paciencia infinita', '🌟'],
        ['Porque haces del mundo un lugar mejor', '✨']
    ];
    foreach ($reasons as $r) {
        $stmt->execute($r);
    }
    echo "✅ Razones iniciales insertadas (" . count($reasons) . ")\n";
} else {
    echo "ℹ️ Ya hay razones, no se insertaron las iniciales\n";
}

echo "\n🎉 ¡Todo listo! La base de datos está configurada.\n";
echo "⚠️ IMPORTANTE: Elimina este archivo (setup.php) del servidor por seguridad.\n";
echo "</pre>";
