<?php
require __DIR__ . '/app/bootstrap.php';
$page = 'projetos'; $title = 'Projetos'; $description = 'Projetos de Riquelme: aplicações, sites e experiências de desenvolvimento.';
$unavailable = false;
try { $items = projects(); }
catch (Throwable $error) {
    error_log('Portfolio: project catalog unavailable (' . get_class($error) . ')');
    http_response_code(503); $items = []; $unavailable = true;
}
require __DIR__ . '/app/header.php';
?>
<main class="page-main" id="conteudo">
<section class="section page-section projects" aria-labelledby="projects-title">
<div class="section-topline"><span>PROJETOS</span><span>TRABALHOS SELECIONADOS</span></div>
<div class="projects-heading-row"><h1 class="section-heading" id="projects-title">Projetos em<br><em>destaque.</em></h1><p>Um lugar para mostrar o problema, a solução e o resultado de cada trabalho.</p></div>
<?php if ($unavailable): ?>
<p class="status-copy" role="status">O catálogo está temporariamente indisponível. Tente novamente mais tarde.</p>
<?php elseif (!$items): ?>
<p class="status-copy">Os projetos ainda não foram publicados.</p>
<?php else: ?>
<div class="project-grid">
<?php foreach ($items as $item): ?>
<article class="project-card project-record reveal">
<p class="project-kicker"><?= e($item['technologies']) ?></p>
<h2><?= e($item['title']) ?></h2>
<p class="project-description"><?= e($item['summary']) ?></p>
<div class="project-actions"><a class="button button-dark" href="./projeto.php?slug=<?= e(rawurlencode($item['slug'])) ?>">Abrir projeto <span aria-hidden="true">↗</span></a></div>
</article>
<?php endforeach; ?>
</div>
<?php endif; ?>
</section>
</main>
<?php require __DIR__ . '/app/footer.php'; ?>
