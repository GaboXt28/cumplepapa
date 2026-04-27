<?php
/**
 * API — Álbum de Cumpleaños de Marco
 * Usa MySQL para persistencia de datos.
 */

require_once __DIR__ . '/db_config.php';

// CORS y headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$pdo = getDB();

// --- Funciones auxiliares ---
function sanitize($str) {
    return htmlspecialchars(trim($str), ENT_QUOTES, 'UTF-8');
}

// --- Router ---
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {

    // ========== OBTENER TODOS LOS DATOS ==========
    case 'get_all':
        $messages = $pdo->query("SELECT id, author, text, date_display as `date` FROM messages ORDER BY created_at ASC")->fetchAll();
        $love     = $pdo->query("SELECT id, text, icon FROM love_reasons ORDER BY created_at ASC")->fetchAll();

        echo json_encode([
            'success'  => true,
            'messages' => $messages,
            'love'     => $love
        ]);
        break;

    // ========== AGREGAR DEDICATORIA ==========
    case 'add_message':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Método no permitido']);
            break;
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $author = isset($input['author']) ? sanitize($input['author']) : '';
        $text   = isset($input['text'])   ? sanitize($input['text'])   : '';

        if (empty($author) || empty($text)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Faltan campos']);
            break;
        }

        $author = mb_substr($author, 0, 100);
        $text   = mb_substr($text, 0, 2000);

        // Formato de fecha en español
        setlocale(LC_TIME, 'es_ES.UTF-8', 'es_ES', 'spanish');
        $months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
        $dateDisplay = date('j') . ' de ' . $months[date('n') - 1] . ' de ' . date('Y');

        $stmt = $pdo->prepare("INSERT INTO messages (author, text, date_display) VALUES (?, ?, ?)");
        $stmt->execute([$author, $text, $dateDisplay]);

        $newId = $pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => [
                'id'     => $newId,
                'author' => $author,
                'text'   => $text,
                'date'   => $dateDisplay
            ]
        ]);
        break;

    // ========== AGREGAR RAZÓN ==========
    case 'add_love':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Método no permitido']);
            break;
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $text = isset($input['text']) ? sanitize($input['text']) : '';
        $icon = isset($input['icon']) ? $input['icon'] : '❤️';

        if (empty($text)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Falta el texto']);
            break;
        }

        $text = mb_substr($text, 0, 500);
        // Validar que el icono sea un emoji válido (máx 20 chars)
        $icon = mb_substr($icon, 0, 20);

        $stmt = $pdo->prepare("INSERT INTO love_reasons (text, icon) VALUES (?, ?)");
        $stmt->execute([$text, $icon]);

        $newId = $pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'love' => [
                'id'   => $newId,
                'text' => $text,
                'icon' => $icon
            ]
        ]);
        break;

    // ========== PING — verificar conexión ==========
    case 'ping':
        echo json_encode(['success' => true, 'server' => 'mysql']);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Acción no válida']);
        break;
}
