<?php
$slug = $_GET['slug'] ?? '';
$allowed = ['aranhaverso', 'lista-tarefas', 'nexusfc', 'hogwarts', 'sexta-feira', 'ciberfolio', 'gestao-compras'];
if (!is_string($slug) || !in_array($slug, $allowed, true)) { http_response_code(404); readfile(__DIR__ . '/404.html'); exit; }
$target = $slug . '.html';
header('Location: ./' . $target, true, 302);
exit;
