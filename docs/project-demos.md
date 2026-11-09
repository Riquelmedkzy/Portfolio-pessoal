# Demonstrações dos projetos

Atualização local de 9 de novembro de 2026, na branch `codex/riquelme-digital-playground`. Os oito projetos exibidos possuem demonstração na própria página de estudo e opção de abrir em outra aba. Nenhuma publicação foi feita.

| Projeto | Conteúdo disponível | Limite explícito |
| --- | --- | --- |
| PokéLab | 54 fichas, 18 elementos, busca, montador de cinco integrantes e análise da composição; 92 páginas exportadas dos templates originais | Equipe de visitante; sem contas, API ou SQLite |
| Aranhaverso | Universos, catálogo, filmes e galerias | PHP/MySQL não executados |
| NexusFC | Protótipo visual navegável existente | Notícias ilustrativas; sem backend |
| Hogwarts | Cinco páginas HTML, com ajuste de responsividade na demo | Sem PHP/MySQL |
| ListaTarefas | Adaptação web com tarefas fictícias: criar, editar, concluir/reabrir, buscar, filtrar e excluir; resumo e troca de tema | Não é a interface nativa nem uma publicação do código privado; estado somente nesta aba |
| Mundo Invertido | Interface original, troca de mundos, navegação entre temporadas e prévias de formulários | Sem contas, envio de mensagens, áudio ou vídeos locais. Trailers externos abrem no YouTube |
| Ciberfólio | Páginas originais de apresentação, sobre, serviços, portfólio e contato | Formulários ilustrativos; sem login ou persistência |
| Gestão de compras | Templates originais de cadastro, acesso e perfil em moldura de apresentação; perfil fictício na entrada | Sem autenticação, recuperação de senha, upload ou MySQL; nenhum gerenciamento de compras foi inventado |

Sexta-Feira e os repositórios de perfil, metodologia e portfólio continuam fora da listagem conforme a seleção anterior do usuário. Os endereços antigos dos estudos permanecem preservados.

## Segurança e funcionamento

As demonstrações incorporadas usam o sandbox existente, sem `allow-same-origin` ou `allow-forms`. A CSP continua restrita, inclusive `form-action 'none'`. Os formulários de apresentação usam botões locais, exibem o aviso de que nenhum dado é enviado e desabilitam campos de senha/arquivo. O editor do ListaTarefas usa eventos de botão/teclado para manipular somente dados fictícios em memória. Não são criadas contas e não há endpoints de gravação na saída estática.

No PokéLab, o JavaScript original de visitante é preservado. Em navegação isolada sem localStorage, uma ponte transporta apenas o rascunho da equipe e a preferência de movimento por parâmetros de navegação. As chaves são limitadas e os IDs da equipe passam pela validação do catálogo original. Em outra aba, o rascunho pode usar armazenamento local do navegador; isso não é salvamento no banco.

A ponte de movimento observa a pausa enviada pelo portfólio. O Mundo Invertido usa a API original de movimento e o canvas do Ciberfólio tem uma adaptação para parar/retomar seu relógio. Preferências de movimento reduzido continuam respeitadas. Recursos pesados são carregados somente após a ação “Carregar demonstração”.

## Fontes e exportação

- `scripts/export-project-demos.py`: exporta PokéLab, Mundo Invertido, Ciberfólio e Gestão de compras usando apenas templates, helpers isolados e catálogo público. Os caminhos de origem estão no mapa `SOURCES`, ajustável para outra máquina.
- O exportador **não importa configurações reais, SQL, modelos de conta, bancos SQLite, diretórios privados, logs ou uploads**. O único repositório de dados executado é `PokemonRepository`, que lê o JSON público do catálogo. Nenhum banco real é conectado ou alterado.
- Fontes locais: `/home/user/Projetos/pokemon`, `/home/user/Projetos/projinvertido`, `/home/user/Documentos/ChatGPT/Ciberfólio` e `/opt/lampp/htdocs/2350/projcompras`. Não se deve publicar essas pastas inteiras; somente as exportações em `demos/` entram no site.
- PokéLab e Mundo Invertido preservam créditos e imagens dos respectivos titulares. Ciberfólio preserva sua marca original NexusFC, distinta do portal de notícias. Fontes e avisos de licença acompanham os assets originais.
- `demos/lista-tarefas/`: código próprio da adaptação web. Nenhum arquivo do aplicativo privado foi copiado.
- `demos/presentation.js`, `presentation.css` e `forms-demo.css`: aviso, navegação isolada e comportamento de apresentação; sem integrações externas.
- `content/projects.json`: caminhos e descrições individuais das demos, validados pelo catálogo. `assets/js/demo-registry.js` é gerado pelo build a partir desses mesmos dados; o carregador não aceita URLs arbitrárias.
- `assets/images/pokelab-desktop.jpg` e `pokelab-mobile.jpg`: capturas reais da demo exportada, geradas em Chromium; substituem a capa ilustrativa do destaque.

O build normal usa os HTML e assets já versionados, sem precisar de PHP ou das pastas originais. A exportação opcional requer Python 3 e PHP local. O exportador do Aranhaverso permanece separado.

## Executar e verificar

```sh
npm ci
npm run build
npm test
npm run preview
```

Abra `http://127.0.0.1:8765/projetos.html`. Com a prévia em execução, `npm run test:demos` executa os fluxos de navegador (Playwright instalado). `CHROME_PATH=/opt/google/chrome/chrome npm run test:demos` usa o Chrome local deste computador.

Validação executada: 16 testes Node aprovados; seis fluxos de navegador, incluindo as oito demos em desktop/mobile (16 carregamentos), aprovados; nenhuma exceção JavaScript ou requisição POST no relatório. As 133 páginas HTML de demonstração passaram pela checagem de referências locais. A adaptação da pausa global do Ciberfólio foi verificada separadamente após o último ajuste.

Evidências locais: `.local/playground/demos-report.json`, `demo-visual.json`, `.impeccable/review/demos/`. Capturas em 1440/390px foram inspecionadas. Estes testes não validam o backend original, dispositivos físicos ou execução nativa Android. Não houve deploy.

Revisão final independente: interfaces e limites aprovados; o único ajuste solicitado foi remover enfeites que cobriam o aviso de trailer indisponível em Hogwarts. O aviso foi corrigido e conferido novamente em desktop/mobile. A documentação da extensão também foi revisada, sem alterar os tokens globais.
