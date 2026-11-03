<?php defined('PORTFOLIO') || exit; ?>
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#f8f7f4">
<meta name="description" content="<?= e($description) ?>">
<title><?= e($title) ?> — Riquelme</title>
<link rel="stylesheet" href="./styles.css">
<script src="./script.js" defer></script>
<meta name="google-site-verification" content="gNDShzKHgpaskpc8yahGDzTFPQXs2j8-X84CGmn6HhM" />
</head>
<body class="<?= $page === 'inicio' ? 'home-page' : 'inner-page' ?>" data-page="<?= e($page) ?>">
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header class="site-header" id="inicio">
      <div class="header-inner">
        <a class="brand" href="./index.php" aria-label="Voltar ao início">Riquelme<span aria-hidden="true">.</span></a>

        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Abrir menu">
          <span></span><span></span>
        </button>

        <nav class="site-nav" id="site-nav" aria-label="Navegação principal">
          <a href="./sobre.php"<?= $page === 'sobre' ? ' aria-current="page"' : '' ?>>Sobre</a>
          <a href="./projetos.php"<?= $page === 'projetos' ? ' aria-current="page"' : '' ?>>Projetos</a>
          <a href="./habilidades.php"<?= $page === 'habilidades' ? ' aria-current="page"' : '' ?>>Habilidades</a>
          <a href="./contato.php"<?= $page === 'contato' ? ' aria-current="page"' : '' ?>>Contato</a>
        </nav>

        <?php if ($page !== 'inicio'): ?><a class="header-contact" href="./contato.php">Vamos conversar <span aria-hidden="true">↗</span></a><?php endif; ?>
      </div>
    </header>
