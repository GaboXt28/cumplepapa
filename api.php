<?php
/**
 * API simple para el álbum de cumpleaños de Marco.
 * Guarda dedicatorias y razones en archivos JSON en el servidor.
 */

// CORS — permitir peticiones desde el mismo dominio
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// --- Configuración ---
$DATA_DIR = __DIR__ . '/data';
$MESSAGES_FILE = $DATA_DIR . '/messages.json';
$LOVE_FILE     = $DATA_DIR . '/love.json';

// Crear directorio de datos si no existe
if (!is_dir($DATA_DIR)) {
    mkdir($DATA_DIR, 0755, true);
}

// --- Funciones auxiliares ---
function readJsonFile($file) {
    if (!file_exists($file)) {
        return [];
    }
    $content = file_get_contents($file);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

function writeJsonFile($file, $data) {
    // Usar LOCK_EX para evitar escrituras simultáneas corruptas
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function sanitize($str) {
    return htmlspecialchars(trim($str), ENT_QUOTES, 'UTF-8');
}

// --- Router ---
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {

    // ========== OBTENER TODOS LOS DATOS ==========
    case 'get_all':
        $messages = readJsonFile($MESSAGES_FILE);
        $love     = readJsonFile($LOVE_FILE);
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

        // Limitar longitud
        $author = mb_substr($author, 0, 100);
        $text   = mb_substr($text, 0, 2000);

        $messages = readJsonFile($MESSAGES_FILE);
        $newMsg = [
            'id'     => uniqid('msg_'),
            'author' => $author,
            'text'   => $text,
            'date'   => date('j \d\e F \d\e Y') // "26 de abril de 2026"
        ];
        $messages[] = $newMsg;
        writeJsonFile($MESSAGES_FILE, $messages);

        echo json_encode(['success' => true, 'message' => $newMsg]);
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
        $icon = isset($input['icon']) ? sanitize($input['icon']) : '❤️';

        if (empty($text)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Falta el texto']);
            break;
        }

        $text = mb_substr($text, 0, 500);

        $love = readJsonFile($LOVE_FILE);
        $newLove = [
            'id'   => uniqid('love_'),
            'text' => $text,
            'icon' => $icon
        ];
        $love[] = $newLove;
        writeJsonFile($LOVE_FILE, $love);

        echo json_encode(['success' => true, 'love' => $newLove]);
        break;

    // ========== SEED — datos iniciales ==========
    case 'seed':
        $messages = readJsonFile($MESSAGES_FILE);
        $love     = readJsonFile($LOVE_FILE);

        // Solo hacer seed si están vacíos
        if (empty($messages)) {
            $messages = [[
                'id'     => 'msg_initial',
                'author' => 'La familia',
                'text'   => 'Cada día a tu lado es un regalo. Gracias por ser el pilar de esta familia, por tus risas, tu fuerza y tu amor incondicional. ¡Feliz cumpleaños, Marco!',
                'date'   => '26 de abril de 2026'
            ]];
            writeJsonFile($MESSAGES_FILE, $messages);
        }

        if (empty($love)) {
            $love = [
                ['id' => 'love_1', 'text' => 'Por tu sonrisa que ilumina cualquier día', 'icon' => '❤️'],
                ['id' => 'love_2', 'text' => 'Por tu paciencia infinita', 'icon' => '🌟'],
                ['id' => 'love_3', 'text' => 'Porque haces del mundo un lugar mejor', 'icon' => '✨']
            ];
            writeJsonFile($LOVE_FILE, $love);
        }

        echo json_encode(['success' => true, 'seeded' => true]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Acción no válida']);
        break;
}
