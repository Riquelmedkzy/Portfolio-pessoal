<?php
declare(strict_types=1);
define('PORTFOLIO', true);
ini_set('display_errors', '0');
header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('X-Frame-Options: SAMEORIGIN');

function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $file = getenv('PORTFOLIO_CONFIG') ?: dirname(__DIR__) . '/config/local.php';
    if (!is_file($file)) throw new RuntimeException('Database configuration unavailable');
    $config = require $file;
    foreach (['host', 'port', 'database', 'username', 'password'] as $key) {
        if (!is_array($config) || !array_key_exists($key, $config)) {
            throw new RuntimeException('Invalid database configuration');
        }
    }
    if (!is_string($config['database']) ||
        preg_match('/\A[\p{L}\p{N}_]+\z/u', $config['database']) !== 1 ||
        !preg_match('/\A[a-zA-Z0-9.:-]+\z/', $config['host']) ||
        !filter_var($config['port'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 65535]])) {
        throw new RuntimeException('Invalid database configuration');
    }
    $pdo = new PDO(
        sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $config['host'], $config['port'], $config['database']),
        $config['username'], $config['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
         PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_TIMEOUT => 3]
    );
    return $pdo;
}

function projects(): array
{
    $statement = db()->prepare('SELECT slug, title, summary, technologies, description, demo_key, availability FROM portfolio_projects WHERE published = :published ORDER BY sort_order, id');
    $statement->execute(['published' => 1]);
    return $statement->fetchAll();
}

function project(string $slug): ?array
{
    $statement = db()->prepare('SELECT slug, title, summary, technologies, description, demo_key, availability FROM portfolio_projects WHERE slug = :slug AND published = :published LIMIT 1');
    $statement->execute(['slug' => $slug, 'published' => 1]);
    return $statement->fetch() ?: null;
}

function requestedSlug(): string
{
    $value = $_GET['slug'] ?? '';
    if (!is_string($value) || !preg_match('/\A[a-z0-9]+(?:-[a-z0-9]+)*\z/', $value) || strlen($value) > 100) {
        errorPage(400, 'Endereço inválido', 'Escolha um projeto no catálogo para abrir seus detalhes.');
    }
    return $value;
}

function demoPath(?string $key): ?string
{
    // Never execute or redirect to a path supplied by a request or database row.
    $allowed = ['hogwarts' => 'demos/hogwarts/index.html', 'nexusfc' => 'demos/nexusfc/index.html'];
    $path = $allowed[$key ?? ''] ?? null;
    return $path && is_file(dirname(__DIR__) . '/' . $path) ? $path : null;
}

function errorPage(int $status, string $heading, string $message): void
{
    http_response_code($status);
    $page = 'projetos'; $title = $heading; $description = $message;
    require __DIR__ . '/header.php';
    echo '<main id="conteudo" class="section page-section"><h1 class="section-heading">' . e($heading) . '</h1><p class="status-copy">' . e($message) . '</p><a class="button button-dark" href="./projetos.php">Voltar aos projetos</a></main>';
    require __DIR__ . '/footer.php';
    exit;
}
