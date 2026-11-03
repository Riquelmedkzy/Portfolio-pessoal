<?php
require __DIR__ . '/app/bootstrap.php';
$slug = requestedSlug();
try { $item = project($slug); }
catch (Throwable $error) { errorPage(503, 'Projeto indisponível', 'Não foi possível carregar o projeto agora. Tente novamente mais tarde.'); }
if (!$item) errorPage(404, 'Projeto não encontrado', 'Este projeto não está disponível no catálogo.');
$page = 'projetos'; $title = $item['title']; $description = $item['summary'];
require __DIR__ . '/app/header.php';
?>
<main class="section page-section project-detail" id="conteudo">
<a class="text-link" href="./projetos.php">← Todos os projetos</a>
<h1 class="section-heading"><?= e($item['title']) ?></h1>
<p class="lead"><?= e($item['summary']) ?></p>
<p class="detail-copy"><?= nl2br(e($item['description'])) ?></p>
<dl class="project-facts"><dt>Tecnologias</dt><dd><?= e($item['technologies']) ?></dd><dt>Demonstração</dt><dd><?= e($item['availability']) ?></dd></dl>
<?php if (demoPath($item['demo_key'])): ?>
<a class="button button-dark" href="./demo.php?slug=<?= e(rawurlencode($item['slug'])) ?>">Abrir demonstração <span aria-hidden="true">↗</span></a>
<?php endif; ?>
</main>
<?php require __DIR__ . '/app/footer.php'; ?>
