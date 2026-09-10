import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { listarProdutos, listarCarrinho, listarCategorias } from "../../services/api.js";
import { IconesProdutos } from "../../components/icons/IconesProdutos.jsx";
import { ProdutosHeader } from "../../components/produtos/ProdutosHeader.jsx";
import { ProdutoCard } from "../../components/produtos/ProdutoCard.jsx";
import "./produtos.page.css";

export default function ProdutosPage() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([
    { valor: "todas", rotulo: "Todos os Produtos" },
  ]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");

  const [quantidades, setQuantidades] = useState({});
  const [adicionados, setAdicionados] = useState({});
  const [enviandoId, setEnviandoId] = useState(null);
  const [favoritos, setFavoritos] = useState({});
  const [totalCarrinho, setTotalCarrinho] = useState(0);

  const carregarCategorias = useCallback(async () => {
    try {
      const dados = await listarCategorias();
      const lista = Array.isArray(dados) ? dados : dados.categorias || [];
      const categoriasFormatadas = [
        { valor: "todas", rotulo: "Todos os Produtos" },
        ...lista.map((cat) => ({
          valor: cat.slug || cat.valor || cat.id || cat.nome,
          rotulo: cat.nome || cat.rotulo || cat.valor,
        })),
      ];
      setCategorias(categoriasFormatadas);
    } catch {
    }
  }, []);

  const carregarProdutos = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const dados = await listarProdutos({ busca, categoria });
      setProdutos(Array.isArray(dados) ? dados : dados.produtos || []);
    } catch (err) {
      setErro(err.message || "Não foi possível carregar os produtos.");
    } finally {
      setCarregando(false);
    }
  }, [busca, categoria]);

  const sincronizarTotalCarrinho = useCallback(async () => {
    try {
      const carrinho = await listarCarrinho();
      const listaItens = Array.isArray(carrinho) ? carrinho : carrinho.itens || [];
      const total = listaItens.reduce(
        (soma, item) => soma + (item.quantidade || 1),
        0
      );
      setTotalCarrinho(total);
    } catch {
    }
  }, []);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  useEffect(() => {
    carregarProdutos();
  }, [categoria]);

  useEffect(() => {
    const timer = setTimeout(() => {
      carregarProdutos();
    }, 400);

    return () => clearTimeout(timer);
  }, [busca]);

  useEffect(() => {
    sincronizarTotalCarrinho();
  }, [sincronizarTotalCarrinho]);

  const getQuantidade = (id) => quantidades[id] || 1;

  const alterarQuantidade = (id, delta, estoqueMax) => {
    setQuantidades((prev) => {
      const atual = prev[id] || 1;
      const proximo = Math.min(
        Math.max(atual + delta, 1),
        estoqueMax > 0 ? estoqueMax : 1
      );

      return { ...prev, [id]: proximo };
    });
  };

  const handleAdicionarCarrinho = async (produto) => {
    if (produto.estoque <= 0) return;

    setEnviandoId(produto.id);

    try {
      const qtd = getQuantidade(produto.id);

      await adicionarAoCarrinho({
        produtoId: produto.id,
        quantidade: qtd,
      });

      setAdicionados((prev) => ({ ...prev, [produto.id]: true }));
      await sincronizarTotalCarrinho();

      setTimeout(() => {
        setAdicionados((prev) => ({ ...prev, [produto.id]: false }));
      }, 1800);
    } catch (err) {
      setErro(err.message || "Erro ao adicionar o item ao carrinho.");
    } finally {
      setEnviandoId(null);
    }
  };

  const handleSubmitBusca = (e) => {
    e.preventDefault();
    carregarProdutos();
  };

  const toggleFavorito = (id) => {
    setFavoritos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categoriaAtual =
    categorias.find((item) => item.valor === categoria)?.rotulo ||
    "Todos os Produtos";

  return (
    <div className="produtos-page">
      <ProdutosHeader
        busca={busca}
        setBusca={setBusca}
        categoria={categoria}
        setCategoria={setCategoria}
        categorias={categorias}
        totalCarrinho={totalCarrinho}
        onSubmitBusca={handleSubmitBusca}
      />

      <main className="produtos-content">
        <div className="produtos-breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Início
          </button>
          <IconesProdutos name="chevron" size={12} />
          <span>Catálogo</span>
          <IconesProdutos name="chevron" size={12} />
          <span style={{ color: "#0f172a" }}>{categoriaAtual}</span>
        </div>

        <div className="produtos-toolbar">
          <strong>{categoriaAtual}</strong>
          {!carregando && !erro && (
            <span>
              {produtos.length}{" "}
              {produtos.length === 1 ? "item" : "itens"}
            </span>
          )}
        </div>

        <section className="produtos-grid" aria-live="polite">
          {carregando &&
            Array.from({ length: 8 }).map((_, index) => (
              <div className="produto-skeleton" key={index}>
                <div className="produto-skeleton-img" />
                <div className="produto-skeleton-body">
                  <div className="produto-skeleton-line produto-skeleton-line--short" />
                  <div className="produto-skeleton-line produto-skeleton-line--long" />
                  <div className="produto-skeleton-line produto-skeleton-line--price" />
                </div>
              </div>
            ))}

          {!carregando && erro && (
            <div className="produtos-feedback">
              <div className="produtos-feedback-inner">
                <div className="produtos-feedback-icon">
                  <IconesProdutos name="refresh" size={22} />
                </div>
                <strong>Não foi possível carregar os produtos</strong>
                <p>{erro}</p>
                <button type="button" onClick={carregarProdutos}>
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {!carregando && !erro && produtos.length === 0 && (
            <div className="produtos-feedback">
              <div className="produtos-feedback-inner">
                <div className="produtos-feedback-icon">
                  <IconesProdutos name="box" size={22} />
                </div>
                <strong>Nenhum produto encontrado</strong>
                <p>
                  Tente alterar sua busca ou selecionar outra linha de produtos.
                </p>
              </div>
            </div>
          )}

          {!carregando &&
            !erro &&
            produtos.map((produto) => (
              <ProdutoCard
                key={produto.id}
                produto={produto}
                quantidade={getQuantidade(produto.id)}
                onAlterarQuantidade={alterarQuantidade}
                onAdicionarCarrinho={handleAdicionarCarrinho}
                enviando={enviandoId === produto.id}
                adicionado={!!adicionados[produto.id]}
                favorito={!!favoritos[produto.id]}
                onToggleFavorito={toggleFavorito}
              />
            ))}
        </section>
      </main>
    </div>
  );
}