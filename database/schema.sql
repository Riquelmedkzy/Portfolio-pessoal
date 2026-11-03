-- Importação MANUAL em banco NOVO e vazio selecionado no phpMyAdmin.
-- Não cria, apaga ou seleciona bancos. Não usa DROP/REPLACE/UPDATE.
-- Se a tabela já existir, CREATE TABLE falha; não importe novamente.
CREATE TABLE portfolio_projects (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 slug VARCHAR(100) NOT NULL UNIQUE,
 title VARCHAR(160) NOT NULL,
 summary VARCHAR(500) NOT NULL,
 technologies VARCHAR(255) NOT NULL,
 description TEXT NOT NULL,
 demo_key VARCHAR(60) NULL,
 availability VARCHAR(600) NOT NULL,
 published TINYINT(1) NOT NULL DEFAULT 1,
 sort_order INT UNSIGNED NOT NULL DEFAULT 0,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO portfolio_projects (slug,title,summary,technologies,description,demo_key,availability,sort_order) VALUES
('hogwarts','Hogwarts','Site sobre Hogwarts e suas quatro casas.','HTML, CSS, PHP, MySQL','Os arquivos encontrados incluem uma versão HTML com páginas de Grifinória, Sonserina, Corvinal e Lufa-Lufa, além de versões PHP. A demonstração integrada apresenta a versão HTML existente.','hogwarts','Demonstração HTML incluída; os recursos PHP das outras versões não fazem parte desta cópia.',0),
('nexusfc','NexusFC','Portal acadêmico de notícias de futebol.','PHP 8, MySQLi, MySQL/MariaDB','Portal de notícias com estrutura MVC simples. A demonstração integrada é o protótipo visual existente no projeto; o portal completo utiliza um banco próprio.','nexusfc','Protótipo visual incluído. A aplicação completa precisa de configuração e banco próprios.',1),
('lista-tarefas','ListaTarefas','Aplicativo Android para organizar tarefas.','React Native, Expo, TypeScript','Aplicativo com criação, edição, conclusão e organização de tarefas. A versão 2.0 em preparação inclui resumo de progresso, estatísticas e preferências locais. O projeto não fornece uma demonstração web pronta.',NULL,'Código Android localizado. Falta um APK de demonstração aprovado ou uma versão web executável.',2),
('sexta-feira','Sexta-Feira','Assistente local com chat de terminal e voz opcional.','Python, llama.cpp, Qwen3, SQLite','Assistente executada localmente, com chat de terminal, voz push-to-talk, memórias e lembretes. O projeto depende de modelos locais e não oferece uma interface web para visitantes.',NULL,'Código e modelos locais encontrados. Falta uma demonstração pública apropriada ou uma gravação aprovada.',3),
('aranhaverso','Aranhaverso','Site dedicado aos universos cinematográficos do Homem-Aranha.','PHP, MySQL, CSS, JavaScript','O projeto contém páginas de universos, atores e detalhes de filmes, além de um schema próprio. Sua execução depende da configuração do projeto e do banco correspondente.',NULL,'Arquivos PHP encontrados. A demonstração completa precisa de configuração do banco e de uma URL executável validada.',4),
('ciberfolio','Ciberfólio','Site em PHP com apresentação, portfólio e contato.','PHP, MySQL, CSS, JavaScript','Os arquivos encontrados incluem páginas de apresentação, serviços, portfólio e contato. O projeto possui configuração e banco próprios.',NULL,'Arquivos encontrados. Falta uma URL executável validada com configuração própria.',5),
('gestao-compras','Gestão de compras','Estrutura PHP com cadastro, autenticação e perfil.','PHP, MySQL','Os arquivos encontrados em projcompras incluem controladores e páginas de cadastro, autenticação e perfil. A documentação de projcompras2 descreve a estrutura do projeto de gestão de compras.',NULL,'Arquivos encontrados. A aplicação depende da configuração e do banco próprios; não há demonstração validada.',6);
