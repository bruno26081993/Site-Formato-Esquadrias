/* =====================================================================
   Formato Esquadrias — servidor do site

   O site continua sendo HTML/CSS/JS puro. Este arquivo existe só porque
   a hospedagem de aplicativos do Hostinger roda um processo Node em vez
   de servir a pasta direto como o Apache fazia.

   Não usa nenhuma biblioteca de fora: só o que já vem no Node.
   Faz o mesmo que o .htaccess fazia:
     - abre o index.html na raiz
     - compacta o texto (gzip)
     - manda o navegador guardar em cache o que não muda
     - esconde .git, .htaccess e os arquivos de documentação
     - responde a página inicial quando o endereço não existe
   ===================================================================== */

import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const PORTA = process.env.PORT || 3000;

/* Tipo de cada extensão e por quanto tempo o navegador pode guardar. */
const TIPOS = {
  '.html': ['text/html; charset=utf-8',       'no-cache'],
  '.css':  ['text/css; charset=utf-8',        'public, max-age=3600'],
  '.js':   ['text/javascript; charset=utf-8', 'public, max-age=3600'],
  '.json': ['application/json; charset=utf-8','public, max-age=3600'],
  '.xml':  ['application/xml; charset=utf-8', 'public, max-age=3600'],
  '.txt':  ['text/plain; charset=utf-8',      'public, max-age=3600'],
  '.jpg':  ['image/jpeg',    'public, max-age=2592000'],
  '.jpeg': ['image/jpeg',    'public, max-age=2592000'],
  '.png':  ['image/png',     'public, max-age=2592000'],
  '.webp': ['image/webp',    'public, max-age=2592000'],
  '.svg':  ['image/svg+xml', 'public, max-age=2592000'],
  '.ico':  ['image/x-icon',  'public, max-age=2592000'],
  '.woff2':['font/woff2',    'public, max-age=2592000'],
};

/* O que nunca deve ser servido, por mais que peçam. */
const COMPACTAVEIS = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg']);
const PROIBIDOS    = new Set(['.md', '.mjs']);   // documentação e o próprio servidor
const NOMES_PROIBIDOS = new Set(['package.json', 'package-lock.json']);

/* Cliente desistiu no meio do download: normal, não é erro nosso. */
const DESCONEXAO = new Set(['ERR_STREAM_PREMATURE_CLOSE', 'EPIPE', 'ECONNRESET']);

function escondido(relativo) {
  // qualquer coisa que comece com ponto: .git, .htaccess, .gitignore...
  if (relativo.split('/').some((parte) => parte.startsWith('.'))) return true;
  // as instruções que deixei nas pastas não são conteúdo do site
  return path.basename(relativo).toLowerCase().startsWith('leia-me');
}

/** Converte o endereço pedido em um caminho de arquivo seguro dentro da pasta. */
function resolverArquivo(url) {
  let pedido;
  try {
    pedido = decodeURIComponent(new URL(url, 'http://x').pathname);
  } catch {
    return null;                                  // endereço mal formado
  }
  if (pedido.endsWith('/')) pedido += 'index.html';

  const relativo = pedido.replace(/^\/+/, '');
  if (!relativo || escondido(relativo)) return null;
  if (PROIBIDOS.has(path.extname(relativo).toLowerCase())) return null;
  if (NOMES_PROIBIDOS.has(path.basename(relativo).toLowerCase())) return null;

  // impede subir de pasta com ../../ e sair da raiz do site
  const destino = path.resolve(RAIZ, relativo);
  if (destino !== RAIZ && !destino.startsWith(RAIZ + path.sep)) return null;
  return destino;
}

async function enviar(req, res, arquivo, status = 200) {
  const dados = await fsp.stat(arquivo);
  const ext = path.extname(arquivo).toLowerCase();
  const [tipo, cache] = TIPOS[ext] || ['application/octet-stream', 'public, max-age=3600'];

  // marca da versão do arquivo: se não mudou, o navegador reaproveita o que tem
  const etag = `W/"${dados.size}-${dados.mtimeMs.toString(36)}"`;
  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, { ETag: etag, 'Cache-Control': cache });
    return res.end();
  }

  const cabecalho = {
    'Content-Type': tipo,
    'Cache-Control': cache,
    ETag: etag,
    'X-Content-Type-Options': 'nosniff',
  };

  const aceita = req.headers['accept-encoding'] || '';
  const compactar = COMPACTAVEIS.has(ext) && /\bgzip\b/.test(aceita);

  if (compactar) cabecalho['Content-Encoding'] = 'gzip';
  else cabecalho['Content-Length'] = dados.size;
  cabecalho.Vary = 'Accept-Encoding';

  res.writeHead(status, cabecalho);
  if (req.method === 'HEAD') return res.end();

  const leitura = fs.createReadStream(arquivo);
  if (compactar) await pipeline(leitura, zlib.createGzip(), res);
  else await pipeline(leitura, res);
}

const servidor = http.createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Método não permitido');
    }

    const arquivo = resolverArquivo(req.url);
    if (arquivo) {
      try {
        const dados = await fsp.stat(arquivo);
        if (dados.isDirectory()) return await enviar(req, res, path.join(arquivo, 'index.html'));
        return await enviar(req, res, arquivo);
      } catch {
        // se a resposta já começou, não dá para recomeçar: encerra e sai
        if (res.headersSent) return res.end();
        // senão, cai na página inicial abaixo
      }
    }

    // endereço desconhecido: devolve a página inicial (é um site de uma página só)
    await enviar(req, res, path.join(RAIZ, 'index.html'), 404);
  } catch (erro) {
    if (DESCONEXAO.has(erro?.code)) return res.destroy();   // visitante fechou a aba
    console.error('Falha ao responder', req.url, erro);
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Erro interno');
  }
});

servidor.listen(PORTA, '0.0.0.0', () => {
  console.log(`Site da Formato Esquadrias rodando na porta ${PORTA}`);
});

// deixa o contêiner encerrar o processo sem cortar conexão no meio
for (const sinal of ['SIGTERM', 'SIGINT']) {
  process.on(sinal, () => servidor.close(() => process.exit(0)));
}
