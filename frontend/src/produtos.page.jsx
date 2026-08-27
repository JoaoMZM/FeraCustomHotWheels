import { useState, useEffect, useCallback } from "react";
import { listarProdutos, adicionarAoCarrinho } from "../../services/api.js";
import { useNavigate } from "react-router-dom";

// Categorias/linhas exibidas no filtro (agora também usadas na faixa de navegação
// estilo Centauro, logo abaixo da barra de busca).
// Ajuste esta lista para bater com as categorias reais cadastradas no back-end.
const CATEGORIAS = [
  { valor: "todas", rotulo: "Todas as linhas" },
  { valor: "mainline", rotulo: "Mainline" },
  { valor: "premium", rotulo: "Premium" },
  { valor: "team-transport", rotulo: "Team Transport" },
  { valor: "rlc", rotulo: "RLC" },
  { valor: "customizado", rotulo: "Customizado" },
];

export default function ProdutosPage() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");

  // quantidade selecionada por produto: { [produtoId]: number }
  const [quantidades, setQuantidades] = useState({});
  // feedback visual de "adicionado" por produto
  const [adicionados, setAdicionados] = useState({});
  const [enviandoId, setEnviandoId] = useState(null);

  // total de itens no carrinho (para o badge da topbar)
  const [totalCarrinho, setTotalCarrinho] = useState(0);

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

  // Recarrega ao trocar a categoria imediatamente
  useEffect(() => {
    carregarProdutos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoria]);

  // Debounce simples para a busca por nome, evitando 1 request por tecla
  useEffect(() => {
    const timer = setTimeout(() => {
      carregarProdutos();
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca]);

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
      setTotalCarrinho((prev) => prev + qtd);
      setTimeout(() => {
        setAdicionados((prev) => ({ ...prev, [produto.id]: false }));
      }, 1800);
    } catch (err) {
      setErro(err.message || "Erro ao adicionar o item ao carrinho.");
    } finally {
      setEnviandoId(null);
    }
  };

  // Busca disparada pela barra da topbar. Reaproveita o mesmo estado/efeito
  // de "busca" já usado pela listagem, então basta atualizar o valor —
  // o useEffect de debounce cuida de rechamar o back-end.
  const handleSubmitBusca = (e) => {
    e.preventDefault();
    carregarProdutos();
  };

  const formatarPreco = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const estoqueInfo = (estoque) => {
    if (estoque <= 0) return { texto: "Esgotado", classe: "estoque-esgotado" };
    if (estoque <= 5) return { texto: "Últimas unidades", classe: "estoque-baixo" };
    return { texto: "Disponível", classe: "estoque-disponivel" };
  };

  return (
    <>
      {/* Topbar estilo Centauro: logo + busca em destaque + conta/favoritos/
          carrinho/acessibilidade, e uma faixa de categorias logo abaixo,
          tudo colado ao topo da página. */}
      <div className="topbar-fera">
        <div className="topbar-fera-inner">
          <div
            className="topbar-fera-logo"
            onClick={() => navigate("/produtos")}
            role="button"
            tabIndex={0}
          >
            <img src="/assets/logo-fera-custom.png" alt="Fera Custom" />
            <span>FERA CUSTOM</span>
          </div>

          <form className="topbar-fera-busca" onSubmit={handleSubmitBusca}>
            <button
              type="submit"
              className="topbar-fera-busca-btn"
              aria-label="Buscar"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <span className="topbar-fera-busca-divisor" aria-hidden="true" />
            <input
              type="text"
              placeholder="O que você procura?"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar produtos"
            />
          </form>

          <div className="topbar-fera-conta">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="topbar-fera-conta-texto">
              Entre ou cadastre-se
              <strong>Acompanhe seu pedido</strong>
            </span>
          </div>

          <div className="topbar-fera-actions">
            <button className="topbar-fera-icon-btn" aria-label="Favoritos">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
            </button>

            <button
              className="topbar-fera-icon-btn"
              aria-label="Carrinho"
              onClick={() => navigate("/carrinho")}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalCarrinho > 0 && (
                <span className="topbar-fera-cart-badge">{totalCarrinho}</span>
              )}
            </button>

            <button className="topbar-fera-icon-btn" aria-label="Acessibilidade">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="4" r="1.6" />
                <path d="M12 8v6" />
                <path d="M6 10h12" />
                <path d="M9 20l3-6 3 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Faixa de categorias, no lugar do menu Esportes/Homens/Mulheres... da Centauro */}
        <nav className="topbar-fera-nav" aria-label="Categorias de produtos">
          <div className="topbar-fera-nav-inner">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.valor}
                type="button"
                className={`topbar-fera-nav-link${
                  categoria === cat.valor ? " ativo" : ""
                }`}
                onClick={() => setCategoria(cat.valor)}
              >
                {cat.rotulo}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="produtos-page">
        {/* Cabeçalho */}
        <div className="produtos-topo">
          <button
            className="btn-voltar-login"
            onClick={() => navigate("/")}
            style={{ marginBottom: "1rem", cursor: "pointer" }}
          >
            ← Voltar ao Login
          </button>
          <div className="produtos-titulo">
            <h1>Catálogo de Produtos</h1>
            <p>Miniaturas Hot Wheels disponíveis na Fera Custom</p>
          </div>
        </div>

        {/* Grid de produtos */}
        <div className="produtos-grid">
          {carregando &&
            Array.from({ length: 8 }).map((_, i) => (
              <div className="produtos-skeleton" key={i}>
                <div className="skeleton-img" />
                <div className="skeleton-linha" style={{ width: "70%" }} />
                <div className="skeleton-linha" style={{ width: "40%" }} />
              </div>
            ))}

          {!carregando && erro && (
            <div className="produtos-erro-bloco">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--red)" }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>{erro}</p>
              <button onClick={carregarProdutos}>Tentar novamente</button>
            </div>
          )}

          {!carregando && !erro && produtos.length === 0 && (
            <div className="produtos-vazio">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--dark)", opacity: 0.6 }}
              >
                <path d="M21 8v13H3V8" />
                <path d="M1 3h22v5H1z" />
                <path d="M10 12h4" />
              </svg>
              <p>Nenhum produto encontrado.</p>
            </div>
          )}

          {!carregando &&
            !erro &&
            produtos.map((produto) => {
              const estoque = estoqueInfo(produto.estoque);
              const qtd = getQuantidade(produto.id);
              const esgotado = produto.estoque <= 0;
              const enviando = enviandoId === produto.id;
              const adicionado = adicionados[produto.id];

              return (
                <div className="produto-card" key={produto.id}>
                  <div className="produto-card-imagem">
                    {produto.imagemUrl ? (
                      <img src={produto.imagemUrl} alt={produto.nome} />
                    ) : (
                      <div className="produto-card-imagem-placeholder">
                        <svg
                          width="36"
                          height="36"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    )}

                    {produto.categoria && (
                      <span className="produto-card-categoria">
                        {produto.categoria}
                      </span>
                    )}

                    <span className={`produto-card-estoque ${estoque.classe}`}>
                      {estoque.texto}
                    </span>
                  </div>

                  <div className="produto-card-corpo">
                    {produto.sku && (
                      <span className="produto-card-sku">{produto.sku}</span>
                    )}
                    <span className="produto-card-nome">{produto.nome}</span>

                    <div className="produto-card-preco-linha">
                      <span>
                        {produto.precoOriginal &&
                          produto.precoOriginal > produto.preco && (
                            <span className="produto-card-preco-original">
                              {formatarPreco(produto.precoOriginal)}
                            </span>
                          )}
                        <span className="produto-card-preco">
                          {formatarPreco(produto.preco)}
                        </span>
                      </span>
                    </div>

                    {!esgotado && (
                      <div className="produto-card-qtd">
                        <button
                          type="button"
                          onClick={() =>
                            alterarQuantidade(produto.id, -1, produto.estoque)
                          }
                          disabled={qtd <= 1}
                          aria-label="Diminuir quantidade"
                        >
                          −
                        </button>
                        <span>{qtd}</span>
                        <button
                          type="button"
                          onClick={() =>
                            alterarQuantidade(produto.id, 1, produto.estoque)
                          }
                          disabled={qtd >= produto.estoque}
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      className={`btn-add-carrinho${adicionado ? " adicionado" : ""}`}
                      disabled={esgotado || enviando}
                      onClick={() => handleAdicionarCarrinho(produto)}
                    >
                      {enviando ? (
                        <>
                          <span className="spinner" aria-hidden="true" />
                          Adicionando...
                        </>
                      ) : adicionado ? (
                        <>
                          Adicionado
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </>
                      ) : esgotado ? (
                        "Esgotado"
                      ) : (
                        <>
                          Adicionar
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}