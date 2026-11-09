import { escape as e } from "./catalog.mjs";
import { statusLabels } from "./playground-data.mjs";
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.5"/></svg>';
const mark = (t) =>
  `<img src="assets/icons/${e(t.icon)}.svg" alt="" width="26" height="26">`;
export const playgroundAssets = (name) =>
  `<link rel="stylesheet" href="assets/css/playground.css"><script type="module" src="assets/js/${name}.js"></script>`;
export function renderEcosystem(data, projects) {
  const { technologies: tech, relations, categories } = data;
  return `<section class="ecosystem" data-ecosystem><header class="explore-heading"><div><h1>Tech Ecosystem<span>.</span></h1><p>Tecnologias se conectam. Projetos dão sentido.<br> Explore as ferramentas por trás do que eu construo.</p></div><a class="text-link" href="lab.html">Experimentar no Lab ${arrow}</a></header>
 <div class="explore-toolbar"><label class="select-label js-only">Explorar por área<select data-tech-category><option value="all">Todo o ecossistema</option>${categories.map((c) => `<option value="${c.id}">${e(c.name)}</option>`).join("")}</select></label><div class="view-switch js-only" role="group" aria-label="Visualização das habilidades"><button type="button" data-view="map" aria-pressed="true">Mapa</button><button type="button" data-view="list" aria-pressed="false">Lista</button></div><span class="toolbar-note">Selecione uma tecnologia para explorar</span></div>
 <div class="ecosystem-workspace"><div class="ecosystem-canvas"><div class="tech-map" data-map role="group" aria-label="Mapa de tecnologias conectadas"><svg class="tech-connections" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">${relations
   .map((r) => {
     const a = tech.find((t) => t.id === r.source),
       b = tech.find((t) => t.id === r.target);
     return `<path data-connection data-source="${r.source}" data-target="${r.target}" d="M${a.x * 10} ${a.y * 6.2} L${b.x * 10} ${b.y * 6.2}"><title>${e(r.reason)}</title></path>`;
   })
   .join(
     "",
   )}</svg><span class="map-area map-area--front" aria-hidden="true">INTERFACE</span><span class="map-area map-area--back" aria-hidden="true">APLICAÇÃO & DADOS</span><span class="map-area map-area--mobile" aria-hidden="true">MOBILE & LOCAL</span>${tech.map((t, i) => `<button type="button" class="tech-node ${t.id === "javascript" ? "is-selected" : ""}" data-tech-select="${t.id}" data-category="${t.category}" aria-pressed="${t.id === "javascript"}" style="--node-x:${t.x}%;--node-y:${t.y}%;--tech-color:${t.color};--node-order:${i}">${mark(t)}<span>${e(t.name)}</span><span class="node-dot" aria-hidden="true"></span></button>`).join("")}<div class="map-key"><span></span>Relações documentadas nos projetos</div></div>
 <div class="tech-list" data-tech-list>${categories
   .map(
     (c) =>
       `<section data-list-category="${c.id}"><h2>${e(c.name)}</h2><div>${tech
         .filter((t) => t.category === c.id)
         .map(
           (t) =>
             `<button type="button" data-tech-select="${t.id}" data-category="${c.id}" aria-pressed="${t.id === "javascript"}" class="tech-list-item" style="--tech-color:${t.color}">${mark(t)}<span>${e(t.name)}</span><small>${t.projects.length} ${t.projects.length === 1 ? "projeto" : "projetos"}</small>${arrow}</button>`,
         )
         .join("")}</div></section>`,
   )
   .join("")}</div>
 <p class="ecosystem-caption">Do código à experiência. Cada conexão tem uma aplicação real.</p></div>
 <a class="inspector-jump js-only" href="#tech-details" data-inspector-link>Ver detalhes de JavaScript</a><aside id="tech-details" tabindex="-1" class="tech-inspector" aria-label="Detalhes da tecnologia"><div class="inspector-label"><span>Em foco</span><span class="inspector-led" aria-hidden="true"></span></div>${tech
   .map((t) => {
     const related = relations
       .filter((r) => r.source === t.id || r.target === t.id)
       .map((r) => ({
         tech: tech.find(
           (a) => a.id === (r.source === t.id ? r.target : r.source),
         ),
         reason: r.reason,
       }));
     return `<article data-tech-panel="${t.id}" ${t.id === "javascript" ? 'class="is-current"' : ""}><header>${mark(t)}<div><p>${e(categories.find((c) => c.id === t.category).name)}</p><h2>${e(t.name)}</h2></div></header><p>${e(t.description)}</p><h3>Na prática</h3><p>${e(t.application)}</p><h3>Projetos conectados</h3><div class="inspector-projects">${projects
       .filter((p) => t.projects.includes(p.slug))
       .map(
         (p) =>
           `<a href="${p.slug}.html"><span>${e(p.title)}<small>${e(p.category)}</small></span>${arrow}</a>`,
       )
       .join(
         "",
       )}</div><h3>Conecta com</h3><div class="related-tech">${related.map((r) => `<button type="button" data-tech-select="${r.tech.id}" title="${e(r.reason)}">${e(r.tech.name)}</button>`).join("")}</div></article>`;
   })
   .join(
     "",
   )}</aside></div><p class="sr-only" data-tech-status role="status" aria-live="polite"></p></section>`;
}
export function renderProjects(projects, data, repositories, visual) {
  const tech = [...new Set(projects.flatMap((p) => p.technologies))].sort();
  const categories = [
    ...new Set(projects.map((p) => p.category.split(" · ")[0])),
  ];
  const item = (p) =>
    `data-project-entry data-type="${p.type}" data-category="${e(p.category.split(" · ")[0])}" data-technologies="${e(p.technologies.join("|"))}"`;
  const badge = (p) =>
    `<span class="project-state" data-state="${p.status}"><span aria-hidden="true"></span>${statusLabels[p.status]}</span>`;
  return `<section class="project-experiences" data-project-catalog><header class="explore-heading"><div><h1>Ideias em movimento<span>.</span></h1><p>Entre na interface. Explore as decisões.<br> Conheça o código por trás de cada experiência.</p></div><a class="text-link" href="#github-archive">Todos no GitHub ${arrow}</a></header><div class="catalog-controls js-only"><label>Tipo<select data-project-filter="type"><option value="all">Todos os tipos</option><option value="web">Web</option><option value="mobile">Mobile</option><option value="local">Aplicação local</option></select></label><label>Categoria<select data-project-filter="category"><option value="all">Todas as categorias</option>${categories.map((c) => `<option>${e(c)}</option>`).join("")}</select></label><label>Tecnologia<select data-project-filter="technologies"><option value="all">Todas as tecnologias</option>${tech.map((t) => `<option>${e(t)}</option>`).join("")}</select></label><button type="button" class="text-button" data-reset-filters>Limpar filtros</button></div><p class="catalog-count" role="status" aria-live="polite" data-project-count>${projects.length} projetos para explorar</p><div class="editorial-projects">${projects
    .filter((p) => p.featured)
    .map(
      (p) =>
        `<article class="editorial-project ${p.slug}" ${item(p)}><a class="editorial-visual" href="${p.slug}.html" aria-label="Explorar ${p.title}">${visual(p)}</a><div class="editorial-copy">${badge(p)}<h2><a href="${p.slug}.html">${e(p.title)} ${arrow}</a></h2><p class="project-category">${e(p.category)}</p><p>${e(p.summary)}</p><div class="tech-tags">${p.technologies.map((t) => `<span>${e(t)}</span>`).join("")}</div><a class="text-link" href="${p.slug}.html">Explorar estudo de caso ${arrow}</a>${p.demo ? `<a class="text-link" href="${p.slug}.html#demonstracao">Abrir demo navegável ${arrow}</a>` : p.release ? `<a class="text-link" href="${e(p.release)}">Conhecer versão beta ${arrow}</a>` : ""}</div></article>`,
    )
    .join(
      "",
    )}</div><section class="project-archive"><h2>Outras explorações<span>.</span></h2>${projects
    .filter((p) => !p.featured)
    .map(
      (p) =>
        `<article ${item(p)}><div><h3><a href="${p.slug}.html">${e(p.title)} ${arrow}</a></h3><p>${e(p.summary)}</p></div><div class="archive-meta"><span>${e(p.technologies.join(" / "))}</span>${badge(p)}</div></article>`,
    )
    .join(
      "",
    )}</section><div class="catalog-empty" data-project-empty hidden><h2>Nenhum projeto nesta combinação.</h2><p>Experimente outra tecnologia ou limpe os filtros.</p><button class="button" type="button" data-reset-filters>Mostrar todos os projetos</button></div><section class="github-archive" id="github-archive"><div><h2>Código aberto<br>para explorar<span>.</span></h2><p>Repositórios públicos do GitHub, incluindo projetos, ferramentas e o código deste portfólio.</p><p class="small">Inventário consultado em 9 de novembro de 2026. Repositórios privados permanecem protegidos.</p></div><div>${repositories.map((r) => `<a href="${e(r.url)}"><span>${e(r.name)}</span>${arrow}</a>`).join("")}</div></section></section>`;
}
export function renderCase(p, data, visual, button) {
  const goals = {
    aranhaverso:
      "Aprofundar animação e estilização de interfaces em uma experiência navegável sobre as três versões do Homem-Aranha.",
    "lista-tarefas":
      "Organizar tarefas da rotina em um aplicativo Android de consulta e atualização simples.",
    nexusfc:
      "Reunir leitura de notícias e gerenciamento de conteúdo em um portal acadêmico full stack.",
  };
  const problems = {
    aranhaverso:
      "Apresentar histórias, filmes e personagens de três universos cinematográficos com uma navegação compreensível.",
    "lista-tarefas":
      "Uma necessidade pessoal de organizar tarefas e acompanhar a rotina.",
    nexusfc:
      "O TCC do curso técnico exigia um sistema que conectasse a experiência de leitura à gestão de notícias e perfis.",
  };
  const sections = [
    ["visao-geral", "Visão geral", p.description],
    ["necessidade", "Problema ou necessidade", problems[p.slug] || p.challenge],
    [
      "objetivos",
      "Objetivos",
      goals[p.slug] ||
        "O objetivo específico ainda não está documentado além do escopo descrito na visão geral.",
    ],
    ["arquitetura", "Arquitetura e decisões técnicas", p.architecture],
    ["processo", "Processo de desenvolvimento", p.process],
    ["desafios", "Desafios encontrados", p.challenge],
    ["solucoes", "Soluções implementadas", p.solution],
    ["resultado", "Resultado final", p.outcome],
  ];
  const technologies = data.technologies.filter(
    (t) => t.projects.includes(p.slug) && p.technologies.includes(t.name),
  );
  return `<a class="back" href="projetos.html">Voltar aos projetos</a><header class="explore-heading case-intro"><div><h1>${e(p.title)}<span>.</span></h1><p>${e(p.summary)}</p></div><span class="project-state" data-state="${p.status}"><span aria-hidden="true"></span>${statusLabels[p.status]}</span></header><div class="case-meta"><span>${e(p.category)}</span><span>${e(p.role)}</span><span>${e(p.technologies.join(" / "))}</span></div>${p.featured ? `<figure class="case-visual ${p.slug}">${visual(p)}<figcaption>${e(p.imageNote || "Capa ilustrativa. Não representa uma tela do aplicativo.")}</figcaption></figure>` : ""}<div class="case-study"><nav class="case-index" aria-label="Neste estudo de caso"><span>Neste projeto</span>${sections.map(([id, title]) => `<a href="#${id}">${title}</a>`).join("")}<a href="#tecnologias">Tecnologias utilizadas</a><a href="#demonstracao">Demonstração e código</a></nav><div class="case-narrative">${sections.map(([id, title, text]) => `<section id="${id}"><h2>${title}</h2><p>${e(text)}</p></section>`).join("")}<section id="tecnologias"><h2>Tecnologias utilizadas</h2><div class="case-technologies">${p.technologies
    .map((name) => {
      const t = technologies.find((t) => t.name === name);
      return t
        ? `<a href="habilidades.html#${t.id}">${mark(t)}${e(name)}</a>`
        : `<span>${e(name)}</span>`;
    })
    .join(
      "",
    )}</div><a class="text-link" href="habilidades.html">Explorar o ecossistema ${arrow}</a></section><section id="demonstracao" class="case-demo"><h2>Demonstração e código</h2>${p.demo ? `<p>${p.slug === "aranhaverso" ? "Demo visual navegável exportada dos templates do projeto: troca de universos, filtros, filmes e galerias. Os dados são uma cópia de apresentação; PHP e MySQL não são executados nesta demo." : "Protótipo visual navegável. Notícias ilustrativas; autenticação, persistência e administração do backend não estão ativas."}</p><div class="demo-container" data-demo-container><button type="button" class="button js-only" data-load-demo="${e(p.demo)}" data-demo-title="Demonstração de ${e(p.title)}">Carregar demonstração</button><p class="demo-status" data-demo-status role="status"></p><div data-demo-mount></div><button type="button" class="text-button" data-close-demo hidden>Fechar demonstração</button></div><a class="text-link" href="${e(p.demo)}" target="_blank" rel="noopener noreferrer">Abrir demo em outra aba ${arrow}</a>` : p.slug === "lista-tarefas" ? "<p>A versão beta é distribuída para Android. O código-fonte é privado e ainda não há capturas reais ou uma versão executável no navegador. A capa acima é ilustrativa.</p>" : "<p>Ainda não há demonstração pública integrada. O conteúdo técnico disponível está apresentado neste estudo.</p>"}<div class="actions">${p.repository ? button(p.repository, p.slug === "lista-tarefas" ? "Página de distribuição" : "Ver repositório", true) : ""}${p.release ? button(p.release, "Conhecer a versão beta") : ""}</div>${p.release ? '<p class="small">Beta em testes. Notificações reais e validação da migração de dados ainda não estão disponíveis. Leia as limitações na página da versão.</p>' : ""}</section><section class="case-sources"><h2>Fontes e documentação</h2><p>Informações do catálogo do portfólio e ${p.repository ? "do README público do projeto." : "da documentação original preservada."} Detalhes não disponíveis são identificados acima, sem presumir resultados ou métricas.</p>${p.repository ? `<a class="text-link" href="${e(p.repository)}#readme">Consultar a documentação ${arrow}</a>` : ""}</section></div></div>`;
}
export function renderLab(data) {
  const icons = {
    ui: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 10h16M10 10v10"/>',
    animation: '<path d="m5 4 15 8-15 8V4Z"/>',
    terminal: '<path d="m4 6 6 6-6 6m9 0h7"/>',
  };
  return `<section class="riquelme-lab" data-lab><header class="explore-heading"><div><h1>Riquelme Lab<span>.</span></h1><p>Um espaço para testar ideias com as próprias mãos.<br> Altere, explore, descubra o que acontece.</p></div><a class="text-link" href="habilidades.html">Explorar tecnologias ${arrow}</a></header><div class="lab-shell"><nav class="lab-navigation" aria-label="Experimentos do laboratório"><div class="lab-tablist" role="tablist" aria-orientation="vertical" aria-label="Escolha um experimento">${data.experiments.map((x, i) => `<button type="button" id="tab-${x.id}" role="tab" aria-controls="experiment-${x.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? "0" : "-1"}" data-experiment="${x.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">${icons[x.id]}</svg><span>${e(x.name)}<small>${e(x.category)}</small></span></button>`).join("")}</div><p class="lab-navigation-note">Construído para experimentar.<br>Sem sair do navegador.</p><a class="text-link" href="projetos.html">Ver projetos ${arrow}</a></nav><div class="lab-workbench">${data.experiments.map((x) => `<section class="experiment-panel" id="experiment-${x.id}" role="tabpanel" aria-labelledby="tab-${x.id}" tabindex="0" data-experiment-panel="${x.id}" ${x.id === "ui" ? "" : "hidden"}><header class="experiment-heading"><div><h2>${e(x.name)}</h2><p>${e(x.description)}</p></div><span class="experiment-state">Disponível</span></header><div class="experiment-tech">${x.technologies.map((t) => `<span>${e(t)}</span>`).join("")}</div>${x.id === "ui" ? renderUI() : x.id === "animation" ? renderAnimation() : renderTerminal()}</section>`).join("")}<p class="sr-only" data-lab-status role="status"></p><noscript><p>Os controles dos experimentos precisam de JavaScript. Você pode continuar explorando <a class="text-link" href="projetos.html">os estudos de caso</a>.</p></noscript></div></div></section>`;
}
function renderUI() {
  return `<div class="ui-playground" data-ui><form class="ui-controls"><label>Cor principal<input type="color" value="#709bff" data-ui-control="color"></label><label>Formato<select data-ui-control="format"><option value="button">Botão</option><option value="badge">Etiqueta</option><option value="panel">Painel</option></select></label><label>Arredondamento <output data-ui-output="radius">14 px</output><input type="range" min="0" max="48" value="14" data-ui-control="radius"></label><label>Borda <output data-ui-output="border">1 px</output><input type="range" min="0" max="6" value="1" data-ui-control="border"></label><label>Espaçamento <output data-ui-output="spacing">24 px</output><input type="range" min="12" max="48" value="24" data-ui-control="spacing"></label><label>Sombra <output data-ui-output="shadow">20 px</output><input type="range" min="0" max="50" value="20" data-ui-control="shadow"></label><label>Interação<select data-ui-control="animation"><option value="lift">Elevar ao interagir</option><option value="scale">Ampliar ao interagir</option><option value="none">Sem animação</option></select></label><button type="button" class="text-button" data-ui-reset>Restaurar valores</button></form><div class="ui-result"><div class="preview-label"><span>Prévia em tempo real</span><span>CSS</span></div><div class="ui-preview" data-ui-preview style="--ui-color:#709bff;--ui-radius:14px;--ui-border:1px;--ui-spacing:24px;--ui-shadow:20px"><button type="button" class="playground-component" data-ui-shape="button">Explore as possibilidades ${arrow}</button><span class="playground-component" data-ui-shape="badge" hidden>Interface em construção</span><article class="playground-component" data-ui-shape="panel" tabindex="0" hidden><h3>Uma ideia ganha forma.</h3><p>Ajuste os controles e acompanhe cada detalhe.</p></article></div><div class="code-heading"><span>Seu CSS</span><button class="text-button" type="button" data-copy-css>Copiar CSS</button></div><pre tabindex="0" aria-label="Código CSS da prévia"><code data-ui-code>.playground-component { border-radius: 14px; padding: 24px; }</code></pre><p class="lab-feedback" data-ui-status role="status" aria-live="polite"></p></div></div>`;
}
function renderAnimation() {
  const demos = [
    [
      "entrance",
      "Entrada",
      "Deslocamento, opacidade e escala.",
      '<div class="anim-entry"></div><div class="anim-entry"></div><div class="anim-entry"></div>',
    ],
    [
      "hover",
      "Hover & foco",
      "Aponte, toque ou use Tab para explorar.",
      '<button type="button" class="anim-hover">Experimente</button>',
    ],
    [
      "state",
      "Transição de estados",
      "Alterne a composição sem interromper o fluxo.",
      '<button type="button" class="anim-state" aria-pressed="false">Alternar estado<span></span></button>',
    ],
    [
      "svg",
      "Traço SVG",
      "Um caminho desenhado ao longo do tempo.",
      '<svg viewBox="0 0 240 100" aria-hidden="true"><path class="anim-path" d="M10 70C50 70 40 10 90 30S140 100 175 50s35-30 55-20"/></svg>',
    ],
    [
      "depth",
      "Profundidade",
      "Camadas em perspectiva com transformação 3D.",
      '<div class="anim-depth"><i></i><i></i><i></i></div>',
    ],
    [
      "spring",
      "Mola",
      "Uma curva com ultrapassagem e acomodação.",
      '<div class="anim-track"><span class="anim-spring"></span></div>',
    ],
  ];
  return `<p class="animation-help">Cada experimento tem seu próprio controle de pausa e reinício. O controle global de movimento sempre prevalece.</p><div class="animation-gallery">${demos.map(([id, name, description, art]) => `<article class="animation-demo" data-animation="${id}"><div class="animation-stage">${art}</div><h3>${name}</h3><p>${description}</p><div class="animation-controls"><button type="button" data-animation-pause aria-pressed="false" aria-label="Pausar ${name}">Pausar</button><button type="button" data-animation-restart aria-label="Reiniciar ${name}">Reiniciar</button></div></article>`).join("")}</div><p class="lab-feedback" data-animation-status role="status" aria-live="polite"></p>`;
}
function renderTerminal() {
  return `<div class="terminal" data-terminal><div class="terminal-title"><span>riquelme@playground</span><span>Navegação interativa</span></div><div class="terminal-output" data-terminal-output role="log" aria-live="polite" aria-label="Histórico do terminal" tabindex="0"><p>Bem-vindo ao Riquelme Digital Playground.</p><p>Digite help para ver os comandos disponíveis.</p></div><form data-terminal-form><label for="terminal-command"><span aria-hidden="true">riquelme ~ $</span><span class="sr-only">Comando do terminal</span></label><input id="terminal-command" name="command" type="text" maxlength="80" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="help" aria-describedby="terminal-hint"><button type="submit">Executar</button></form></div><p id="terminal-hint" class="terminal-hint">Comandos de navegação: help, about, skills, projects, lab, contact e clear. Use ↑ e ↓ para rever o histórico.</p><div class="terminal-shortcuts" role="group" aria-label="Executar comando"><button type="button" data-command="help">help</button><button type="button" data-command="about">about</button><button type="button" data-command="skills">skills</button><button type="button" data-command="projects">projects</button><button type="button" data-command="contact">contact</button><button type="button" data-command="clear">clear</button></div>`;
}
