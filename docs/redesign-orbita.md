# Redesign: órbita e azul

Referência: vídeo de portfólio fornecido pelo usuário. Páginas independentes e conteúdo do catálogo preservados.

## Implementação

- Fundo azul-marinho com azul elétrico e ciano; tema claro alternativo e preferência persistida.
- Menu fixo de vidro, estado ativo, menu móvel, foco visível e fechamento com Escape.
- Retrato antigo em preto e branco; painéis de código, React, terminal, GitHub e deploy em elementos independentes. A órbita de 30 segundos altera posição, perspectiva, escala e profundidade; o retrato permanece imóvel.
- Entrada coordenada, revelação com desfoque, texto digitado, partículas e estrelas cadentes discretas. Pausa persistente, movimento reduzido e suspensão em abas ocultas.
- Filtros Todos/Web/Aplicativos, cartões com capas consistentes, tilt e iluminação ao cursor.
- Sobre em três colunas, formação, experiência em TCC e número de projetos calculado do catálogo.
- Habilidades com ícones coloridos, superfícies por tecnologia, faixa contínua e trajetos SVG existentes.
- Contato com rótulos e validação nativa. O formulário prepara uma mensagem via mailto; o envio é concluído no aplicativo de email. Não existe envio de servidor ou sistema de comentários.

## Limites da adaptação

O crachá e a transformação de máscara do vídeo dão lugar à órbita solicitada pelo usuário sobre o retrato antigo. Não foram inventados certificados, prêmios, depoimentos ou playlist. Há uma imagem derivada de recorte para retirar os painéis que estavam incorporados à foto; o arquivo original permanece preservado.

## Validação

- PASSOU: build com 14 páginas geradas; catálogo de sete projetos validado.
- PASSOU: quatro testes existentes de catálogo, escape e exclusão de fontes sensíveis na saída.
- PASSOU: sintaxe dos módulos JS alterados e git diff --check.
- PASSOU: 17 arquivos HTML de saída sem links ou assets locais ausentes.
- PASSOU no navegador: pausa/retomada, tema persistente, menu em frame móvel 390 × 844 e filtros de projetos.
- Conferidos visualmente: apresentação desktop e móvel, Sobre, Projetos e Habilidades. Corrigida entrada invisível de Habilidades quando o movimento inicia pausado.
- Formulário preenchido localmente; nenhum email de teste enviado. Movimento reduzido conferido em código, sem emulação do sistema operacional. Sem medição Lighthouse ou Core Web Vitals de usuários.

## Imagem derivada

`assets/images/portrait-cutout.webp`: edição do retrato antigo anexado `1000620950.png`, removendo fundo, painéis e linhas; preto e branco, óculos, moletom e ângulo preservados. Geração de recorte por image_gen com transparência, seguida de conversão WebP (qualidade 90) para reduzir o arquivo a aproximadamente 130 KB. O arquivo antigo `portrait-transparent.png` não foi substituído.

Prompt da edição: “Edit this exact existing portrait asset for a website animation. Preserve EXACTLY the same person and original photographic face, glasses, curly hair, expression, camera angle, grayscale tones, hoodie and shoulder proportions; do NOT recreate the person or change the face. Remove ALL floating programming panels, icons, screens, code cards, orbital lines, colored highlights and white background. Return ONLY the original grayscale person as a clean high-quality transparent cutout, head and upper shoulders at the same perspective and crop. Reconstruct only tiny occluded shoulder/hoodie areas as needed, do not modify any unoccluded facial pixels. True transparent alpha surrounding the hair and shoulders; soft alpha fade at the bottom of shoulders for a portfolio hero. No decorations, no text, no colored elements, no background. This is an extraction of the exact old photograph, not a new portrait.”

