# Auditoria de SEO — 8 de novembro de 2026

Produção auditada: https://matheus-riquelme-web.vercel.app/ . Repositório: https://github.com/Riquelmedkzy/Portfolio-pessoal . Alterações preparadas localmente; nenhuma publicação, push ou alteração no Search Console. O histórico referenciado só continha o pedido de aumentar a descoberta, sem autorização explícita para publicar.

## Diagnóstico e correções

| Prioridade | Evidência na produção | Correção preparada |
|---|---|---|
| P1 | Nenhum JSON-LD nas 13 páginas | Person, ProfessionalService e WebSite conectados por @id; hash exato autorizado na CSP |
| P1 | Serviços e localização pouco explicados; títulos principais genéricos | Home e serviços descrevem desenvolvimento web e criação de sites, atendimento online para projetos no RJ; sem sede física inventada |
| P2 | 404.html retorna 200 quando acessada diretamente e declara index,follow | noindex,follow no HTML, X-Robots-Tag na rota; endereços inexistentes já retornam 404 |
| P2 | /index.html duplica /; canonical já correto | Redirecionamento permanente e canonical mantido na raiz |
| P2 | processo.html redireciona por meta refresh para habilidades | Redirecionamento permanente para serviços; legado PHP acompanha o destino |
| P2 | demos bloqueadas no robots e simultaneamente marcadas noindex por cabeçalho | Permitir rastreamento para o Google receber o noindex; continuam fora do sitemap |
| P2 | Open Graph básico, sem descrição acessível da imagem ou Twitter card | og:site_name, og:image:alt, Twitter summary_large_image e metadados por página |
| P2 | Retrato de 132.738 bytes, oversized em mobile; fonte DM Serif Display sem uso | srcset 640/960/original com mesma transparência; dimensões intrínsecas corrigidas; só DM Sans solicitada |
| P2 | README descrevia uma lógica de domínio diferente da implementação | Documentação corrigida e previews Vercel isolados de indexação, mesmo herdando SITE_URL |
| P2 | Cards de serviços começavam em h3 imediatamente após h1 | h2 sem mudar o tamanho visual |

Robots e sitemap publicados respondem 200 e já apontam à origem oficial. As 13 URLs do sitemap publicado responderam 200 e possuíam canonical correto, título e description próprios. O conteúdo principal é HTML estático, disponível sem depender de renderização JavaScript. HTTPS funciona; URL HTTP é encaminhada a HTTPS. Não há bloqueio global ou noindex na home publicada. Isso comprova elegibilidade técnica, **não comprova indexação no Google**: a confirmação depende da Inspeção de URL no Search Console.

O domínio antigo https://riquelmedev.vercel.app/ ainda respondeu 200 sem mudar de host, com canonical para a origem atual. O repositório já contém uma regra de redirecionamento desse host: será preciso confirmar após publicação se o alias está vinculado ao mesmo projeto; se não estiver, configurar o redirecionamento no projeto antigo. O endereço informado no About do GitHub (`portfolio-pessoal-ten-weld.vercel.app`) retornou 404: atualizar o Website do repositório para a origem oficial. Nenhuma configuração de conta foi modificada.

## Metadados de cada página

Todos os títulos abaixo recebem o sufixo ` — Matheus Riquelme`. Canonical e og:url usam a origem oficial mais o caminho listado. A home usa `/`, nunca `/index.html`.

| Página | Título | Meta description |
|---|---|---|
| `/` | Desenvolvedor web no Rio de Janeiro | Matheus Riquelme, desenvolvedor web freelancer. Criação de sites, landing pages e sistemas web com atendimento online para projetos no Rio de Janeiro. |
| `/servicos.html` | Criação de sites no Rio de Janeiro | Criação de sites institucionais, landing pages, lojas virtuais e sistemas web. Conheça os serviços de Matheus Riquelme e converse sobre seu projeto no RJ. |
| `/projetos.html` | Projetos de desenvolvimento web e aplicativos | Conheça os projetos de Riquelme: Aranhaverso, ListaTarefas, NexusFC e outros estudos de desenvolvimento. |
| `/aranhaverso.html` | Aranhaverso: site interativo em PHP | Conheça o Aranhaverso, projeto pessoal de Matheus Riquelme com animações, páginas de filmes e desenvolvimento web em PHP, CSS e JavaScript. |
| `/lista-tarefas.html` | ListaTarefas: aplicativo Android | Conheça o ListaTarefas, aplicativo pessoal de organização para Android criado por Matheus Riquelme com React Native, Expo e TypeScript. Versão beta. |
| `/nexusfc.html` | NexusFC: portal de notícias em PHP | Conheça o NexusFC, portal de notícias de futebol desenvolvido no TCC. Desenvolvimento full stack em PHP e MySQL, com demonstração visual. |
| `/hogwarts.html` | Hogwarts: estudo de site temático | Explore o estudo web Hogwarts no portfólio de Matheus Riquelme: páginas das quatro casas e demonstração HTML navegável. |
| `/sexta-feira.html` | Sexta-Feira: assistente local em Python | Conheça o projeto Sexta-Feira: assistente local com Python, SQLite, chat e voz opcional. Veja o contexto e as limitações no portfólio. |
| `/ciberfolio.html` | Ciberfólio: site de portfólio em PHP | Conheça o Ciberfólio, projeto web com apresentação, serviços, portfólio e contato em PHP e MySQL. Veja o contexto de desenvolvimento. |
| `/gestao-compras.html` | Gestão de compras: sistema web em PHP | Conheça o projeto Gestão de compras, sistema web em PHP e MySQL com cadastro, autenticação e perfil de usuário. Veja o escopo no portfólio. |
| `/sobre.html` | Sobre o desenvolvedor web | Conheça Matheus Riquelme, desenvolvedor web freelancer com formação técnica em informática, projetos de sites e aplicativos e atendimento online para o RJ. |
| `/contato.html` | Contato para criação de sites e aplicativos | Converse com Matheus Riquelme sobre criação de sites, lojas virtuais, sistemas web e aplicativos. Atendimento online para projetos no Rio de Janeiro. |
| `/habilidades.html` | Habilidades em desenvolvimento web | Tecnologias aplicadas nos projetos de Riquelme: desenvolvimento web, bancos de dados e aplicativos. |

## Conteúdo, navegação e dados estruturados

A home conserva o H1 e a composição visual existentes. A introdução agora explica profissão, serviços e atendimento; uma seção abaixo do retrato leva a serviços e projetos. Serviços recebe H1 descritivo; os casos de projeto ganham metadados que descrevem o trabalho real, sem tratá-los como clientes. Permanecem disponíveis as páginas de sobre, habilidades, contato e os sete estudos de caso. Cada página indexável tem exatamente um H1. O catálogo de projetos usa um h2 acessível “Projetos em destaque” antes dos cards h3, preservando a hierarquia sem alterar o visual.

ProfessionalService descreve a oferta e a área atendida. Não foram acrescentados endereço físico, telefone, horário, avaliações, preços ou resultados comerciais sem evidência. Por isso a marcação não pretende cumprir os requisitos de resultado enriquecido de LocalBusiness do Google, que incluem endereço. JSON-LD válido e reconhecido semanticamente não equivale a rich result garantido. O Google pode não exibir Person, WebSite ou ProfessionalService de forma especial. Validar também no Schema Markup Validator e, depois da publicação, no Rich Results Test; esses validadores externos não foram executados nesta tarefa.

A política de segurança continua restritiva: o hash SHA-256 corresponde exatamente ao JSON-LD inserido no HTML. Não se abriu `unsafe-inline` para scripts. As imagens responsivas usam o mesmo retrato e transparência, sem alterar a animação orbital. O overflow horizontal temporário da animação de entrada é contido na raiz da página, mantendo a composição.

## Search Console após publicar

1. Abra https://search.google.com/search-console e selecione/adicione uma propriedade de **Prefixo do URL** exatamente `https://matheus-riquelme-web.vercel.app/`. Um domínio personalizado próprio poderia usar propriedade Domínio com DNS; não tente verificar todo `vercel.app`.
2. Confirme a propriedade na sua conta. Já existe `google18b55d3c99a25570.html` no projeto, preservado no build, mas ele pode pertencer a outra propriedade/conta. Use o arquivo fornecido pelo Google para a conta correta e confira que o endereço retorna 200. Não remova uma verificação existente sem saber quem depende dela.
3. Em **Sitemaps**, envie `sitemap.xml`. Confirme status de sucesso e 13 URLs descobertas; descoberta não significa indexação imediata.
4. Em **Inspeção de URL**, teste a home e `/servicos.html`: clique **Testar URL publicado**, confira que o rastreamento é permitido e canonical declarado aponta ao domínio oficial. Depois clique **Solicitar indexação**. Faça o mesmo para projetos e páginas principais modificadas, respeitando a cota. O teste ao vivo não comprova que a URL já entrou no índice.
5. Confira o canonical escolhido pelo Google na inspeção dos dados indexados. Se escolher o host antigo, revise aliases, redirecionamentos e links externos. As duplicatas e redirecionamentos não precisam ser indexados separadamente.
6. Acompanhe **Indexação > Páginas**: separar erros de servidor, bloqueios, duplicatas esperadas e páginas rastreadas mas não indexadas. 404, ponte legada e demos devem ficar fora do índice por intenção.
7. Em **Desempenho > Resultados da pesquisa**, registre a data real da publicação, habilite cliques, impressões, CTR e posição média, e compare períodos equivalentes de 28 dias. Filtre Brasil, dispositivo móvel/desktop, páginas e consultas. Um filtro regex útil é `desenvolvedor web|desenvolvimento web|criação de sites|criacao de sites|rio de janeiro|\brj\b`. Separe buscas pelo nome das buscas pelos serviços. Search Console não fornece um filtro padrão por cidade; use termos locais nas consultas, sem interpretar isso como a localização exata do usuário.
8. Revise semanalmente no primeiro mês e mensalmente depois. Verifique Core Web Vitals quando houver dados reais suficientes; um site com pouco tráfego pode não ter amostra. Não use apenas a nota do Lighthouse como resultado de SEO.

## Descoberta orgânica contínua

- Corrigir o Website do repositório e os links do perfil GitHub para o domínio atual. Adicionar o portfólio a perfis profissionais próprios reais e aos READMEs dos projetos relevantes, sem compra de links ou spam.
- Aprofundar estudos de caso com decisões, limitações, funcionalidades e imagens reais já existentes. Só acrescentar clientes, depoimentos, métricas ou resultados depois de comprovados e autorizados.
- A página de serviços concentra as buscas comerciais do RJ; as páginas de projeto demonstram experiência. Evitar criar páginas iguais para cada bairro ou cidade e repetir palavras-chave para preencher texto.
- Quando surgirem perguntas reais de interessados, produzir conteúdo que as responda com exemplos próprios. Medir impressões e cliques por página para decidir o que expandir.
- Domínio próprio pode ajudar a consistência de marca se o usuário optar por isso no futuro; não é requisito para indexar e nenhum domínio foi comprado ou configurado.

## Publicação pendente e verificação necessária

Após autorização, publicar as alterações com o fluxo do repositório/Vercel, conferir `SITE_URL` se configurada e confirmar que a produção usa `VERCEL_ENV=production`. Fazer readback de home, serviços, sitemap, robots, 404, um estudo de caso, cabeçalhos da demo, redirecionamentos e hash CSP no domínio real. Até isso acontecer, as melhorias locais **não alteram os resultados do site publicado**. O build preserva o arquivo de verificação do Google.

Não houve acesso autenticado ao Search Console, pesquisa de volume de palavras-chave, confirmação de indexação real ou medição de conversões/leads. O código melhora os sinais técnicos e o conteúdo, mas não permite garantir primeira página, tráfego, prazo de indexação ou posição. Pedido de recrawl pode levar dias ou semanas e não garante inclusão.

Fontes oficiais: [recrawl e limites](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [canonicalização](https://developers.google.com/search/docs/crawling-indexing/canonicalization), [dados estruturados locais](https://developers.google.com/search/docs/appearance/structured-data/local-business), [Search Console](https://support.google.com/webmasters/answer/9128668?hl=pt-BR), [relatório de indexação](https://support.google.com/webmasters/answer/7440203?hl=pt-BR).

Os documentos internos de design já tinham diferenças de versão apontadas pela skill Impeccable. Não foram alterados: `init` atualiza o contexto de produto; `document` pode sincronizar o arquivo auxiliar de design quando solicitado. Os avisos sobre gradiente, cores e tipografia existentes foram mantidos conforme a exigência de preservar o visual. A transição de largura detectada pertence ao indicador de carregamento preexistente; não se expandiu o escopo para redesenhar animações.


## Validação realizada

- `npm run build` e `npm test`: 6 testes aprovados, incluindo catálogo, exclusão de fontes/SQL/PHP da distribuição, 13 URLs canônicas, metadados únicos, um H1 por página e hash CSP do JSON-LD.
- Build adicional com `VERCEL_ENV=preview` e SITE_URL herdada: noindex, sem canonical, sem sitemap e robots bloqueando rastreamento; build de produção restaurado ao fim.
- Chromium real: 13 páginas em 390×844 e 1440×1000 (26 verificações), sem erros de JavaScript/CSP ou overflow horizontal após as entradas. Menu mobile, tema, pausa de movimento e navegação/conteúdo sem JavaScript verificados. Inspeção visual de home e serviços em mobile/desktop. O servidor local de verificação aplica os cabeçalhos e redirecionamentos do vercel.json; isso não substitui testar o deploy real.
- Retrato selecionado em mobile DPR 1: variante de 640px, 27.834 bytes (original 132.738 bytes), aproximadamente 79% menos dados. DPR e largura maiores podem selecionar a variante de 960px ou a original. Não há promessa de redução igual em todos os dispositivos.
- Lighthouse 13.6.0, mobile com throttling simulado: produção auditada 87 desempenho / 100 acessibilidade / 100 SEO; FCP 1,6s, LCP 2,5s, TBT 390ms, CLS 0. Versão local, execução serial final: 84 / 100 / 100; FCP 1,4s, LCP 2,4s, TBT 530ms, CLS 0. Uma execução exploratória concorrente foi descartada da comparação por disputar CPU com os testes de navegador.
- As medições são de laboratório, uma execução final por origem, em hosts diferentes (CDN de produção e servidor local), sem dados de usuários reais. **Não foi demonstrado ganho na nota de desempenho**. A redução de bytes é verificável; animações contínuas e custo de renderização ainda afetam a thread principal. Foram preservadas por pedido do usuário. Não se pode afirmar que Core Web Vitals reais passaram com base nesses testes.
- Evidências resumidas e metadados antes/depois: `docs/seo-validation.json`. Capturas e relatórios brutos de trabalho ficam em `.local/seo/` (fora do Git), com os relatórios Lighthouse finais copiados para lá. Teste externo de rich results e readback em produção seguem pendentes de publicação.
