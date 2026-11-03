<?php
// Optional PHP development server: php -S 127.0.0.1:8765 router.php
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/');
if (preg_match('~(?:^|/)(?:\.|app(?:/|$)|config(?:/|$)|database(?:/|$)|docs(?:/|$)|content(?:/|$)|scripts(?:/|$)|tests(?:/|$)|node_modules(?:/|$)|dist(?:/|$))|\.(?:md|sql|log|bak|ini|mjs|cjs)$|/(?:package.*\.json|vercel\.json|router\.php)$~i', $path)) {
    http_response_code(403); exit('Acesso negado.');
}
$root = realpath(__DIR__);
$file = realpath(__DIR__ . $path);
if ($file && str_starts_with($file, $root . DIRECTORY_SEPARATOR) && is_file($file)) return false;
if ($path === '/') { readfile(__DIR__ . '/index.html'); return true; }
http_response_code(404); readfile(__DIR__ . '/404.html');
