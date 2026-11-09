# Digital Playground — auditoria e plano

Data: 9 de novembro de 2026. Branch: `codex/riquelme-digital-playground`.

## Arquitetura verificada
- Site estático multipágina, gerado por `scripts/build.mjs` (Node 22+, única dependência Zod). `content/projects.json` valida sete projetos; `dist/` é a saída pública por allowlist.
- PHP/SQL são material legado; wrappers mantêm os endereços antigos. Não são necessários para executar o site e não serão alterados.
- Identidade Orbit: DM Sans, azul noturno, tema claro opcional, ícones SVG locais, controle global de movimento e retrato com painéis orbitais.
- Home em template independente: preservar conteúdo, composição, retrato e scripts orbitais. Única integração prevista: link Lab na navegação compartilhada.
- SEO individual, canonical, sitemap, JSON-LD, CSP e redirecionamentos existentes serão preservados; incluir Lab no gerador.

## Evidências e limites
- Catálogo e `docs/fontes.md` contêm autoria e contexto confirmados, links de repositório, instalação e demonstrações.
- Aranhaverso: PHP MVC, MySQL, CSS e JavaScript; capturas reais desktop/mobile; não existe demo pública integrada. Exibir imagem como captura, nunca como aplicação ativa.
- ListaTarefas: React Native/Expo/TypeScript, beta 2.0, código privado; sem screenshots reais. Não inventar telas, notificações ou persistência.
- NexusFC: TCC full stack, PHP MVC/MySQLi/MySQL/MariaDB, autenticação e consultas preparadas documentadas. A demo local é protótipo visual, sem backend; carregar sob demanda em iframe isolado.
- Projetos complementares: manter textos originais; não presumir datas, métricas, detalhes de implementação ou estado de conclusão.

## Riscos e mitigação
- Dados falsamente inferidos: campos técnicos não disponíveis serão identificados como “Ainda não documentado”. Estado “Não informado” quando não confirmado; beta do ListaTarefas comprovado.
- Mapa ilegível no celular: layout próprio em duas colunas, seleção por toque/teclado, modo lista com a mesma fonte de dados e conteúdo essencial gerado em HTML.
- Peso de demos/animações: sem dependências novas; SVG/CSS/WAAPI nativos, pausa global e local, visibilidade da aba/viewport e reduced-motion.
- Segurança: terminal com comandos permitidos, saída por textContent, demos locais em sandbox, nenhuma chamada ao SO ou serviço privado.
- Regressão: testes de relações/rotas/SEO, Home preservada por comparação de conteúdo, navegação e interações em navegador desktop/mobile.

## Fases
1. Auditoria (este documento).
2. Dados compartilhados e validação de relações.
3. Habilidades: mapa conectado + lista + painel contextual.
4. Projetos: composição editorial, filtros, estudos técnicos e demo sob demanda.
5. Lab: registro extensível, UI Playground, Animation Playground e terminal.
6. Integração, testes e documentação. Commits locais por fase; sem push nem deploy.
