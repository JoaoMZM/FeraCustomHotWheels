// Utilitários para lidar com o formato dos produtos vindos da API.
// A API devolve linhas cruas do banco (id_produto, preco_original, imagem_produto...),
// e o front às vezes usa `id`. Aqui padronizamos tudo em um só lugar.
// IMPORTANTE: os IDs são UUID (string). Nunca use Number()/parseInt() neles.

const BASE_IMAGENS = 'https://localhost/';

export const obterIdProduto = (produto) =>
  produto?.id_produto ?? produto?.id ?? produto?._id ?? null;

export const montarUrlImagem = (caminho) => {
  if (!caminho || typeof caminho !== 'string') return '';
  if (/^(https?:)?\/\//.test(caminho) || caminho.startsWith('data:')) return caminho;
  return `${BASE_IMAGENS}${caminho.replace(/^\/+/, '')}`;
};

const paraNumeroOuNulo = (valor) => {
  if (valor === null || valor === undefined || valor === '') return null;
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
};

export const normalizarProduto = (produto) => {
  const id = obterIdProduto(produto);

  return {
    ...produto,
    id: id === null ? null : String(id),
    nome: produto?.nome ?? produto?.nome_produto ?? 'Produto sem nome',
    preco: paraNumeroOuNulo(produto?.preco ?? produto?.preco_produto) ?? 0,
    precoOriginal: paraNumeroOuNulo(produto?.precoOriginal ?? produto?.preco_original),
    estoque: paraNumeroOuNulo(produto?.estoque ?? produto?.estoque_produto) ?? 0,
  };
};
