# Riquelme — Digital Playground

Implementação local na branch `codex/riquelme-digital-playground`, em seis fases. Sem deploy ou push. Home preservada, com link Lab na navegação compartilhada.

## Executar

Requer Node 22+:

```sh
npm ci
npm run build
npm test
npm run preview
```

Abra `http://127.0.0.1:8765/habilidades.html`. A prévia serve somente `dist`, aplica a CSP e os headers existentes e não expõe fontes ou banco. `PORT=8766 npm run preview` altera a porta. Para XAMPP, copie o conteúdo de `dist` para sua pasta pública e inicie Apache; o portfólio e suas demos não precisam de MySQL.

## Funcionalidades

- **Habilidades**: 14 tecnologias em seis áreas, 15 conexões com significado técnico, ícones locais, painel contextual e projetos associados. Abertura em JavaScript → Aranhaverso, confirmada pelo usuário. Mapa e lista gerados da mesma fonte. Seleção por mouse, toque e teclado; setas percorrem o mapa. Link direto `habilidades.html#react-native` seleciona uma tecnologia. No celular, o link “Ver detalhes” aproxima o painel após a seleção. Sem JS, lista e informações essenciais continuam disponíveis.
- **Projetos**: nove estudos, três destaques editoriais com mockups existentes, seis explorações adicionais, filtros combináveis por tecnologia/categoria/tipo, contagem e estado vazio. Inventário de todos os dez repositórios públicos consultados. Repositórios privados não entram na saída pública.
- **Estudos**: visão geral, necessidade, objetivos, tecnologias, arquitetura/decisões, processo, desafios, soluções, resultado, demonstração/código e fontes. Ausências de documentação são explícitas. Código privado não é reproduzido.
- **Demos**: Aranhaverso com 11 páginas (home, universos e nove filmes); troca de protagonistas, filtros, navegação e galeria ampliável. NexusFC e Hogwarts preservados. Demos incorporadas sob demanda em iframe sandbox, sem mesma origem, com alternativa de nova aba. Backend não é simulado como funcional. ListaTarefas mantém a capa ilustrativa e o link beta Android.
- **UI Playground**: cor, formato, borda, arredondamento, sombra, espaçamento e interação, com prévia imediata e CSS copiável. A cópia tem fallback de seleção.
- **Animation Playground**: entrada, hover/foco/toque, estados, traço SVG, profundidade e mola CSS com pausa/reinício individuais. A mola é aproximação por curva CSS, não simulação de física. Reduced-motion, pausa global, viewport, aba oculta e troca de experimento limitam movimento.
- **Terminal**: help/about/skills/projects/lab/contact/clear, histórico pelas setas, entradas limitadas, saída como texto e destinos locais permitidos. Sem eval, shell, rede ou execução arbitrária.

## Arquitetura e arquivos

- `content/projects.json`: nove projetos validados em `scripts/catalog.mjs`; informações técnicas e estados explícitos.
- `content/ecosystem.json`: categorias, tecnologias, relações e registro dos experimentos. `scripts/playground-data.mjs` valida estrutura, IDs e referências.
- `content/repositories.json`: inventário somente de repositórios públicos. Não há sincronização automática em tempo de navegação; atualizações passam por revisão do arquivo.
- `scripts/playground-ui.mjs`: templates das três superfícies e estudos, chamados pelo gerador existente. Conteúdo essencial está no HTML final.
- `assets/css/playground.css`: estilos carregados apenas nas páginas alteradas/Lab; usa tokens Orbit e alternativa clara existentes.
- `assets/js/ecosystem.js`, `projects.js`, `lab.js`: módulos por superfície. `assets/js/lab/` tem um módulo por experimento, importado sob demanda e inicializado uma vez.
- `scripts/export-aranhaverso.py`: exportação opcional reproduzível dos templates PHP locais. Não é necessário para build normal; HTML e assets da demo estão versionados. Uso: `python3 scripts/export-aranhaverso.py /caminho/do/projeto /caminho/do/php`.
- `scripts/preview.mjs`: prévia estática local restrita à saída pública.
- `tests/playground.test.mjs` e `scripts/test-browser.mjs`: validações de integração/dados, segurança, Home e fluxos de navegador.
- HTMLs da raiz, sitemap e `dist` são gerados pelo build. Mantenha edições nos templates e nos dados.

### Adicionar tecnologia, projeto ou experimento

1. Projeto: adicionar ao catálogo com slug único, fontes e estado confirmado. URLs HTTPS e assets públicos são validados. Não preencher lacunas com suposições.
2. Tecnologia: adicionar em `ecosystem.json` com categoria, ícone local e projetos existentes. Conexões exigem uma justificativa e projetos em comum.
3. Experimento: criar um módulo em `assets/js/lab/` com `mount(panel)` e retorno opcional `setActive(boolean)`; registrá-lo no schema/allowlist de módulos, nos metadados, no template e no carregador `lab.js`. Sem caminhos de importação fornecidos por entradas de usuário.
4. Executar build e testes.

## Limitações

- Demonstrações são frontends de apresentação com dados do projeto; não disponibilizam banco, login ou administração reais. O usuário esclareceu que deseja esse formato, igual ao NexusFC.
- Não existem capturas reais nem versão web do ListaTarefas. Detalhes internos do beta não documentados publicamente permanecem ausentes.
- A revisão dos privados foi limitada ao acesso disponível, sem publicá-los. Um README não foi encontrado; nenhum projeto privado novo foi divulgado.
- Estado de conclusão dos demais projetos não confirmado. Métricas de resultado e cronogramas não foram inventados.
- Sem publicação, teste em aparelho físico, Safari/Firefox ou medição de Core Web Vitals de usuários. Testes de navegador usam Chromium local.

## Verificação

Resultados detalhados estão registrados em `docs/digital-playground-validation.md`. Capturas locais ficam em `.impeccable/review/` e relatórios de execução em `.local/playground/`, fora do pacote público.

## Demos ampliadas

Todos os oito projetos atualmente exibidos possuem demonstração. A nova implementação, origens, limitações e testes estão em [Demonstrações dos projetos](project-demos.md). Esse registro substitui as limitações históricas acima sobre ausência de uma demo web do ListaTarefas e sobre demos disponíveis apenas para parte dos projetos. O ListaTarefas web é uma adaptação explicitamente identificada; o app nativo e seu código privado não foram publicados.
