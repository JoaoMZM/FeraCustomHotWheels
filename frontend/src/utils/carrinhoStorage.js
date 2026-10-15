// Camada de persistência do carrinho no localStorage.
// Só mexe com leitura/gravação e validação dos dados salvos.

export const CHAVE_CARRINHO = 'carrinho';

const sanitizarItem = (item) => {
  if (!item || item.id === null || item.id === undefined || item.id === '') return null;

  const quantidade = Math.floor(Number(item.quantidade));
  const preco = Number(item.preco);

  if (!Number.isFinite(quantidade) || quantidade < 1) return null;
  if (!Number.isFinite(preco) || preco < 0) return null;

  const estoque = Number(item.estoque);
  const precoOriginal = Number(item.precoOriginal);

  return {
    id: String(item.id),
    nome: String(item.nome ?? 'Produto sem nome'),
    sku: item.sku ? String(item.sku) : '',
    preco,
    precoOriginal: Number.isFinite(precoOriginal) && precoOriginal > 0 ? precoOriginal : null,
    imagemUrl: typeof item.imagemUrl === 'string' ? item.imagemUrl : '',
    estoque: Number.isFinite(estoque) && estoque > 0 ? estoque : 0,
    quantidade,
  };
};

export function lerCarrinho() {
  try {
    const bruto = localStorage.getItem(CHAVE_CARRINHO);
    if (!bruto) return [];

    const dados = JSON.parse(bruto);
    if (!Array.isArray(dados)) return [];

    return dados.map(sanitizarItem).filter(Boolean);
  } catch {
    // JSON corrompido ou localStorage indisponível (modo privado, por exemplo)
    return [];
  }
}

export function salvarCarrinho(itens) {
  try {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
  } catch (erro) {
    console.error('Não foi possível salvar o carrinho:', erro);
  }
}

export function limparCarrinhoSalvo() {
  try {
    localStorage.removeItem(CHAVE_CARRINHO);
  } catch {
    // ignora
  }
}
