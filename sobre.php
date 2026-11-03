<?php
require __DIR__ . '/app/bootstrap.php';
$page = 'sobre';
$title = 'Sobre';
$description = 'Sobre — Portfólio pessoal de Riquelme.';
require __DIR__ . '/app/header.php';
?>
    <main class="page-main" id="conteudo">
      <section class="section page-section about" id="sobre" aria-labelledby="about-title">
        <div class="section-topline reveal"><span>APRESENTAÇÃO</span><span>QUEM ESTÁ POR TRÁS DO TRABALHO</span></div>
        <div class="about-grid">
          <h1 class="section-heading reveal" id="about-title">Prazer,<br /><em>Riquelme.</em></h1>
          <div class="about-body reveal">
            <p class="lead">Uma apresentação pessoal merece palavras próprias.</p>
            <p class="placeholder-copy">[Escreva aqui uma breve apresentação: quem você é, sua área de atuação e o tipo de trabalho que deseja mostrar.]</p>
            <div class="about-note"><span class="asterisk" aria-hidden="true">✳</span><span>Este espaço está pronto para receber sua trajetória real.</span></div>
          </div>
        </div>
      </section>
    </main>
<?php require __DIR__ . '/app/footer.php'; ?>
