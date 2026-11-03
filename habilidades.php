<?php
require __DIR__ . '/app/bootstrap.php';
$page = 'habilidades';
$title = 'Habilidades';
$description = 'Tecnologias documentadas nos projetos apresentados no portfólio de Riquelme.';

// Fontes: as tecnologias e os nomes dos projetos em database/schema.sql.
$skillGroups = [
    [
        'title' => 'Web e interfaces',
        'skills' => [
            ['name' => 'PHP', 'icon' => 'php', 'projects' => 'Hogwarts · NexusFC · Aranhaverso · Ciberfólio · Gestão de compras'],
            ['name' => 'HTML', 'icon' => 'html5', 'projects' => 'Hogwarts'],
            ['name' => 'CSS', 'icon' => 'css', 'projects' => 'Hogwarts · Aranhaverso · Ciberfólio'],
            ['name' => 'JavaScript', 'icon' => 'javascript', 'projects' => 'Aranhaverso · Ciberfólio'],
        ],
    ],
    [
        'title' => 'Bancos de dados',
        'skills' => [
            ['name' => 'MySQL', 'icon' => 'mysql', 'projects' => 'Hogwarts · NexusFC · Aranhaverso · Ciberfólio · Gestão de compras'],
            ['name' => 'MySQLi', 'icon' => 'php', 'projects' => 'NexusFC'],
            ['name' => 'MariaDB', 'icon' => 'mariadb', 'projects' => 'NexusFC'],
            ['name' => 'SQLite', 'icon' => 'sqlite', 'projects' => 'Sexta-Feira'],
        ],
    ],
    [
        'title' => 'Aplicações e linguagens',
        'skills' => [
            ['name' => 'React Native', 'icon' => 'react', 'projects' => 'ListaTarefas'],
            ['name' => 'Expo', 'icon' => 'expo', 'projects' => 'ListaTarefas'],
            ['name' => 'TypeScript', 'icon' => 'typescript', 'projects' => 'ListaTarefas'],
            ['name' => 'Python', 'icon' => 'python', 'projects' => 'Sexta-Feira'],
        ],
    ],
];
$technologies = [];
foreach ($skillGroups as $group) {
    foreach ($group['skills'] as $skill) $technologies[] = $skill;
}
require __DIR__ . '/app/header.php';
?>
<main class="skills-main" id="conteudo">
  <section class="skills-hero" aria-labelledby="skills-title">
    <svg class="skills-route-scene skills-hero-routes" viewBox="0 0 1280 420" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path class="skills-route" d="M-34 335C120 287 205 323 299 243S373 93 495 116s137 177 278 151 136-148 261-137 157 89 284 4" />
      <path class="skills-route skills-route--fine" d="M-30 157c139 81 244-78 376-15s111 216 257 210 174-203 320-181 187 191 387 126" />
      <path class="skills-route skills-route--fine" d="M225 430c67-120 151-218 270-235s197 70 299 63 175-100 282-143" />
      <circle class="skills-route-light" r="3.2" />
      <circle class="skills-route-light" r="2.6" />
      <circle class="skills-route-light" r="2.4" />
      <circle class="skills-route-node" cx="299" cy="243" r="3" />
      <circle class="skills-route-node" cx="773" cy="267" r="3" />
      <circle class="skills-route-node" cx="1034" cy="130" r="3" />
    </svg>
    <div class="skills-hero-inner">
      <h1 class="skills-title" id="skills-title">Habilidades.</h1>
      <p class="skills-intro-copy">Tecnologias documentadas nos projetos e demonstrações deste portfólio.</p>
    </div>
  </section>

  <section class="skills-ribbon" aria-labelledby="skills-ribbon-title">
    <h2 class="skills-ribbon-title" id="skills-ribbon-title">Tecnologias em circulação</h2>
    <div class="tech-ribbon" aria-label="Faixa de tecnologias presentes nos projetos">
      <svg class="skills-route-scene skills-ribbon-routes" viewBox="0 0 1280 72" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path class="skills-route" d="M-24 47C128 47 134 15 291 15s167 39 326 39 172-38 332-38 180 39 356 14" />
        <circle class="skills-route-light" r="2.8" />
        <circle class="skills-route-node" cx="291" cy="15" r="2.6" />
        <circle class="skills-route-node" cx="617" cy="54" r="2.6" />
        <circle class="skills-route-node" cx="949" cy="16" r="2.6" />
      </svg>
      <div class="tech-ribbon-track">
        <ul class="tech-ribbon-group">
          <?php foreach ($technologies as $technology): ?>
          <li>
            <span class="technology-mark technology-mark--ribbon"><img src="./assets/icons/<?= e($technology['icon']) ?>.svg" alt="" aria-hidden="true" width="20" height="20" decoding="async"></span>
            <span><?= e($technology['name']) ?></span>
          </li>
          <?php endforeach; ?>
        </ul>
        <ul class="tech-ribbon-group" aria-hidden="true">
          <?php foreach ($technologies as $technology): ?>
          <li>
            <span class="technology-mark technology-mark--ribbon"><img src="./assets/icons/<?= e($technology['icon']) ?>.svg" alt="" width="20" height="20" decoding="async"></span>
            <span><?= e($technology['name']) ?></span>
          </li>
          <?php endforeach; ?>
        </ul>
      </div>
    </div>
  </section>

  <div class="skills-categories">
    <?php foreach ($skillGroups as $index => $group): ?>
    <section class="skill-category skills-motion-scene" aria-labelledby="skill-category-<?= $index ?>">
      <div class="skill-category-heading">
        <h2 class="skill-category-title" id="skill-category-<?= $index ?>"><?= e($group['title']) ?></h2>
        <svg class="skills-route-scene skills-category-routes" viewBox="0 0 1280 54" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path class="skills-route" d="M-24 40c119 0 124-21 250-21s137 27 263 27 130-25 264-25 137 19 262 19 142-22 289-22" />
          <circle class="skills-route-light" r="2.8" />
          <circle class="skills-route-node" cx="226" cy="19" r="2.5" />
          <circle class="skills-route-node" cx="753" cy="21" r="2.5" />
          <circle class="skills-route-node" cx="1015" cy="40" r="2.5" />
        </svg>
      </div>
      <div class="skill-grid">
        <?php foreach ($group['skills'] as $skill): ?>
        <article class="skill-card" tabindex="0">
          <div class="skill-card-heading">
            <span class="technology-mark technology-mark--card"><img src="./assets/icons/<?= e($skill['icon']) ?>.svg" alt="" aria-hidden="true" width="22" height="22" loading="lazy" decoding="async"></span>
            <h3><?= e($skill['name']) ?></h3>
          </div>
          <p>Presente em <?= e($skill['projects']) ?></p>
        </article>
        <?php endforeach; ?>
      </div>
    </section>
    <?php endforeach; ?>
  </div>
</main>
<script type="module" src="./assets/js/habilidades.js"></script>
<?php require __DIR__ . '/app/footer.php'; ?>
