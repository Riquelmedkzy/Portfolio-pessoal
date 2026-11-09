---
name: Portfólio de Riquelme — Orbit
description: Portfólio pessoal de desenvolvimento web e aplicativos, com retrato estático e painéis orbitais.
colors:
  paper: "#050912"
  surface: "#0d1525"
  surface-raised: "#131f34"
  ink: "#f1f5ff"
  muted: "#a2b0ca"
  line: "#25334e"
  accent: "#709bff"
  action: "#315ff4"
  inverse: "#fff"
  glass: "#0a1123d9"
  action-hover: "#234ed5"
  panel-cyan: "#70d7fb"
  panel-blue: "#729fff"
  panel-violet: "#c4c3ff"
  light-paper: "#f7f8fc"
  light-surface: "#eef2f8"
  light-surface-raised: "#fff"
  light-ink: "#17243b"
  light-muted: "#4e6078"
  light-line: "#ccd5e3"
  light-accent: "#2454c6"
  light-action: "#2856db"
  light-glass: "#fffffff2"
typography:
  display:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "clamp(40px, 4.8vw, 68px)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "clamp(30px, 3.5vw, 48px)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "23px"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  body:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 500
rounded:
  field: "8px"
  button: "9px"
  panel: "13px"
  card: "15px"
  container: "16px"
  pill: "99px"
spacing:
  control-gap: "8px"
  action-gap: "12px"
  card-padding: "22px"
  gutter-mobile: "22px"
  gutter-tablet: "30px"
  gutter-desktop: "48px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.inverse}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-secondary:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
  filter:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.muted}"
    rounded: "{rounded.field}"
    padding: "9px 16px"
  filter-selected:
    backgroundColor: "{colors.action}"
    textColor: "{colors.inverse}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "13px 15px"
  navigation:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "5px"
  project-card:
    rounded: "{rounded.card}"
  skill-card:
    rounded: "{rounded.panel}"
    padding: "22px"
---

# Design System: Portfólio de Riquelme — Orbit

## Overview

**Creative North Star: "Orbit"**

Um ambiente de desenvolvimento em azul noturno: o retrato original permanece humano e imóvel enquanto pequenos painéis de código circulam ao redor. Superfícies discretas, tipografia direta e ações elétricas conduzem à exploração dos projetos e ao contato.

Esta documentação registra a substituição visual autorizada do antigo marfim e verde pelo sistema atual. O tema inicial é escuro; uma escolha manual persistida pode ativar a alternativa clara. As páginas de início, projetos, sobre, habilidades, serviços, contato e estudos de caso continuam separadas.

**Key Characteristics:**

- Retrato original em preto e branco, com óculos e moletom, preservado como recorte WebP estático.
- Azul elétrico para ações; ciano e violeta nos detalhes dos painéis.
- Navegação em cápsula de vidro, cartões delimitados e hierarquia em DM Sans.
- Movimento opcional, com controles de pausa e respeito à preferência por movimento reduzido.

## Colors

Os tokens do frontmatter correspondem às propriedades de `styles.css`; a alternativa clara substitui os mesmos papéis sem recuperar a antiga identidade verde.

### Primary

`action` preenche botões e filtros selecionados; `action-hover` responde ao hover. `accent` destaca palavras, links, foco, rotas de Habilidades e pequenos indicadores. O destaque do título inicial usa o gradiente existente de azul para azul claro.

### Secondary

`panel-cyan`, `panel-blue` e `panel-violet` distinguem ícones e sintaxe no conjunto orbital. As tecnologias em Habilidades mantêm suas próprias cores e ícones: Python, PHP, MySQL, MariaDB, SQLite, HTML, CSS, JavaScript, React, Expo e TypeScript. Essas cores são locais à tecnologia; não substituem o azul de ação.

### Neutral

`paper` é o fundo; `surface` sustenta cartões e formulários; `surface-raised` indica estados de navegação. `ink` é o texto principal, `muted` o texto secundário e `line` os contornos. `glass` conserva transparência no cabeçalho e nos controles secundários. `inverse` mantém o texto branco nas ações preenchidas em ambos os temas. Tokens `light-*` são os valores efetivamente usados no tema claro.

**The Semantic Color Rule.** Mantenha a função de cada variável nos dois temas; cores das tecnologias e da cena orbital são detalhes locais.

## Typography

DM Sans, com Arial e sans-serif como fallback, é a família aplicada a títulos, corpo e controles. Não foram acrescentadas fontes. O carregamento legado de DM Serif Display ainda existe, mas os estilos atuais não o usam para a hierarquia pública. O trecho ilustrativo de código usa a família genérica monospace.

O display do frontmatter corresponde ao título inicial em desktop; títulos de página usam `clamp(44px, 5.6vw, 76px)`. Habilidades usa essa mesma escala com seu ajuste próprio. A hierarquia permanece em peso 700, corpo regular e ações em peso 600. Parágrafos têm limite geral de 65ch, com introduções mais estreitas; legendas e rótulos usam tamanhos menores conforme seu componente.

**The Existing Font Rule.** Continue com DM Sans; não introduza uma nova família para simular um ambiente de código.

## Layout

O contêiner compartilhado tem largura máxima de 1320px e gutters de 48px, reduzidos para 30px até 1100px e 22px até 800px. O cabeçalho é sticky, separado da composição de cada página. O início combina texto e retrato em duas colunas; até 600px, empilha texto e cena. A cena inicial móvel tem altura máxima de 330px.

Projetos usa três colunas em desktop, duas até 800px e uma até 600px. Habilidades usa quatro colunas, três até 900px e duas até 700px; o breakpoint legado de uma coluna até 360px é sobreposto pelo tema atual, que conserva duas colunas até 600px. Serviços, jornada e conteúdo de casos passam de duas para uma coluna até 600px; contato já passa para uma coluna até 800px.

Espaçamento é contextual: os cartões de projeto usam 22px de padding no tamanho principal, com 22px de gap na grade. Os cartões de Habilidades usam 22px e gap de 16px; até 600px usam 18px e gap de 12px. Preserve as páginas e rotas existentes ao ampliar o catálogo.

## Elevation & Depth

A profundidade combina contraste tonal, transparência, bordas e sombras suaves. A cápsula de navegação usa blur de 18px; as ferramentas usam 16px. Cartões de projeto revelam um brilho radial sutil e borda de destaque no hover ou foco interno. Mockups de navegador e telefone têm sombras próprias e inclinação leve em ponteiro preciso quando o movimento está ativo.

O retrato ocupa a camada 10. Os seis painéis independentes alternam entre camadas 2 e 20 conforme a profundidade de sua órbita; escala, opacidade, rotação e deslocamento variam. Cada volta dura 30 segundos. Os painéis à frente passam pela área inferior da cena para preservar o rosto; o retrato não gira nem flutua. O recorte usa máscara de esvanecimento inferior. Os painéis recebem `0 14px 32px #0004, inset 0 -1px #6297ff`.

**The Still Portrait Rule.** Anime os painéis, não o retrato; mantenha a passagem dianteira abaixo do rosto.

## Shapes

Cápsulas arredondadas definem navegação e ferramentas; botões usam cantos de 9px. Filtros e campos usam 8px; painéis orbitais e cartões de Habilidades, 13px; cartões de projeto e formulário, 15px. Contornos finos delimitam superfícies sem impor uma grade visível sobre toda a página. Trilhas elípticas pertencem à cena orbital.

## Components

### Buttons and navigation

Botões principais têm altura mínima de 48px, padding de 12px por 20px e texto de 13px em peso 600. O hover escurece a ação e desloca o botão 2px para cima quando permitido. A variante secundária usa vidro e contorno. Até 800px, o tamanho e padding ficam menores; as duas ações iniciais móveis têm altura mínima de 44px.

A marca fica separada da cápsula. Links de navegação usam texto secundário, superfície elevada em hover e `aria-current="page"` para a rota ativa. Até 800px, com JavaScript, um botão abre o menu; sem JavaScript, os links permanecem disponíveis. Botões de tema e movimento têm rótulos acessíveis. Links, botões e campos recebem foco visível com outline de 2px e offset de 5px.

### Project filters and cards

Filtros são botões de 44px mínimos, com `aria-pressed` e preenchimento de ação na seleção. A grade mantém links para os estudos de caso; o filtro atualiza a quantidade exibida em uma região de status. Sem JavaScript, os filtros ficam ocultos e os projetos continuam visíveis.

Cartões combinam visual do projeto, contexto, descrição e tecnologias. Aranhaverso e NexusFC usam material visual existente; ListaTarefas usa arte tipográfica e simbólica, sem fingir uma captura de produto. O efeito de inclinação se limita aos mockups e respeita pausa e movimento reduzido.

### Portrait and orbital panels

A imagem é `assets/images/portrait-cutout.webp`, derivada do retrato original com óculos e moletom. São seis painéis: React, trecho de código, DEV, deploy, GitHub e terminal. A cena decorativa não exige interação e seus painéis são ocultos da árvore acessível. O texto de deploy é ilustrativo, sem afirmar uma publicação real.

A órbita para quando a cena sai da viewport, a aba fica oculta, a pessoa pausa animações ou prefere movimento reduzido. O retorno reinicia o relógio de frames sem acumular o tempo de ausência. Estados estáticos conservam a composição legível.

### Skills, ribbon and routes

Ícones coloridos acompanham cartões com discreto gradiente da tecnologia. Hover e foco interno destacam sua borda; os links levam aos projetos em que cada tecnologia foi aplicada. A faixa contínua mantém o ciclo existente de 42 segundos e um controle de pausa compartilhado. Rotas SVG desenham sua entrada e pontos de luz percorrem o caminho quando a cena está visível.

A pausa manual é persistida. A preferência por movimento reduzido interrompe animações e transições, esconde partículas e caret e mantém conteúdo acessível; o controle explica essa preferência e fica desabilitado. Órbita, partículas, faixa e rotas respeitam o ciclo de visibilidade da aba. Sem JavaScript, a faixa se apresenta sem movimento e sem duplicar os itens para leitores de tela. Animações de entrada são breves e o conteúdo não depende delas para aparecer.

### Contact composer

O formulário usa superfície, contorno e padding de 32px, reduzido para 23px no móvel. Rótulos explícitos acompanham campos de nome, email e mensagem; a validação é nativa. A ação prepara um `mailto:` para o aplicativo de email da pessoa, com nome, email e mensagem. O status instrui a concluir o envio no aplicativo: este formulário não envia nem armazena mensagens em servidor. Sem JavaScript, o compositor fica oculto e o endereço de email continua disponível.

## Do's and Don'ts

### Do:

- **Do** preserve o retrato original estático e o rosto livre durante a órbita.
- **Do** mantenha os papéis semânticos de cor e a alternativa clara implementada.
- **Do** preserve controles de pausa, foco visível e conteúdo disponível sem animação.
- **Do** mantenha as cores das tecnologias e a continuidade das rotas e da faixa em Habilidades.
- **Do** descreva o formulário como preparação de email e oriente a conclusão no aplicativo.

### Don'ts:

- **Don't** recupere marfim e verde como identidade principal deste sistema.
- **Don't** acrescente novas famílias tipográficas à hierarquia existente.
- **Don't** anime o retrato ou transforme os seis painéis em uma única imagem giratória.
- **Don't** invente métricas, credenciais, capturas de produto ou confirmação de envio.


<!-- Revisão autorizada do modo claro — 9/11/2026: fundo neutro frio, painéis brancos, contornos azul-acinzentados, ciano mais profundo em controles e painéis orbitais claros. Composição, tipografia e animações compartilhadas preservadas. Capturas reais dos projetos mantêm as cores da aplicação original. O UI Playground acompanha o tema e exporta as cores exibidas. -->
