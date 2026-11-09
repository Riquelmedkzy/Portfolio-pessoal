# Validação — Digital Playground

9 de novembro de 2026. Branch `codex/riquelme-digital-playground`. Nenhum push, deploy, mudança de visibilidade de repositório ou alteração de banco.

## Resultados executados

| Verificação | Resultado |
| --- | --- |
| `npm run build` | 17 páginas geradas, 16 canônicas/indexáveis, catálogo e relações validados |
| `npm test` | 14 testes aprovados, zero falhas |
| `CHROME_PATH=/opt/google/chrome/chrome npm run test:browser` | 11 fluxos aprovados, saída 0 |
| Matriz de navegação | 16 páginas × 1440, 1024, 390 e 320 px = 64 combinações, sem imagens quebradas ou overflow horizontal |
| Erros de aplicação | Zero erros JavaScript e zero violações CSP no relatório final |
| axe-core 4.10.3 | Habilidades, Projetos, Lab e Aranhaverso; tags WCAG 2 A/AA e 2.1 AA; zero violações detectadas nos alvos auditados |
| Navegação sem JavaScript | Lista, 14 painéis de tecnologia, nove projetos e navegação principal disponíveis |
| Toque emulado | Contexto mobile de 390px com `hasTouch` e `isMobile`: seleção React Native, acesso ao painel e terminal aprovados |
| Links locais | 38 arquivos HTML da saída pública, nenhuma referência local quebrada |
| Home | Comparação exata com `main`: única diferença no HTML é o link Lab. CSS global, retrato e scripts de órbita/entrada/movimento idênticos |
| Segurança de saída | Sem PHP, SQL, código de build, credenciais ou diretórios privados em `dist` |
| `git diff --check` | Sem erros de whitespace |
| Revisão visual independente Impeccable | `ship`; 16 capturas desktop/mobile válidas; nenhuma correção material pendente |

Os fluxos de navegador verificam: seleção e filtros de tecnologias, mapa/lista e link profundo; filtros de projetos, estado vazio e reset; UI Playground, código, cópia/fallback e reset; pausa/reinício das animações, troca de experimento e pausa global; help, histórico, clear, comandos inválidos sem HTML ativo e navegação real; demos sob sandbox, universos, filtro, detalhes, galeria e fechamento; menu/Escape e painel no mobile; reduced-motion; rotas e conteúdo sem JavaScript.

O teste de navegador utiliza o servidor local com os mesmos headers/CSP configurados para produção. O auditor axe é carregado por um endpoint temporário interceptado somente no contexto de teste. `preload: false` impede que o auditor tente buscar CSS externo via `connect-src`; as regras WCAG, inclusive contraste, permanecem habilitadas. A CSP da aplicação não foi relaxada. A preferência por movimento reduzido é verificada após carregar a página com a preferência ativa.

## Evidências locais

- `.local/playground/browser-report.json`: 11 fluxos, 64 combinações, erros e resultados axe.
- `.local/playground/touch.json`: toque emulado.
- `.local/playground/demo-capture.json`: imagens da demo decodificadas e medidas.
- `.local/playground/design-detector.json`: detector mecânico, executado uma vez. Três avisos de mola/easing são intencionais no experimento solicitado; os demais são avisos informativos de escala/paleta. O sistema visual global foi preservado.
- `.impeccable/review/`: capturas de Habilidades, Projetos, UI Playground, Animation Playground, Terminal, casos Aranhaverso/NexusFC e demo Aranhaverso em 1440/390px. As duas capturas da demo foram refeitas após percorrer/decodificar as imagens lazy; os nove filmes aparecem nas evidências finais.

Evidências de QA ficam fora da saída pública e não são versionadas como parte do site. A revisão independente verificou as capturas corrigidas antes de emitir `ship`.

## Limites da verificação

Resultados de axe não são uma certificação de acessibilidade. Não houve teste em aparelho físico, leitor de tela, Safari/Firefox ou execução de backend dos projetos. Core Web Vitals de usuários e pontuações Lighthouse não foram medidos nesta entrega. O build não foi publicado; validação em domínio de produção depende de publicação futura autorizada.

As demos são visuais e navegáveis. A distribuição beta do ListaTarefas é preservada, sem inventar um aplicativo web ou telas reais. Lacunas documentais e estados de projeto não confirmados continuam explícitos.
