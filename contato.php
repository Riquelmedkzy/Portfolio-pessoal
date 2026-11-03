<?php
require __DIR__ . '/app/bootstrap.php';
$page = 'contato';
$title = 'Contato';
$description = 'Contato — Portfólio pessoal de Riquelme.';
require __DIR__ . '/app/header.php';
?>
    <main class="page-main" id="conteudo">
      <section class="contact page-contact" id="contato" aria-labelledby="contact-title">
        <div class="contact-inner">
          <div class="section-topline section-topline-light reveal"><span>CONTATO</span><span>PRÓXIMA CONVERSA</span></div>
          <div class="contact-grid">
            <h1 class="contact-heading reveal" id="contact-title">Vamos criar<br /><em>algo juntos?</em></h1>
            <div class="contact-details reveal"><p>Se este trabalho conversa com o que você procura, este é o espaço para começar uma conversa.</p><div class="contact-placeholder"><span>CANAL DE CONTATO</span><strong>[Adicione seu email ou perfil profissional]</strong></div></div>
          </div>
          <footer class="site-footer"><span>© <span id="year">2026</span> Riquelme</span><a href="./index.php">Voltar ao início ↑</a></footer>
        </div>
      </section>
    </main>
<?php require __DIR__ . '/app/footer.php'; ?>
