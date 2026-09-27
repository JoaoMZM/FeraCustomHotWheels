import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconesProdutos } from "../icons/IconesProdutos";
import { logoutAdmin } from "../../services/api.js";

const lerAdminSalvo = () => {
  try {
    return JSON.parse(localStorage.getItem("admin_payload")) || null;
  } catch {
    return null;
  }
};

export const ProdutosHeader = ({
  busca = "",
  setBusca = () => { },
  totalCarrinho = 0,
  onSubmitBusca = (e) => e?.preventDefault(),
}) => {
  const navigate = useNavigate();

  const [usuarioAdmin, setUsuarioAdmin] = useState(lerAdminSalvo);
  const ehAdmin = usuarioAdmin?.role === "admin";

  const estaAutenticado = () => {
    const token = localStorage.getItem("fera_token");
    return Boolean(token && token !== "null" && token !== "undefined" && token.trim() !== "");
  };

  const navegarProtegido = (rotaDestino) => {
    if (estaAutenticado()) {
      navigate(rotaDestino);
    } else {
      localStorage.removeItem("fera_token");
      navigate("/login");
    }
  };

  const handleSairAdmin = async () => {
    try {
      await logoutAdmin();
    } catch {
    } finally {
      localStorage.removeItem("admin_payload");
      setUsuarioAdmin(null);
      navigate("/");
    }
  };

  return (
    <header className="produtos-header">
      {ehAdmin && (
        <div className="produtos-admin-faixa">
          <span>
            Modo administrador — {usuarioAdmin?.name || usuarioAdmin?.email}
          </span>
          <div className="produtos-admin-faixa-acoes">
            <button type="button" onClick={() => navigate("/admin/produtos")}>
              Painel Admin
            </button>
            <button type="button" onClick={handleSairAdmin}>
              Sair do admin
            </button>
          </div>
        </div>
      )}

      <div className="produtos-header-main">
        <button
          type="button"
          className="produtos-logo"
          onClick={() => navigate("/")}
          aria-label="Ir para produtos"
        >
          <img src="/FeraCustomLogo.jpg" alt="Fera Custom" />
          <strong>FERA CUSTOM</strong>
        </button>

        <form className="produtos-search" onSubmit={onSubmitBusca}>
          <input
            type="text"
            placeholder="Buscar miniaturas, linhas..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-label="Buscar produtos"
          />

          <button type="submit" aria-label="Buscar produtos">
            <IconesProdutos name="search" size={18} />
          </button>
        </form>

        <div className="produtos-header-actions">
          {ehAdmin && (
            <button
              type="button"
              className="produtos-account produtos-account--admin"
              onClick={() => navigate("/admin/produtos")}
              aria-label="Ir para o Painel Admin"
            >
              <div className="produtos-account-avatar">
                <IconesProdutos name="box" size={18} />
              </div>
              <span className="produtos-account-text">
                <strong>Painel Admin</strong>
              </span>
            </button>
          )}

          <button
            type="button"
            className="produtos-account"
            onClick={() => navegarProtegido("/minha-conta")}
            aria-label="Ir para Minha Conta"
          >
            <div className="produtos-account-avatar">
              <IconesProdutos name="user" size={18} />
            </div>
            <span className="produtos-account-text">
              <strong>Minha Conta</strong>
            </span>
          </button>

          <button
            type="button"
            className="produtos-account"
            onClick={() => navegarProtegido("/pedidosProdutos")}
            aria-label="Ir para Meus Pedidos"
          >
            <div className="produtos-account-avatar">
              <IconesProdutos name="box" size={18} />
            </div>
            <span className="produtos-account-text">
              <strong>Meus Pedidos</strong>
            </span>
          </button>

          <button
            type="button"
            className="produtos-account"
            aria-label="Favoritos"
            onClick={() => navigate("/favoritos")}
          >
            <div className="produtos-account-avatar">
              <IconesProdutos name="heart" size={18} />
            </div>
          </button>

          <button
            type="button"
            className="produtos-account"
            aria-label="Carrinho"
            onClick={() => navigate("/carrinho")}
          >
            <div className="produtos-account-avatar" style={{ position: "relative" }}>
              <IconesProdutos name="cart" size={18} />
              {totalCarrinho > 0 && (
                <span className="produtos-cart-badge">{totalCarrinho}</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};