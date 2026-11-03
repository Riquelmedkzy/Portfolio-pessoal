# Riquelme — Código, forma e intenção

Portfólio editorial com temas claro e escuro, foco em projetos freelance, sete projetos e contato por email. Retrato original e fontes DM Sans / DM Serif Display preservados.

## Ver no XAMPP agora

1. Copie a pasta inteira para `C:\xampp\htdocs\Portfolio-pessoal` (Windows) ou `/opt/lampp/htdocs/Portfolio-pessoal` (Linux).
2. Inicie **Apache**. MySQL não é necessário para o portfólio.
3. Abra `http://localhost/Portfolio-pessoal/index.html`.

As páginas HTML já estão geradas e funcionam sem instalar Node. Os antigos endereços PHP redirecionam para as novas páginas. Não abra por `file://`: módulos JavaScript precisam de HTTP.

## Editar e atualizar

Requer Node.js 22+ apenas para gerar novamente as páginas:

```sh
npm ci
npm run build
npm test
```

- `content/projects.json`: fonte única do catálogo, validada com Zod. Slugs devem ser únicos; URLs externas HTTPS; caminhos de imagens/demos limitados a pastas públicas.
- `scripts/build.mjs`: templates das páginas, conteúdo pessoal, habilidades e geração de SEO.
- `styles.css`: direção editorial e temas.
- `assets/css/skills.css`, `assets/css/skills-theme.css`, `assets/js/habilidades.js`: movimentos e visual de Habilidades.
- As páginas na raiz são geradas. Edite os templates/dados e rode o build; edições diretas nos HTML serão substituídas.
- `dist/`: saída pública para Vercel. Gerada por allowlist, sem PHP, credenciais, SQL ou código de build.

Após mudanças, rode `npm run build` e atualize o navegador do XAMPP. Para prévia sem XAMPP, `python -m http.server 8765` é útil em desenvolvimento, mas serve arquivos-fonte: não exponha esse servidor à internet. Alternativamente use `php -S 127.0.0.1:8765 router.php`.

## Banco e migração

O catálogo foi reconstruído em JSON, aproveitando a aceitação de edição pelo GitHub. O portfólio **não consulta mais MySQL**. Isso elimina a dependência de configuração local que bloqueava projetos e demos. Não foi criada uma nova instalação MySQL nem apagado qualquer banco existente.

`database/schema.sql`, `config/` e `app/` preservam o material anterior como referência, não são usados pelas páginas novas e não entram em `dist`. Não importe o SQL antigo para tentar ativar este portfólio.

Os bancos dos projetos Aranhaverso e NexusFC são independentes: a mudança do catálogo não instala nem corrige esses sistemas. NexusFC e Hogwarts têm demos estáticas; o Aranhaverso leva ao repositório com instruções de instalação. ListaTarefas leva à distribuição beta, com código-fonte privado.

## Vercel (preparado, ainda não publicado)

Importe o repositório como projeto **Other**, build `npm run build`, saída `dist`. `vercel.json` contém a configuração e os cabeçalhos.

Na produção, defina `SITE_URL` com a origem HTTPS definitiva (exemplo de formato: `https://seu-dominio.com`, sem caminhos). Se omitida, o build de produção tenta usar `VERCEL_PROJECT_PRODUCTION_URL`. Após definir ou mudar o domínio, faça novo deploy.

Com URL de produção, o build gera canonical, Open Graph, `sitemap.xml` e robots. Sem URL, a saída é uma **prévia noindex**, com robots bloqueando rastreamento. Não publique esperando indexação antes de configurar a URL. Não há domínio fictício embutido. Preview deployments devem permanecer sem SITE_URL de produção.

Os antigos `.php` redirecionam. `projeto.php?slug=...` e `demo.php?slug=...` levam à página correspondente via ponte estática; a ponte oferece o catálogo caso JavaScript esteja desativado.

Depois do deploy: conferir links, headers, indexação permitida, sitemap e canonical no domínio real. Search Console depende da conta e domínio; nenhum cadastro foi feito. SEO não garante tráfego ou posições.

## Segurança e limites

- Sem formulário servidor, login, sessão ou coleta de dados. Email usa `mailto:` e opção copiar; isso não envia uma mensagem automaticamente.
- Preferência de tema fica no armazenamento local. Sem analytics ou cookies de rastreamento adicionados.
- CSP limita scripts à própria origem; estilos inline são permitidos para compatibilidade com animações e demos. Google Fonts permanece externo, como no original.
- `.htaccess` protege fontes no Apache e define headers quando `mod_headers` está ativo. Requer AllowOverride apropriado; conferir no seu XAMPP.
- `dist` é a única saída que deve ser publicada. Não publique a raiz como um servidor estático genérico.

## Evidências desta revisão

Build, validação do catálogo e testes Node executados. Navegador Chromium: oito páginas principais em 390 e 1440 px, claro e escuro; sem erro JavaScript, imagem quebrada ou overflow horizontal nas condições verificadas. Alternância/persistência de tema, menu/Escape e pausa de movimento conferidos.

XAMPP/Apache e PHP não estão disponíveis no ambiente de trabalho; wrappers PHP e `.htaccess` foram inspecionados, não executados. Hospedagem Vercel não publicada nem verificada. Core Web Vitals de usuários e Lighthouse não medidos.

## Origem do conteúdo

Informações pessoais e papéis nos três projetos principais confirmados por Riquelme. Consulte `docs/fontes.md`. Os quatro projetos complementares mantêm apenas o conteúdo do catálogo original; não foram inventados clientes, métricas ou depoimentos.

## Refinamento visual

O retrato agora usa PNG com transparência em ambos os temas. As capas de Aranhaverso e NexusFC mostram capturas das interfaces em computador e celular; ListaTarefas tem capa editorial porque não há screenshots disponíveis. Veja a origem em `docs/fontes.md`.

`assets/js/motion.js` controla entradas, partículas e interações dos projetos. O botão “Pausar movimento” salva a preferência; o modo de movimento reduzido do sistema sempre prevalece. A faixa de Habilidades também conserva seu controle local.
