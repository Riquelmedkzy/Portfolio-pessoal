# Riquelme — Digital Playground

Registro da extensão implementada em 09/11/2026. Modo Experience em Habilidades e Projetos; Operate nos experimentos do Lab. Este arquivo descreve decisões destas superfícies, sem criar outro sistema visual.

## Autoridade e limites

Orbit continua sendo o mundo visual. `DESIGN.md` e `.impeccable/design.json` permanecem preservados. `styles.css` fornece a paleta semântica, os temas escuro e claro, DM Sans, contêiner, navegação, botões e foco; `assets/css/playground.css` acrescenta a composição local e não é carregado pela Home. Monospace genérica identifica somente código e comandos, sem acrescentar uma família de display.

Os novos nós, seletores, painel contextual e abas herdam os papéis de superfície, texto, contorno e ação de Orbit. Ícones e cores reconhecíveis das tecnologias permanecem locais ao conteúdo. Ciano e violeta distinguem detalhes e demonstrações; os valores editáveis do UI Playground descrevem sua prévia, não tokens globais. A fotografia, a órbita e a composição da Home não fazem parte desta extensão. Não há publicação autorizada do portfólio.

## Habilidades — mapa, lista e painel

A primeira viewport combina título curto, seletor de categoria, alternância mapa/lista e um mapa de nós com conexões SVG. A seleção inicial confirmada pelo usuário é **JavaScript → Aranhaverso**; um fragmento de URL válido pode abrir outra tecnologia. Os 14 nós e as 15 relações em seis áreas são derivados de `content/ecosystem.json`, com referências ao catálogo de projetos. Mapa, lista e painel utilizam essa mesma fonte.

A assinatura é a relação entre seleção e evidência: selecionar um nó atualiza o painel com descrição, aplicação prática, projetos e tecnologias relacionadas. Somente as conexões técnicas documentadas do nó recebem destaque. Hover e foco antecipam relações sem trocar a seleção; `aria-pressed`, rótulos e região de status tornam o estado perceptível além da cor. Setas percorrem os nós visíveis; clique, toque e ativação por teclado selecionam. O filtro de categoria reorganiza a exploração sem recarregar a página.

Em desktop o painel ocupa a coluna lateral. Até 800px passa para baixo do mapa/lista e o link “Ver detalhes” aproxima o conteúdo selecionado. Até 520px os nós abandonam as coordenadas absolutas e formam três colunas; as conexões são recalculadas a partir das posições reais. A alternativa lista apresenta grupos e seleção equivalentes. Sem JavaScript, a lista e as informações essenciais permanecem no HTML.

Entrada progressiva dos nós, revelação das linhas, sinal nas conexões selecionadas e transição curta do painel pertencem a esta exploração. Movimento reduzido e pausa global mantêm conteúdo legível; o mapa também suspende reprodução fora da viewport e em aba oculta.

## Projetos — índice editorial e estudos

O índice substitui a grade convencional por três destaques editoriais alternados: Aranhaverso, ListaTarefas e NexusFC. O segundo destaque inverte a posição de visual e texto; até 650px todos seguem uma coluna com o visual primeiro. Mockups reutilizam o material existente. ListaTarefas conserva a arte explicitamente ilustrativa e o link beta Android, sem apresentar uma captura ou versão web inexistente.

Seis explorações adicionais aparecem como linhas de arquivo, com metadados e acesso aos respectivos estudos. Seletores combináveis de tecnologia, categoria e tipo controlam o conjunto, acompanhado de contagem e estado vazio com ação para restaurar os filtros. Estados de projeto usam os dados documentados; ausência de confirmação permanece explícita. O inventário de repositórios públicos é separado dos estudos e não publica conteúdo privado.

Os nove estudos usam narrativa contínua com índice lateral sticky, transformado em índice de duas colunas no móvel. As seções cobrem contexto, necessidade, objetivos, tecnologias, decisões, processo, desafios, soluções, resultado e demonstração/fontes. Lacunas documentais são declaradas; não há métricas ou funcionalidades presumidas. Links de tecnologia retornam à exploração correspondente em Habilidades. Transições de navegação são melhoria progressiva, desativada com movimento reduzido.

## Lab — bancada e experimentos

O Lab mantém navegação por experimentos à esquerda e uma bancada com controles e resultado. Até 800px a navegação passa para uma faixa superior; até 520px controles e prévia empilham. Abas têm seleção e foco explícitos, navegação pelas setas, Home/End e acesso por fragmento. Módulos de UI, animação e terminal são importados sob demanda por uma lista fixa em `assets/js/lab.js`, inicializados uma vez e avisados quando ficam inativos.

- **UI Playground:** cor, formato, arredondamento, borda, espaçamento, sombra e interação atualizam uma prévia imediata de botão, etiqueta ou painel. O CSS correspondente pode ser copiado, com seleção manual como fallback. Restaurar valores retorna aos padrões deste experimento; as alterações não modificam o tema do portfólio.
- **Animation Playground:** seis demonstrações de entrada, hover/foco/toque, estados, traço SVG, profundidade e mola têm pausa e reinício individuais. A mola usa intencionalmente `cubic-bezier(0.2, 1.6, 0.4, 1)` para ultrapassar o destino; a transição de estados também tem overshoot próprio. São demonstrações solicitadas, não regras de movimento para outras páginas nem simulação física. Movimento reduzido, pausa global, visibilidade do exemplo, aba oculta e troca de experimento condicionam a reprodução.
- **Terminal:** comandos fixos `help`, `about`, `skills`, `projects`, `lab`, `contact` e `clear`, atalhos visuais e histórico pelas setas. Saída usa texto; destinos são locais e permitidos. A apresentação de terminal serve à navegação do portfólio, sem executar shell, código arbitrário ou chamadas de rede.

## Demonstrações locais

Aranhaverso possui 11 páginas estáticas locais: início, universos e nove filmes. Troca de protagonistas, filtros, navegação e galeria ampliável integram a demonstração; a identidade temática pertence ao projeto demonstrado, sem alterar Orbit. NexusFC e Hogwarts preservam suas demonstrações existentes.

O estudo carrega a demo apenas após ação explícita, dentro de iframe sandbox sem permissão de mesma origem, e oferece fechar e abrir em nova aba. Estas são apresentações de frontend; banco, login e administração reais não são anunciados como disponíveis. A restrição de incorporação e o carregamento sob demanda fazem parte do mecanismo desta superfície.

## Evidência e divergência preservada

Registro conferido contra `styles.css`, `assets/css/playground.css`, `scripts/playground-ui.mjs`, módulos de ecossistema/projetos/Lab, páginas locais de Aranhaverso, `docs/digital-playground.md`, `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json` e o pedido original. O revisor independente de acabamento aprovou a extensão para entrega e validou as 16 capturas desktop/móvel; esta passagem de documentação não repetiu a execução de navegador.

O contexto global ainda descreve a antiga grade de Projetos e cartões/faixa de Habilidades, inclusive nos exemplos do sidecar. Essas descrições anteriores não representam a composição local atual; são registradas aqui como divergência documental preservada, sem reparar ou ampliar o contexto global nesta extensão. Não foram canonizados novos tokens, proibições globais, padrões de rótulos ou alegações de produto a partir de detalhes destas páginas.
