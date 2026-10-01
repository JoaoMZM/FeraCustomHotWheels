import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import {
  listarCarrinho,
  listarCategorias,
  adicionarAoCarrinho,
  buscarProdutos,
} from "../../services/api.js";
import { IconesProdutos } from "../../components/icons/IconesProdutos.jsx";
import { ProdutosHeader } from "../../components/produtos/ProdutosHeader.jsx";
import { ProdutoCard } from "../../components/produtos/ProdutoCard.jsx";
import { PainelFiltroModal } from "../../components/produtos/PainelFiltroModal.jsx";
import "./produtos.page.css";

export default function ProdutosPage() {
  const navigate = useNavigate();
  const { logado } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([
    { valor: "todas", rotulo: "Todos os Produtos" },
  ]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");

  const [quantidades, setQuantidades] = useState({});
  const [adicionados, setAdicionados] = useState({});
  const [enviandoId, setEnviandoId] = useState(null);
  const [favoritos, setFavoritos] = useState({});
  const [totalCarrinho, setTotalCarrinho] = useState(0);

  const [menuAberto, setMenuAberto] = useState(false);
  const [posicao, setPosicao] = useState({ top: 0, left: 0 });
  const botaoFiltroRef = useRef(null);
  const painelFiltroRef = useRef(null);

  const abrirFiltro = () => {
    if (botaoFiltroRef.current) {
      const rect = botaoFiltroRef.current.getBoundingClientRect();
      setPosicao({ top: rect.bottom + 4, left: rect.left });
    }
    setMenuAberto((prev) => !prev);
  };

  useEffect(() => {
    const handleClickFora = (e) => {
      if (!document.body.contains(e.target)) return;
      const clicouNoBotao = botaoFiltroRef.current?.contains(e.target);
      const clicouNoPainel = painelFiltroRef.current?.contains(e.target);
      if (!clicouNoBotao && !clicouNoPainel) setMenuAberto(false);
    };

    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const selecionarFaixaPreco = (min, max) => {
    setPrecoMin(min);
    setPrecoMax(max);
  };

const carregarCategorias = useCallback(async () => {
  try {
    const dados = await listarCategorias();
    const lista = Array.isArray(dados?.data) ? dados.data : Array.isArray(dados) ? dados : [];

    const categoriasFormatadas = [
      { valor: "todas", rotulo: "Todos os Produtos" },
      ...lista.map((cat) => ({
        valor: cat.id_categoria,
        rotulo: cat.nome,
      })),
    ];
    setCategorias(categoriasFormatadas);
  } catch (err) {
    console.error("Erro ao carregar categorias:", err);
  }
}, []);

  const carregarProdutos = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const dados = await buscarProdutos();
      setProdutos(Array.isArray(dados) ? dados : dados.produtos || []);
    } catch (err) {
      setErro(err.message || "Não foi possível carregar os produtos.");
    } finally {
      setCarregando(false);
    }
  }, []);

  const sincronizarTotalCarrinho = useCallback(async () => {
    if (logado !== true) {
      setTotalCarrinho(0);
      return;
    }

    try {
      const carrinho = await listarCarrinho({ _silent: true });
      const listaItens = Array.isArray(carrinho) ? carrinho : carrinho.itens || [];
      const total = listaItens.reduce(
        (soma, item) => soma + (item.quantidade || 1),
        0
      );
      setTotalCarrinho(total);
    } catch {

    }
  }, [logado]);

  useEffect(() => {
    carregarCategorias();
    carregarProdutos();
  }, [carregarCategorias, carregarProdutos]);

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

    if (!logado) {
      navigate("/login");
      return;
    }

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
    if (e) e.preventDefault();
  };

  const toggleFavorito = (id) => {
    setFavoritos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

const produtosFiltrados = produtos.filter((produto) => {
  if (busca.trim() !== "") {
    const termo = busca.toLowerCase();
    const nomeMatch = produto.nome?.toLowerCase().includes(termo);
    const skuMatch = String(produto.sku || "").toLowerCase().includes(termo);
    if (!nomeMatch && !skuMatch) return false;
  }

  const min = precoMin !== "" ? Number(precoMin) : null;
  const max = precoMax !== "" ? Number(precoMax) : null;
  if (min !== null && produto.preco < min) return false;
  if (max !== null && produto.preco > max) return false;

  return true;
});

  const limparFiltros = () => {
    setBusca("");
    setCategoria("todas");
    setPrecoMin("");
    setPrecoMax("");
  };

  const categoriaAtual =
    categorias.find((item) => item.valor === categoria)?.rotulo ||
    "Todos os Produtos";

  return (
    <div className="produtos-page">
      <ProdutosHeader
        busca={busca}
        setBusca={setBusca}
        totalCarrinho={totalCarrinho}
        onSubmitBusca={handleSubmitBusca}
      />

      <main className="produtos-content">
        <div className="produtos-toolbar-topo" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="produtos-breadcrumb">
            <button type="button" onClick={() => navigate("/")}>
              Início
            </button>
            <IconesProdutos name="chevron" size={12} />
            <span>Catálogo</span>
            <IconesProdutos name="chevron" size={12} />
            <span style={{ color: "#0f172a" }}>{categoriaAtual}</span>
          </div>

          <div className="produtos-filtro-inline">
            <button
              type="button"
              ref={botaoFiltroRef}
              className={`nav-mega-gatilho${menuAberto ? " aberto" : ""}`}
              onClick={abrirFiltro}
              aria-expanded={menuAberto}
            >
              Filtrar produtos
              <IconesProdutos name="chevron" size={12} />
            </button>
          </div>

          {menuAberto && (
            <PainelFiltroModal
              painelFiltroRef={painelFiltroRef}
              posicao={posicao}
              setMenuAberto={setMenuAberto}
              listaCategorias={categorias}
              categoria={categoria}
              setCategoria={setCategoria}
              precoMin={precoMin}
              setPrecoMin={setPrecoMin}
              precoMax={precoMax}
              setPrecoMax={setPrecoMax}
              selecionarFaixaPreco={selecionarFaixaPreco}
              onLimparFiltros={limparFiltros}
            />
          )}
        </div>

        <div className="produtos-toolbar">
          <strong>{categoriaAtual}</strong>
          {!carregando && !erro && (
            <span>
              {produtosFiltrados.length}{" "}
              {produtosFiltrados.length === 1 ? "item" : "itens"}
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

          {!carregando && !erro && produtosFiltrados.length === 0 && (
            <div className="produtos-feedback">
              <div className="produtos-feedback-inner">
                <div className="produtos-feedback-icon">
                  <IconesProdutos name="box" size={22} />
                </div>
                <strong>Nenhum produto encontrado</strong>
                <p>
                  Tente alterar sua busca, categoria ou faixa de preço.
                </p>
              </div>
            </div>
          )}

          {!carregando &&
            !erro &&
            produtosFiltrados.map((produto) => {
              const idValido = produto.id_produto || produto.id || produto._id;

              return (
                <ProdutoCard
                  key={produto.id}
                  produto={produto}
                  quantidade={getQuantidade(produto.id)}
                  onAlterarQuantidade={alterarQuantidade}
                  onAdicionarCarrinho={handleAdicionarCarrinho}
                  logado={logado}
                  enviando={enviandoId === produto.id}
                  adicionado={!!adicionados[produto.id]}
                  favorito={!!favoritos[produto.id]}
                  onToggleFavorito={toggleFavorito}
                  onClickDetalhes={() => navigate(`/produtos/${idValido}`)}
                />
              );
            })}
        </section>
      </main>
    </div>
  );
}