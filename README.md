# Portfólio de Riquelme

Código em `/home/user/Portfólio Pessoal`. A pasta `/home/user/Documentos/ChatGPT/Portfólio Pessoal` estava vazia e não foi usada.

PHP 8.0+ (verificado com PHP 8.2.12 do XAMPP), PDO/pdo_mysql, MySQL ou MariaDB, HTML, CSS e JavaScript. Sem Composer, npm, framework, login ou painel. A animação de Habilidades usa uma cópia local, versionada e licenciada do Motion One. As fontes existentes continuam carregadas do Google Fonts; há fontes de fallback no CSS.

## Executar agora por HTTP com o PHP do XAMPP

```bash
cd '/home/user/Portfólio Pessoal'
/opt/lampp/bin/php -S 127.0.0.1:8765 router.php
```

Abra `http://127.0.0.1:8765/`. Não abra os arquivos por `file://`. O servidor PHP usa `router.php` para bloquear arquivos internos. O catálogo responde 503 até configurar/importar o banco; não usa projetos fictícios como fallback. As outras páginas e cópias de demonstração funcionam sem banco.

## Banco: configuração e importação MANUAIS

Nenhum banco existente foi importado, alterado ou sobrescrito durante a implementação.

1. Inicie MySQL/MariaDB e Apache pelo painel XAMPP. No Linux, também é possível usar `sudo /opt/lampp/lampp start`.
2. Abra `http://localhost/phpmyadmin`. Crie um banco **novo e vazio**, por exemplo `portfolio_riquelme`, com `utf8mb4_unicode_ci`. Se esse nome já existir, escolha outro. Não selecione um banco de outro projeto.
3. Selecione o banco novo e importe `database/schema.sql` **uma única vez**. O arquivo cria `portfolio_projects` e sete registros baseados nos projetos encontrados. Se a tabela já existir, interrompa a importação e revise o banco selecionado; não reimporte.
4. No phpMyAdmin, crie um usuário local para a aplicação e conceda apenas `SELECT` no banco do portfólio. Escolha sua própria senha.
5. Copie `config/database.example.php` para `config/local.php`. Preencha host, porta, banco, usuário e senha. O exemplo não contém senha real. O arquivo local está no `.gitignore` e tem acesso HTTP bloqueado. Preferencialmente guarde a configuração fora da pasta servida e defina a variável `PORTFOLIO_CONFIG` com seu caminho absoluto.
6. Reabra `projetos.php`. Cada botão abre uma página real `projeto.php?slug=...`; demos disponíveis passam por `demo.php?slug=...`.

Em produção, `PORTFOLIO_CONFIG` deve apontar para um arquivo PHP fora do document root que retorne o mesmo array do exemplo; a variável guarda o caminho, não as credenciais. Defina-a no ambiente do processo PHP/Apache e permita leitura somente ao runtime PHP e a administradores. Use usuário MySQL/MariaDB com privilégio mínimo e restrinja conexões ao host da aplicação pela rede privada. O navegador recebe apenas páginas HTTP: configuração e porta do banco permanecem no servidor.

A aplicação só lê o catálogo. Para atualizar os dados, use o phpMyAdmin. Textos vindos do banco são escapados; parâmetros de rota são validados e passados em consultas preparadas. `demo_key` aceita somente as demonstrações definidas no código, nunca um caminho arbitrário.

## Servir a mesma pasta pelo Apache do XAMPP

Para manter uma única cópia do projeto, configure um Alias no Apache (`/opt/lampp/etc/httpd.conf` ou arquivo incluído por ele):

```apache
Alias /portfolio "/home/user/Portfólio Pessoal"
<Directory "/home/user/Portfólio Pessoal">
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
    DirectoryIndex index.php
</Directory>
```

O usuário do Apache (`daemon` nesta instalação) precisa atravessar `/home/user` e ler a pasta do projeto. Configure permissões/ACL somente nos caminhos necessários, sem usar `chmod 777`. Não publique a configuração secreta em outro diretório público. A configuração do Apache não foi editada automaticamente. Reinicie o Apache após a configuração e acesse `http://localhost/portfolio/`. Em Windows, ajuste o caminho do Alias para a pasta real do projeto.

O `.htaccess` bloqueia app/config/database/docs/logs, arquivos ocultos e extensões internas (`.log`, `.sql`, `.bak`, `.ini`), desativa listagem e redireciona os antigos endereços `.html` para `.php` sem perder o prefixo do Alias. As regras dependem de `mod_rewrite` e de `AllowOverride` para `FileInfo`, `Indexes`, `Options` e `AuthConfig` (o exemplo usa `AllowOverride All`). Não depende de URLs amigáveis para abrir as páginas principais.

## Projetos e demonstrações

| Registro | Fonte inspecionada | Disponibilidade |
| --- | --- | --- |
| Hogwarts | `/opt/lampp/htdocs/2350/projhogwarts1.0/projhogwarts_html` | Cópia HTML com cinco páginas, CSS e assets em `demos/hogwarts`. |
| NexusFC | `/opt/lampp/htdocs/2350/Projeto final` | Cópia do protótipo existente em `demos/nexusfc`. O portal PHP completo não foi instalado. |
| ListaTarefas | `/home/user/Projetos/ListaTarefas` | Código Android/Expo; precisa de APK aprovado ou build web funcional. |
| Sexta-Feira | `/home/user/Projetos/Sexta-Feira` | Aplicação local de terminal/voz; precisa de demonstração pública ou gravação aprovada. |
| Aranhaverso | `/opt/lampp/htdocs/2350/projaranhaverso` | Código e schema encontrados; falta ambiente de demonstração configurado e URL validada. |
| Ciberfólio | `/opt/lampp/htdocs/2350/Ciberfólio` | Código encontrado; falta ambiente de demonstração configurado e URL validada. |
| Gestão de compras | `/opt/lampp/htdocs/2350/projcompras` e `projcompras2` | Código/documentação encontrados; falta ambiente de demonstração configurado e URL validada. |

As cópias integradas contêm apenas assets públicos necessários; nenhum banco, credencial, conta, upload pessoal ou arquivo de log dos projetos foi copiado. Os originais não foram editados. Versões duplicadas e a estrutura incompleta `projmvc` não viraram registros adicionais.

No Hogwarts, foram corrigidos caminhos absolutos e a capitalização de uma imagem somente na cópia. O botão de trailer original sem ação foi substituído por um aviso. No protótipo NexusFC, links que dependiam do backend vão a uma página explicativa real; a busca não funcional foi substituída por texto. A interface informa que são notícias ilustrativas do protótipo existente.

## Imagens e conteúdo

- `1000620950.jpg`: retrato JPEG original do hero, intacto. SHA256: `f34f2be673d6b41fb14ce013e9689ce7c747dd22e808ab19b549eec0ba038c7c`.
- `portrait-mask.svg`: máscara CSS separada da foto, sem retoque do rosto; conferida visualmente na hero em desktop e celular.
- `1000620945.jpg`, `1000620946.jpg`, `1000620947.jpg`: referências preservadas; não exibidas como conteúdo do site.
- `/home/user/Imagens/img5.png`, `img6.png`, `img7.png`: capturas inspecionadas para esta revisão, não copiadas para o site.
- Nome atualizado para Riquelme. Apresentação pessoal e contato continuam aguardando texto real, sem email ou trajetória inventados. A página Habilidades apresenta somente as tecnologias documentadas nos projetos do catálogo; confirme se essa lista representa o que deseja destacar.

## Verificação e limites

`php -l` passou em todos os arquivos PHP. O XAMPP fornece PHP 8.2.12, `PDO` e `pdo_mysql`. Rotas, assets, redirects antigos e bloqueio de arquivos internos foram verificados pelo servidor de desenvolvimento e em Apache 2.4.58 isolado, com configurações temporárias de Alias e DocumentRoot; a configuração real de hospedagem não foi alterada. O teste do Apache confirmou o MIME `image/jpeg` do retrato. O escaneamento local de referências das demos conferiu 194 caminhos e não encontrou arquivos ausentes.

O catálogo não foi importado nem testado com dados reais: `config/local.php` não existe, `PORTFOLIO_CONFIG` não está definido e MySQL/MariaDB não está em execução. `projetos.php` e `demo.php` retornam 503 nesse estado; após configurar o banco, valide o catálogo e o fluxo de detalhes/demonstração. Nenhum schema ou registro foi alterado.

A revisão visual foi feita no navegador em desktop e celular. A home permaneceu sem rolagem horizontal ou vertical, inclusive durante a entrada do retrato, nas larguras de 320 a 1440 px testadas; Habilidades não teve rolagem horizontal de 320 a 1280 px. Menu móvel, Escape e foco visível por teclado foram verificados. O ambiente não permitiu emular `prefers-reduced-motion` nem desligar JavaScript; CSS/JS foram inspecionados para essas situações, incluindo conteúdo renderizado pelo PHP sem ocultação por JavaScript.

A pasta `.git` está vazia, então o estado versionado não pode ser confirmado. `config/local.php`, arquivos `.env` e logs não estão presentes; `.gitignore`, regras HTTP para arquivos internos e ausência de atribuições com formato de segredo foram conferidos sem revelar valores.

## Documentação oficial consultada

- [Apache `.htaccess` no 2.4](https://httpd.apache.org/docs/2.4/howto/htaccess.html.en) e [mod_rewrite](https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html)
- [Driver PDO_MYSQL](https://www.php.net/manual/en/ref.pdo-mysql.php), [prepared statements](https://www.php.net/manual/en/pdo.prepare.php) e [escape de HTML](https://www.php.net/manual/en/function.htmlspecialchars.php)
- [Motion One `inView`](https://motion.dev/docs/inview) e [repositório oficial](https://github.com/motiondivision/motionone); a cópia local 10.18.0 inclui sua licença MIT.
- [XAMPP no Linux](https://www.apachefriends.org/faq_linux.html)
