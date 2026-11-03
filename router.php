<?php
// Router only for PHP's local development server; Apache uses .htaccess.
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/');
if (preg_match('~(?:^|/)(?:\.|app(?:/|$)|config(?:/|$)|database(?:/|$)|docs(?:/|$)|README\.md|router\.php)~i', $path)) {
    http_response_code(403); exit('Acesso negado.');
}
$root = realpath(__DIR__);
$file = realpath(__DIR__ . $path);
if ($file && str_starts_with($file, $root . DIRECTORY_SEPARATOR) && is_file($file)) return false;
if ($path === '/') { require __DIR__ . '/index.php'; return true; }
http_response_code(404); echo 'Página não encontrada.';
