<?php
require __DIR__ . '/app/bootstrap.php';
$page = 'inicio';
$title = 'Código, forma e intenção';
$description = 'Código, forma e intenção — Portfólio pessoal de Riquelme.';
require __DIR__ . '/app/header.php';
?>
    <main id="conteudo">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <h1 id="hero-title">Código, forma<br /><em>e intenção.</em></h1>
          <p class="hero-intro">Um espaço para apresentar quem sou, o que construo e como penso cada projeto.</p>
          <div class="hero-actions">
            <a class="button button-dark" href="./projetos.php">Explorar projetos <span aria-hidden="true">↗</span></a>
            <a class="text-link" href="./sobre.php">Conheça a proposta <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div class="hero-image-wrap">
          <img class="hero-image" src="./1000620950.jpg" alt="Retrato em preto e branco com interfaces de programação coloridas ao redor" width="1536" height="1024" fetchpriority="high" decoding="async" />
        </div>
      </section>
    </main>
<?php require __DIR__ . '/app/footer.php'; ?>
