import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { obterProdutoPorId } from '../services/api.js';
import { CHAVE_CARRINHO, lerCarrinho, salvarCarrinho } from '../utils/carrinhoStorage.js';
import { montarUrlImagem, normalizarProduto } from '../utils/produtos.js';
import { formatarPreco } from '../utils/formatters.js';

export const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState(lerCarrinho);

  // Referência sempre atualizada: permite várias ações seguidas (cliques rápidos)
  // sem depender do ciclo de renderização do React.
  const itensRef = useRef(itens);

  // Persiste no localStorage a cada mudança
  useEffect(() => {
    itensRef.current = itens;
    salvarCarrinho(itens);
  }, [itens]);

  // Mantém várias abas abertas sincronizadas
  useEffect(() => {
    const aoMudarStorage = (evento) => {
      if (evento.key === CHAVE_CARRINHO || evento.key === null) {
        const doStorage = lerCarrinho();
        itensRef.current = doStorage;
        setItens(doStorage);
      }
    };

    window.addEventListener('storage', aoMudarStorage);
    return () => window.removeEventListener('storage', aoMudarStorage);
  }, []);

  const aplicar = useCallback((transformar) => {
    const proximo = transformar(itensRef.current);
    itensRef.current = proximo;
    setItens(proximo);
  }, []);

  /**
   * Adiciona um produto ao carrinho respeitando o estoque.
   * Retorna { ok, mensagem }:
   *  - ok=false: nada foi adicionado (mensagem explica o motivo)
   *  - ok=true com mensagem: adicionou, mas limitou a quantidade pelo estoque
   */
  const adicionarItem = useCallback(
    (produto, quantidade = 1) => {
      const normal = normalizarProduto(produto);

      if (!normal.id) return { ok: false, mensagem: 'Produto inválido.' };
      if (normal.estoque <= 0) return { ok: false, mensagem: 'Este produto está esgotado.' };

      const pedida = Math.max(1, Math.floor(Number(quantidade)) || 1);
      const jaNoCarrinho = itensRef.current.find((i) => i.id === normal.id)?.quantidade ?? 0;
      const disponivel = normal.estoque - jaNoCarrinho;

      if (disponivel <= 0) {
        return {
          ok: false,
          mensagem: `Você já tem todo o estoque disponível (${normal.estoque} un.) no carrinho.`,
        };
      }

      const adicionada = Math.min(pedida, disponivel);

      aplicar((atual) => {
        const existente = atual.find((i) => i.id === normal.id);

        if (existente) {
          return atual.map((i) =>
            i.id === normal.id
              ? {
                  ...i,
                  quantidade: i.quantidade + adicionada,
                  preco: normal.preco,
                  precoOriginal: normal.precoOriginal,
                  estoque: normal.estoque,
                }
              : i
          );
        }

        return [
          ...atual,
          {
            id: normal.id,
            nome: normal.nome,
            sku: normal.sku ? String(normal.sku) : '',
            preco: normal.preco,
            precoOriginal: normal.precoOriginal,
            imagemUrl:
              montarUrlImagem(normal.imagem_produto) ||
              (typeof normal.imagemUrl === 'string' ? normal.imagemUrl : ''),
            estoque: normal.estoque,
            quantidade: adicionada,
          },
        ];
      });

      return {
        ok: true,
        mensagem:
          adicionada < pedida
            ? `Adicionamos apenas ${adicionada} un. — limite de estoque atingido.`
            : null,
      };
    },
    [aplicar]
  );

  const alterarQuantidade = useCallback(
    (produtoId, quantidade) => {
      const alvo = String(produtoId);
      const nova = Math.floor(Number(quantidade));

      aplicar((atual) =>
        atual.flatMap((item) => {
          if (item.id !== alvo) return [item];
          if (!Number.isFinite(nova)) return [item];
          if (nova < 1) return [];

          const limite = item.estoque > 0 ? item.estoque : Infinity;
          return [{ ...item, quantidade: Math.min(nova, limite) }];
        })
      );
    },
    [aplicar]
  );

  const removerItem = useCallback(
    (produtoId) => {
      const alvo = String(produtoId);
      aplicar((atual) => atual.filter((item) => item.id !== alvo));
    },
    [aplicar]
  );

  const limparCarrinho = useCallback(() => {
    aplicar(() => []);
  }, [aplicar]);

  /**
   * Confere o carrinho com a API: atualiza preço/estoque e remove produtos
   * que saíram do ar ou esgotaram. Retorna uma lista de avisos (strings).
   * Se a API estiver fora do ar, o carrinho fica como está.
   */
  const sincronizarCarrinho = useCallback(async () => {
    const snapshot = itensRef.current;
    if (snapshot.length === 0) return [];

    const respostas = await Promise.allSettled(
      snapshot.map((item) => obterProdutoPorId(item.id))
    );

    const atualizacoes = new Map();
    const avisos = [];

    respostas.forEach((resposta, indice) => {
      const item = snapshot[indice];

      if (resposta.status === 'rejected') {
        if (resposta.reason?.status === 404) {
          atualizacoes.set(item.id, null);
          avisos.push(`"${item.nome}" não está mais disponível e foi removido do carrinho.`);
        }
        return;
      }

      const dados = resposta.value;
      const bruto = Array.isArray(dados) ? dados[0] : dados?.produto ?? dados;
      if (!bruto) return;

      const atual = normalizarProduto(bruto);

      if (atual.estoque <= 0) {
        atualizacoes.set(item.id, null);
        avisos.push(`"${item.nome}" esgotou e foi removido do carrinho.`);
        return;
      }

      if (atual.preco !== item.preco) {
        avisos.push(
          `O preço de "${item.nome}" mudou de ${formatarPreco(item.preco)} para ${formatarPreco(atual.preco)}.`
        );
      }

      if (item.quantidade > atual.estoque) {
        avisos.push(
          `A quantidade de "${item.nome}" foi ajustada para ${atual.estoque} (estoque disponível).`
        );
      }

      atualizacoes.set(item.id, {
        nome: atual.nome,
        preco: atual.preco,
        precoOriginal: atual.precoOriginal,
        estoque: atual.estoque,
        imagemUrl: montarUrlImagem(bruto.imagem_produto) || item.imagemUrl,
      });
    });

    if (atualizacoes.size > 0) {
      aplicar((atual) =>
        atual.flatMap((item) => {
          if (!atualizacoes.has(item.id)) return [item];

          const novo = atualizacoes.get(item.id);
          if (novo === null) return [];

          return [{ ...item, ...novo, quantidade: Math.min(item.quantidade, novo.estoque) }];
        })
      );
    }

    return avisos;
  }, [aplicar]);

  const totalItens = useMemo(
    () => itens.reduce((soma, item) => soma + item.quantidade, 0),
    [itens]
  );

  // Soma em centavos para evitar erros de ponto flutuante (0.1 + 0.2)
  const totalPreco = useMemo(
    () =>
      itens.reduce((soma, item) => soma + Math.round(item.preco * 100) * item.quantidade, 0) / 100,
    [itens]
  );

  const valor = useMemo(
    () => ({
      itens,
      totalItens,
      totalPreco,
      adicionarItem,
      alterarQuantidade,
      removerItem,
      limparCarrinho,
      sincronizarCarrinho,
    }),
    [
      itens,
      totalItens,
      totalPreco,
      adicionarItem,
      alterarQuantidade,
      removerItem,
      limparCarrinho,
      sincronizarCarrinho,
    ]
  );

  return <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>;
}
