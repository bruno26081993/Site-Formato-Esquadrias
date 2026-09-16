# Site da Formato Esquadrias

Site institucional de uma página só (one page), feito em HTML/CSS/JavaScript puro.
Não precisa de banco de dados, PHP, WordPress nem nada instalado — é só subir os
arquivos para o Hostinger e o site já está no ar.

---

## 1. O que tem nesta pasta

```
Site Formato Esquadrias/
├── LEIA-ME.md                          ← este arquivo (NÃO sobe para o servidor)
├── site-formato-para-hostinger.zip     ← PRONTO PARA UPLOAD (1,14 MB)
├── Fotos/                              ← fotos originais (NÃO sobem para o servidor)
└── public_html/            ← TUDO que está aqui dentro vai para o Hostinger
    ├── index.html          ← a página em si (textos ficam aqui)
    ├── .htaccess           ← configurações do servidor (cache, HTTPS)
    ├── robots.txt          ← permite o Google indexar
    ├── sitemap.xml         ← mapa do site para o Google
    ├── css/style.css       ← cores, fontes, layout
    ├── js/main.js          ← menu, animações, formulário → WhatsApp
    └── img/
        ├── logo-formato.png    ← logo do cabeçalho e do rodapé
        ├── favicon.png         ← ícone da aba do navegador
        ├── (11 fotos do site)  ← hero, produto-*, obra-*, curso, sobre
        └── LEIA-ME-FOTOS.txt   ← de onde veio cada foto e como trocar
```

---

## 2. Como subir para o Hostinger

### Opção A — Gerenciador de Arquivos (mais fácil, recomendado)

1. Entre no **hPanel** do Hostinger (`hpanel.hostinger.com`).
2. Escolha o site → menu **Arquivos → Gerenciador de Arquivos**.
3. Entre na pasta **`public_html`**.
4. Se houver arquivos de exemplo lá dentro (`default.php`, `index.html` padrão da
   Hostinger), **apague todos**.
5. Clique em **Upload** e envie o arquivo **`site-formato-para-hostinger.zip`**
   que já está pronto na raiz deste projeto.
6. (Não precisa compactar nada — o zip já está montado com os arquivos na
   posição certa, inclusive o `.htaccess`.)
7. Clique com o botão direito no `.zip` no servidor → **Extract / Extrair**.
8. Apague o `.zip` depois de extraído.
9. Confirme que o `index.html` ficou **direto dentro de `public_html`**
   (e não dentro de `public_html/public_html`).

> ⚠️ Se um dia você refizer o zip na mão, lembre que o `.htaccess` começa com
> ponto e o Windows o esconde: ative *Exibir → Itens ocultos* antes de compactar.
> O site funciona sem ele, mas fica um pouco mais lento.

### Opção B — FTP (FileZilla)

1. No hPanel: **Arquivos → Contas de FTP** e anote host, usuário e senha.
2. Abra o FileZilla, conecte com esses dados.
3. No lado direito (servidor), entre em `public_html`.
4. Arraste o **conteúdo** da pasta `public_html` local para lá.

### Depois de subir

- No hPanel, vá em **Segurança → SSL** e instale o certificado (é grátis).
  Sem isso o navegador mostra "site não seguro" e o `.htaccess` vai ficar
  redirecionando em loop.
- Teste no celular e no computador.
- Se o site não atualizar, dê **Ctrl + F5** (limpa o cache do navegador).

---

## 3. O que ainda falta (importante)

### 3.1 As fotos — FEITO ✅

As 11 fotos já estão no site, escolhidas da pasta `Fotos/`, recortadas no
formato de cada espaço e comprimidas.

A tabela de qual original virou qual arquivo, e como trocar qualquer uma
depois, está em **`public_html/img/LEIA-ME-FOTOS.txt`**.

### 3.2 A logo em alta resolução

A logo que está no site foi recuperada da foto de perfil do Instagram — tem
resolução baixa (fica boa no tamanho pequeno do cabeçalho, mas não dá para
ampliar). Se você conseguir o **arquivo original** (`.png` com fundo
transparente, `.ai`, `.cdr` ou `.svg`), é só substituir
`public_html/img/logo-formato.png` mantendo o mesmo nome.

### 3.3 Informações a confirmar com a empresa

Coloquei no site o que dava para apurar nas redes sociais. **Confira estes
pontos antes de publicar:**

- **Horário de atendimento** — coloquei "seg. a sex. 8h–18h, sáb. 8h–12h" como
  suposição. Está em `index.html`, procure por `Atendimento`.
- **Endereço** — Av. Paulo Emanuel de Almeida, 1080 — Wanel Ville, Sorocaba/SP
  (tirado do Facebook).
- **WhatsApp** — (15) 99607-0870. Se mudar, o número aparece em 3 lugares:
  no `index.html` (procure por `5515996070870`) e no `js/main.js` (variável `ZAP`).
- **E-mail** — contato@formatoesquadrias.com.br (precisa existir de verdade: crie a
  caixa no hPanel em **E-mails → Contas de e-mail** depois de apontar o domínio)
- **Lista de produtos** — hoje são 3: Portas, Janelas e Esquadrias prediais.
- **Curso** — conferir o conteúdo programático que descrevi.

### 3.4 O domínio

O site está escrito assumindo `www.formatoesquadrias.com.br`. Se o domínio for
outro, troque em dois lugares:

- `index.html` → linha do `<link rel="canonical" ...>`
- `sitemap.xml` → dentro da tag `<loc>`

---

## 4. Como mexer no site depois

### Trocar um texto
Abra `public_html/index.html` em qualquer editor (Bloco de Notas serve,
VS Code é melhor). Procure o texto, troque, salve e suba o arquivo de novo.

### Trocar uma cor
Abra `public_html/css/style.css`. Todas as cores estão logo no começo,
no bloco `:root`, com o nome explicado ao lado. Trocar ali muda o site inteiro.

### O formulário de contato
Hospedagem estática não envia e-mail. Por isso o formulário **não envia nada**:
ele monta a mensagem e abre o WhatsApp da empresa já com o texto escrito.
Funciona no celular e no computador, e não tem risco de mensagem se perder
numa caixa de spam.

Se um dia quiser um formulário que mande e-mail de verdade, o caminho mais
simples é um serviço gratuito como o **Formspree** (formspree.io) — aí a gente
troca o `<form>` por um que aponta para lá.

---

## 5. Ver o site no seu computador antes de subir

Abra o PowerShell nesta pasta e rode:

```bash
python -m http.server 5599 -d "public_html"
```

Depois abra no navegador: `http://localhost:5599`

(Abrir o `index.html` com duplo clique também funciona, mas algumas coisas
se comportam melhor pelo servidor local.)
