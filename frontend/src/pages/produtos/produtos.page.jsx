import { useState, useEffect, useCallback } from "react";
import { listarProdutos, adicionarAoCarrinho, listarCarrinho } from "../../services/api.js";
import { useNavigate } from "react-router-dom";

const CATEGORIAS = [
  { valor: "todas", rotulo: "Todos os Produtos" },
];

const Icon = ({ name, size = 20 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7.5" />
        <path d="m20 20-3.6-3.6" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="7" r="3.5" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    heart: <path d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 12 5.7a4.8 4.8 0 0 1 8.8 3.1Z" />,
    cart: (
      <>
        <path d="M3 4h2l1.7 10.1a2 2 0 0 0 2 1.7h8.7a2 2 0 0 0 1.9-1.4L21 8H6" />
        <circle cx="9" cy="20" r="1.2" />
        <circle cx="18" cy="20" r="1.2" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    refresh: (
      <>
        <path d="M20 11a8 8 0 0 0-14.9-4" />
        <path d="M4 4v5h5" />
        <path d="M4 13a8 8 0 0 0 14.9 4" />
        <path d="M20 20v-5h-5" />
      </>
    ),
    box: (
      <>
        <path d="m3 7 9-4 9 4-9 4-9-4Z" />
        <path d="M3 7v10l9 4 9-4V7" />
        <path d="M12 11v10" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
};

export default function ProdutosPage() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");

  const [quantidades, setQuantidades] = useState({});
  const [adicionados, setAdicionados] = useState({});
  const [enviandoId, setEnviandoId] = useState(null);
  const [favoritos, setFavoritos] = useState({});
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

  const sincronizarTotalCarrinho = useCallback(async () => {
    try {
      const carrinho = await listarCarrinho();
      const total = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
      setTotalCarrinho(total);
    } catch {
      // badge não é crítico, falha silenciosamente
    }
  }, []);

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

  const formatarPreco = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const estoqueInfo = (estoque) => {
    if (estoque <= 0) {
      return {
        texto: "Esgotado",
        classe: "produto-estoque produto-estoque--esgotado",
      };
    }

    if (estoque <= 5) {
      return {
        texto: `Restam ${estoque} un.`,
        classe: "produto-estoque produto-estoque--baixo",
      };
    }

    return {
      texto: "Em estoque",
      classe: "produto-estoque produto-estoque--disponivel",
    };
  };

  const toggleFavorito = (id) => {
    setFavoritos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categoriaAtual =
    CATEGORIAS.find((item) => item.valor === categoria)?.rotulo ||
    "Todos os Produtos";

  return (
    <div className="produtos-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .produtos-page {
          --pc-bg: #0b0d10;
          --pc-body-bg: #f3f5f8;
          --pc-surface: #ffffff;
          --pc-text: #0f172a;
          --pc-muted: #64748b;
          --pc-border: #e2e8f0;
          --pc-primary: #e30613;
          --pc-primary-hover: #c4030e;
          --pc-primary-gradient: linear-gradient(135deg, #ff2a34 0%, #b80510 100%);
          --pc-success: #108a48;
          --pc-warning: #d97706;
          --pc-shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.04);
          --pc-shadow-md: 0 12px 28px -6px rgba(15, 23, 42, 0.08);
          --pc-shadow-lg: 0 20px 40px -10px rgba(15, 23, 42, 0.14);
          
          min-height: 100vh;
          background-color: var(--pc-body-bg);
          color: var(--pc-text);
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .produtos-page *,
        .produtos-page *::before,
        .produtos-page *::after {
          box-sizing: border-box;
        }

        /* HEADER GLASS */
        .produtos-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .produtos-header-main {
          width: min(1400px, calc(100% - 48px));
          min-height: 76px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: auto minmax(300px, 1fr) auto;
          align-items: center;
          gap: 32px;
        }

        .produtos-logo {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          border: 0;
          background: transparent;
          padding: 0;
          transition: transform 0.2s ease;
        }

        .produtos-logo:hover {
          transform: scale(1.02);
        }

        .produtos-logo img {
          width: 42px;
          height: 42px;
          object-fit: contain;
          filter: drop-shadow(0 4px 8px rgba(227, 6, 19, 0.2));
        }

        .produtos-logo strong {
          font-size: 20px;
          letter-spacing: -0.03em;
          font-weight: 800;
          color: #0f172a;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .produtos-search {
          height: 48px;
          display: flex;
          align-items: center;
          background: #f1f5f9;
          border: 1.5px solid transparent;
          border-radius: 99px;
          padding: 0 6px 0 18px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .produtos-search:focus-within {
          background: #ffffff;
          border-color: var(--pc-primary);
          box-shadow: 0 0 0 4px rgba(227, 6, 19, 0.12);
        }

        .produtos-search button {
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 50%;
          background: transparent;
          color: #64748b;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .produtos-search button:hover {
          background: var(--pc-primary);
          color: #ffffff;
        }

        .produtos-search input {
          width: 100%;
          height: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--pc-text);
          font-size: 14px;
          font-weight: 500;
        }

        .produtos-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .produtos-account {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 16px 6px 6px;
          border-radius: 99px;
          background: #f1f5f9;
          color: #334155;
          border: 1px solid transparent;
          transition: all 0.2s;
          cursor: pointer;
        }

        .produtos-account:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }

        .produtos-account-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #fff;
          display: grid;
          place-items: center;
          color: #0f172a;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .produtos-account-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
          font-size: 11px;
          color: var(--pc-muted);
        }

        .produtos-account-text strong {
          color: #0f172a;
          font-size: 12px;
          font-weight: 700;
        }

        .produtos-icon-button {
          position: relative;
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 1px solid var(--pc-border);
          border-radius: 50%;
          background: #fff;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: var(--pc-shadow-sm);
        }

        .produtos-icon-button:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: var(--pc-shadow-md);
          color: var(--pc-primary);
        }

        .produtos-cart-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          border-radius: 99px;
          background: var(--pc-primary-gradient);
          color: white;
          font-size: 11px;
          font-weight: 800;
          display: grid;
          place-items: center;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(227, 6, 19, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        /* NAVIGATION PILLS */
        .produtos-nav {
          border-top: 1px solid rgba(226, 232, 240, 0.6);
          background: #ffffff;
        }

        .produtos-nav-inner {
          width: min(1400px, calc(100% - 48px));
          margin: 0 auto;
          min-height: 52px;
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .produtos-nav-inner::-webkit-scrollbar { display: none; }

        .produtos-nav-button {
          border: 0;
          background: transparent;
          color: #64748b;
          padding: 8px 18px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .produtos-nav-button:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .produtos-nav-button.ativo {
          background: #0f172a;
          color: #fff;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }



        .produtos-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
        }

        .produtos-breadcrumb button {
          border: 0;
          background: transparent;
          padding: 0;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }

        .produtos-breadcrumb button:hover {
          color: var(--pc-primary);
        }


        .produtos-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
          border-radius: 14px;
          padding: 12px 22px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          backdrop-filter: blur(12px);
          transition: all 0.25s ease;
          z-index: 2;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .produtos-back:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        /* TOOLBAR */
        .produtos-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .produtos-toolbar strong {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .produtos-toolbar span {
          color: var(--pc-muted);
          font-size: 13px;
          font-weight: 700;
          background: #e2e8f0;
          padding: 4px 14px;
          border-radius: 99px;
        }

        /* PRODUCT GRID & CARDS */
        .produtos-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
        }

        .produto-card {
          background: var(--pc-surface);
          border: 1px solid var(--pc-border);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: var(--pc-shadow-sm);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .produto-card:hover {
          transform: translateY(-6px);
          border-color: #cbd5e1;
          box-shadow: var(--pc-shadow-lg);
        }

        .produto-card-imagem {
          position: relative;
          aspect-ratio: 1 / 1;
          background: radial-gradient(circle at 50% 50%, #ffffff 0%, #f8fafc 100%);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #f1f5f9;
        }

        .produto-card-imagem img {
          width: 85%;
          height: 85%;
          object-fit: contain;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          filter: drop-shadow(0 10px 15px rgba(0,0,0,0.08));
        }

        .produto-card:hover .produto-card-imagem img {
          transform: scale(1.08) rotate(-1.5deg);
        }

        .produto-card-imagem-placeholder {
          color: #cbd5e1;
          display: grid;
          place-items: center;
        }

        .produto-card-favorito {
          position: absolute;
          z-index: 2;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          display: grid;
          place-items: center;
          color: #94a3b8;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          transition: all 0.2s ease;
        }

        .produto-card-favorito:hover,
        .produto-card-favorito.ativo {
          color: var(--pc-primary);
          background: #ffffff;
          border-color: rgba(227, 6, 19, 0.2);
          transform: scale(1.1);
        }

        .produto-card-categoria {
          position: absolute;
          top: 14px;
          left: 14px;
          padding: 5px 10px;
          border-radius: 8px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .06em;
          font-weight: 800;
        }

        .produto-estoque {
          position: absolute;
          bottom: 14px;
          left: 14px;
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
          backdrop-filter: blur(8px);
        }

        .produto-estoque--disponivel {
          background: rgba(220, 252, 231, 0.9);
          color: #15803d;
        }

        .produto-estoque--baixo {
          background: rgba(254, 243, 199, 0.9);
          color: #b45309;
        }

        .produto-estoque--esgotado {
          background: rgba(241, 245, 249, 0.9);
          color: #64748b;
        }

        .produto-card-corpo {
          padding: 20px;
          display: flex;
          flex: 1;
          flex-direction: column;
        }

        .produto-card-sku {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .08em;
          margin-bottom: 6px;
        }

        .produto-card-nome {
          font-size: 15px;
          line-height: 1.35;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 40px;
        }

        .produto-card-preco-linha {
          margin-top: auto;
          margin-bottom: 16px;
        }

        .produto-card-preco-original {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          text-decoration: line-through;
          font-weight: 600;
        }

        .produto-card-preco {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .produto-card-qtd {
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0 4px;
          margin-bottom: 12px;
        }

        .produto-card-qtd button {
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 8px;
          background: #fff;
          color: #334155;
          display: grid;
          place-items: center;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
          transition: all 0.2s;
        }

        .produto-card-qtd button:hover:not(:disabled) {
          background: #0f172a;
          color: #fff;
        }

        .produto-card-qtd button:disabled {
          opacity: .3;
          cursor: not-allowed;
          box-shadow: none;
        }

        .produto-card-qtd span {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .btn-add-carrinho {
          width: 100%;
          height: 46px;
          border: 0;
          border-radius: 12px;
          background: var(--pc-primary-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(227, 6, 19, 0.25);
          transition: all 0.2s ease;
        }

        .btn-add-carrinho:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(227, 6, 19, 0.35);
        }

        .btn-add-carrinho:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-add-carrinho:disabled {
          background: #e2e8f0;
          color: #94a3b8;
          box-shadow: none;
          cursor: not-allowed;
        }

        .btn-add-carrinho.adicionado {
          background: var(--pc-success);
          box-shadow: 0 4px 12px rgba(16, 138, 72, 0.25);
        }

        /* SPINNER DE CARREGAMENTO NO BOTÃO */
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* SKELETON LOADING ANIMATION */
        .produto-skeleton {
          background: #ffffff;
          border: 1px solid var(--pc-border);
          border-radius: 20px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: var(--pc-shadow-sm);
        }

        .produto-skeleton-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }

        .produto-skeleton-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .produto-skeleton-line {
          height: 14px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
        }

        .produto-skeleton-line--short { width: 35%; }
        .produto-skeleton-line--long { width: 85%; height: 18px; }
        .produto-skeleton-line--price { width: 50%; height: 24px; margin-top: auto; }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* FEEDBACK / ERRO / VAZIO */
        .produtos-feedback {
          grid-column: 1 / -1;
          padding: 60px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
          border-radius: 20px;
          border: 1px dashed #cbd5e1;
        }

        .produtos-feedback-inner {
          max-width: 380px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .produtos-feedback-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #64748b;
          display: grid;
          place-items: center;
          margin-bottom: 4px;
        }

        .produtos-feedback strong {
          font-size: 18px;
          color: #0f172a;
        }

        .produtos-feedback p {
          margin: 0;
          font-size: 14px;
          color: var(--pc-muted);
        }

        .produtos-feedback button {
          margin-top: 8px;
          padding: 10px 20px;
          border-radius: 99px;
          border: 0;
          background: #0f172a;
          color: #fff;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .produtos-feedback button:hover {
          background: var(--pc-primary);
        }

        /* RESPONSIVIDADE */
        @media (max-width: 1200px) {
          .produtos-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }

        @media (max-width: 840px) {
          .produtos-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
          .produtos-header-main { grid-template-columns: auto 1fr auto; gap: 12px; }
          .produtos-account { display: none; }
          .produtos-logo strong { display: none; }
          .produtos-back { width: 100%; justify-content: center; }
        }

        @media (max-width: 480px) {
          .produtos-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HEADER */}
      <header className="produtos-header">
        <div className="produtos-header-main">
          <button
            type="button"
            className="produtos-logo"
            onClick={() => navigate("/produtos")}
            aria-label="Ir para produtos"
          >
            <img src="/FeraCustomLogo.jpg" alt="Fera Custom" />
            <strong>FERA CUSTOM</strong>
          </button>

          <form className="produtos-search" onSubmit={handleSubmitBusca}>
            <input
              type="text"
              placeholder="Buscar miniaturas, linhas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar produtos"
            />
            <button type="submit" aria-label="Buscar produtos">
              <Icon name="search" size={18} />
            </button>
          </form>

          <div className="produtos-header-actions">
            <div className="produtos-account">
              <div className="produtos-account-avatar">
                <Icon name="user" size={18} />
              </div>
              <span className="produtos-account-text">
                Minha Conta
                <strong>Meus Pedidos</strong>
              </span>
            </div>

            <button
              type="button"
              className="produtos-icon-button"
              aria-label="Favoritos"
            >
              <Icon name="heart" size={20} />
            </button>

            <button
              type="button"
              className="produtos-icon-button"
              aria-label="Carrinho"
              onClick={() => navigate("/carrinho")}
            >
              <Icon name="cart" size={20} />
              {totalCarrinho > 0 && (
                <span className="produtos-cart-badge">{totalCarrinho}</span>
              )}
            </button>
          </div>
        </div>

        {/* NAVIGATION BAR */}
        <nav className="produtos-nav" aria-label="Categorias de produtos">
          <div className="produtos-nav-inner">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.valor}
                type="button"
                className={`produtos-nav-button${
                  categoria === cat.valor ? " ativo" : ""
                }`}
                onClick={() => setCategoria(cat.valor)}
              >
                {cat.rotulo}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="produtos-content">
        <div className="produtos-breadcrumb">
          <button type="button" onClick={() => navigate("/produtos")}>
            Início
          </button>
          <Icon name="chevron" size={12} />
          <span>Catálogo</span>
          <Icon name="chevron" size={12} />
          <span style={{ color: "#0f172a" }}>{categoriaAtual}</span>
        </div>
    

        {/* TOOLBAR */}
        <div className="produtos-toolbar">
          <strong>{categoriaAtual}</strong>
          {!carregando && !erro && (
            <span>
              {produtos.length}{" "}
              {produtos.length === 1 ? "item" : "itens"}
            </span>
          )}
        </div>

        {/* GRID DE PRODUTOS */}
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
                  <Icon name="refresh" size={22} />
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
                  <Icon name="box" size={22} />
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
            produtos.map((produto) => {
              const estoque = estoqueInfo(produto.estoque);
              const qtd = getQuantidade(produto.id);
              const esgotado = produto.estoque <= 0;
              const enviando = enviandoId === produto.id;
              const adicionado = adicionados[produto.id];
              const favorito = favoritos[produto.id];
              const temDesconto =
                produto.precoOriginal &&
                produto.precoOriginal > produto.preco;

              return (
                <article className="produto-card" key={produto.id}>
                  <div className="produto-card-imagem">
                    {produto.imagemUrl ? (
                      <img src={produto.imagemUrl} alt={produto.nome} />
                    ) : (
                      <div className="produto-card-imagem-placeholder">
                        <Icon name="box" size={38} />
                      </div>
                    )}

                    <button
                      type="button"
                      className={`produto-card-favorito${
                        favorito ? " ativo" : ""
                      }`}
                      onClick={() => toggleFavorito(produto.id)}
                      aria-label="Adicionar aos favoritos"
                    >
                      <Icon name="heart" size={18} />
                    </button>

                    {produto.categoria && (
                      <span className="produto-card-categoria">
                        {produto.categoria}
                      </span>
                    )}

                    <span className={estoque.classe}>{estoque.texto}</span>
                  </div>

                  <div className="produto-card-corpo">
                    {produto.sku && (
                      <span className="produto-card-sku">SKU #{produto.sku}</span>
                    )}

                    <span className="produto-card-nome">{produto.nome}</span>

                    <div className="produto-card-preco-linha">
                      {temDesconto && (
                        <span className="produto-card-preco-original">
                          {formatarPreco(produto.precoOriginal)}
                        </span>
                      )}
                      <span className="produto-card-preco">
                        {formatarPreco(produto.preco)}
                      </span>
                    </div>

                    {!esgotado && (
                      <div
                        className="produto-card-qtd"
                        aria-label={`Quantidade de ${produto.nome}`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            alterarQuantidade(produto.id, -1, produto.estoque)
                          }
                          disabled={qtd <= 1}
                        >
                          <Icon name="minus" size={14} />
                        </button>

                        <span>{qtd}</span>

                        <button
                          type="button"
                          onClick={() =>
                            alterarQuantidade(produto.id, 1, produto.estoque)
                          }
                          disabled={qtd >= produto.estoque}
                        >
                          <Icon name="plus" size={14} />
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      className={`btn-add-carrinho${
                        adicionado ? " adicionado" : ""
                      }`}
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
                          Adicionado!
                          <Icon name="check" size={16} />
                        </>
                      ) : esgotado ? (
                        "Produto Esgotado"
                      ) : (
                        <>
                          Comprar
                          <Icon name="cart" size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
        </section>
      </main>
    </div>
  );
}