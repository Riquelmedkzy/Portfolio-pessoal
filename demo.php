<?php
require __DIR__ . '/app/bootstrap.php';
$slug = requestedSlug();
try { $item = project($slug); }
catch (Throwable $error) { errorPage(503, 'Demonstração indisponível', 'Não foi possível carregar o catálogo agora.'); }
if (!$item || !($path = demoPath($item['demo_key']))) {
    errorPage(404, 'Demonstração indisponível', 'Consulte a página do projeto para conhecer sua disponibilidade.');
}
header('Location: ./' . $path, true, 302);
exit;
