# Site da Formato Esquadrias

Site institucional de uma página só, em HTML/CSS/JavaScript puro.
**Não tem build**: nada de `npm install`, `npm run build`, Node ou TypeScript.
Os arquivos que estão aqui são exatamente os que rodam no servidor.

---

## 1. O que tem nesta pasta

Esta pasta **é o repositório Git**. Os arquivos do site ficam na raiz, porque o
deploy por Git do Hostinger clona o repositório direto dentro do `public_html`
do servidor — se houvesse uma pasta `public_html/` aqui dentro, o site sairia
em `seudominio.com.br/public_html/`, quebrado.

```
Site Formato Esquadrias/            ← raiz do repositório
├── index.html                      ← a página (todos os textos estão aqui)
├── .htaccess                       ← gzip, cache, HTTPS, bloqueio do .git
├── robots.txt / sitemap.xml        ← para o Google
├── css/style.css                   ← cores, fontes, layout
├── js/main.js                      ← menu, animações, formulário → WhatsApp
├── img/                            ← logo, favicon e as 11 fotos do site
├── LEIA-ME.md                      ← este arquivo
│
│   ── fora do repositório (.gitignore) ──
├── Fotos/                          ← as 58 fotos originais, acervo
└── site-formato-para-hostinger.zip ← pacote para upload manual
```

---

## 2. Como publicar

### Opção A — Deploy por Git (recomendado)

Depois de configurado, publicar uma mudança vira um `git push`.

**Configuração, uma vez só:**

1. Crie um repositório no GitHub (`github.com/new`). Marque **Public** —
   repositório privado exige configurar chave SSH no Hostinger.
   **Não** marque "Add a README file": o repositório precisa nascer vazio.
2. Conecte esta pasta ao repositório e envie:
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
   git push -u origin main
   ```
3. No hPanel do Hostinger: **Avançado → Git**.
4. Em *Repositório*, cole a URL do GitHub; em *Branch*, `main`;
   em *Diretório*, deixe **em branco** (isso significa a raiz do `public_html`).
5. Clique em **Criar**. O Hostinger clona e o site sobe.

**Para publicar uma alteração, daí em diante:**

```bash
git add -A
git commit -m "descreva o que mudou"
git push
```

Depois, no hPanel → **Avançado → Git**, clique em **Deploy**. (Dá para
automatizar com o webhook que a própria tela mostra, aí nem isso é preciso.)

### Opção B — Upload manual do zip

Se preferir não usar Git:

1. hPanel → **Arquivos → Gerenciador de Arquivos** → entre em `public_html`.
2. Apague o que estiver lá (`default.php`, `index.html` de exemplo).
3. **Upload** do `site-formato-para-hostinger.zip`.
4. Botão direito no zip → **Extrair** → depois apague o zip.
5. Confirme que o `index.html` ficou direto dentro de `public_html`.

Para regerar o zip depois de mudar alguma coisa, veja a seção 5.

### Depois de publicar, dos dois jeitos

- **Instale o SSL**: hPanel → **Segurança → SSL → Instalar**. É grátis.
  Sem isso o `.htaccess` força HTTPS e o navegador entra em loop
  (`ERR_TOO_MANY_REDIRECTS`). Se acontecer, espere o SSL terminar ou renomeie
  o `.htaccess` para `htaccess.txt` até ficar pronto.
- Abra o site e dê **Ctrl + F5**.
- Teste: botão de WhatsApp, o formulário (tem que abrir o WhatsApp com a
  mensagem pronta), o mapa, e tudo no celular.

---

## 3. O que ainda falta

### 3.1 A logo em alta resolução

A logo atual foi recuperada da foto de perfil do Instagram — 150 px. Fica boa
no tamanho pequeno do cabeçalho, mas não amplia. Se conseguir o arquivo
original (`.png` transparente, `.ai`, `.cdr` ou `.svg`), substitua
`img/logo-formato.png` mantendo o mesmo nome.

### 3.2 O e-mail `contato@formatoesquadrias.com.br`

**Ainda não existe.** Enquanto a caixa não for criada, quem clicar no link
abre o programa de e-mail e a mensagem não chega a lugar nenhum.

Para criar: hPanel → **E-mails → Contas de e-mail** → criar `contato@`.
Só funciona depois que o domínio estiver apontado para o Hostinger.

### 3.3 Informações a confirmar com a empresa

- **Horário de atendimento** — "seg. a sex. 8h–18h, sáb. 8h–12h" é suposição
  minha. Procure `Atendimento` no `index.html`.
- **Endereço** — Av. Paulo Emanuel de Almeida, 1080 — Wanel Ville, Sorocaba/SP
  (tirado do Facebook).
- **WhatsApp** — (15) 99607-0870. Aparece no `index.html` (procure
  `5515996070870`) e no `js/main.js` (variável `ZAP`).
- **Produtos** — hoje são 3: Portas, Janelas e Esquadrias prediais.
- **Curso** — conferir o conteúdo programático que descrevi.

### 3.4 O domínio

O site assume `www.formatoesquadrias.com.br`. Se for outro, troque em:

- `index.html` → linha do `<link rel="canonical" ...>`
- `sitemap.xml` → dentro da tag `<loc>`
- `robots.txt` → linha do `Sitemap:`

---

## 4. Como mexer no site depois

**Trocar um texto** — abra o `index.html` em qualquer editor, procure o texto,
troque e salve.

**Trocar uma cor** — abra o `css/style.css`. As cores estão no começo, no bloco
`:root`, cada uma com o nome explicado ao lado. Mudar ali muda o site inteiro.

**Trocar uma foto** — veja `img/LEIA-ME-FOTOS.txt`: tem a tabela de qual foto
ocupa qual espaço e em que formato cortar.

**O formulário de contato** — hospedagem estática não envia e-mail. Por isso o
formulário não envia nada: ele monta a mensagem e abre o WhatsApp da empresa
com o texto já escrito. Funciona no celular e no computador, e não corre o
risco de a mensagem cair no spam. Se um dia quiser um formulário que mande
e-mail de verdade, o caminho simples é o **Formspree** (formspree.io).

---

## 5. Ver o site antes de publicar

Abra o PowerShell nesta pasta e rode:

```bash
python -m http.server 5599
```

Depois abra `http://localhost:5599` no navegador. Para parar, `Ctrl + C`.

Para regerar o zip de upload manual depois de alterar alguma coisa:

```bash
git archive --format=zip -o site-formato-para-hostinger.zip HEAD
```

Esse comando empacota exatamente o que está no último commit — sem as fotos
originais, sem o zip antigo.
