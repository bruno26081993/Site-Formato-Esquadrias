# Site da Formato Esquadrias

Site institucional de uma página só, em HTML/CSS/JavaScript puro.
**Não tem build**: nada de `npm run build`, TypeScript ou framework. Os arquivos
que estão aqui são exatamente os que o navegador lê.

O `server.js` e o `package.json` existem só porque a hospedagem contratada é a
**hospedagem de aplicativos** do Hostinger, que roda um processo Node em vez de
servir a pasta direto. O servidor não usa nenhuma biblioteca de fora — é o
Node puro entregando os arquivos desta pasta.

---

## 1. O que tem nesta pasta

Esta pasta **é o repositório Git**. Os arquivos do site ficam na raiz: é de onde
o `server.js` os serve, e é o que a hospedagem espera encontrar ao clonar.

```
Site Formato Esquadrias/            ← raiz do repositório
├── index.html                      ← a página (todos os textos estão aqui)
├── server.js                       ← servidor Node (exigência da hospedagem)
├── package.json                    ← diz à hospedagem como iniciar o site
├── .htaccess                       ← só vale em hospedagem comum (ver seção 2)
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

### Onde este site está hospedado

Na **hospedagem de aplicativos** do Hostinger (a que tem *Implantações*,
*Variáveis de ambiente* e *Logs de execução* no menu). Ela não serve uma pasta:
ela clona o repositório, roda `npm start` e espera um processo Node atender na
porta que ela informa pela variável `PORT`. É isso que o `server.js` faz.

> **O `.htaccess` não funciona aqui.** Ele é do Apache, e esta hospedagem não usa
> Apache. Tudo que ele fazia — gzip, cache, esconder o `.git`, página 404 — está
> reimplementado dentro do `server.js`. O arquivo continua no repositório só
> para o caso de um dia o site migrar para hospedagem comum.

### Publicar

**Configuração, uma vez só:** no hPanel, importe o repositório
`bruno26081993/Site-Formato-Esquadrias`, branch `main`. Quando ele perguntar,
o comando de início é `npm start` (ou `node server.js`).

**Para publicar uma alteração, daí em diante:**

```bash
git add -A
git commit -m "descreva o que mudou"
git push
```

E no hPanel, **Implantações → Deploy**. Se você ligar o deploy automático
naquela tela, o `git push` sozinho já publica.

### Se um dia migrar para hospedagem comum

O `.htaccess` volta a valer e o `server.js` passa a ser ignorado — não precisa
apagar nada. O caminho é: **Arquivos → Gerenciador de Arquivos** → `public_html`
→ subir o conteúdo do repositório → **Segurança → SSL**.

### Depois de publicar

- **SSL**: hPanel → **Segurança → SSL**. Nesta hospedagem o certificado costuma
  ser automático; confirme que o site abre em `https://`.
- Abra o site e dê **Ctrl + F5**.
- Teste: botão de WhatsApp, o formulário (tem que abrir o WhatsApp com a
  mensagem pronta), o mapa, e tudo no celular.
- Se algo não subir, o menu **Logs de execução** mostra o que o servidor
  imprimiu — inclusive a linha `Site da Formato Esquadrias rodando na porta N`.

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

Abra o PowerShell nesta pasta e rode **o mesmo servidor que roda no Hostinger**:

```bash
npm start
```

Depois abra `http://localhost:3000` no navegador. Para parar, `Ctrl + C`.

Testar assim é melhor do que abrir o `index.html` com duplo clique: você vê
exatamente o que o servidor de produção vai entregar, com gzip e cache.

Para regerar o zip de upload manual depois de alterar alguma coisa:

```bash
git archive --format=zip -o site-formato-para-hostinger.zip HEAD
```

Esse comando empacota exatamente o que está no último commit — sem as fotos
originais, sem o zip antigo.
