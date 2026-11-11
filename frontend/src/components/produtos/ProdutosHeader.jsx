import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconesProdutos } from "../icons/IconesProdutos";

import useTheme from "../../hooks/useTheme";

// O cabeçalho funciona sozinho em qualquer página: se a página não controlar a
// busca (props), ele guarda o texto e leva o usuário ao catálogo (/?busca=...).
export const ProdutosHeader = ({ busca: buscaExterna, setBusca: setBuscaExterna, onSubmitBusca }) => {
  const navigate = useNavigate();
  const { tema, alternarTema } = useTheme();
  const [buscaInterna, setBuscaInterna] = useState("");

  const controlado = typeof setBuscaExterna === "function";
  const busca = controlado ? buscaExterna ?? "" : buscaInterna;
  const setBusca = controlado ? setBuscaExterna : setBuscaInterna;

  const enviarBusca = (e) => {
    if (onSubmitBusca) return onSubmitBusca(e);
    e.preventDefault();
    const termo = buscaInterna.trim();
    navigate(termo ? `/?busca=${encodeURIComponent(termo)}` : "/");
  };

  return (
    <header className="produtos-header">
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

        <form className="produtos-search" onSubmit={enviarBusca}>
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
          <button
            type="button"
            className="produtos-account"
            onClick={() => {
              if (localStorage.getItem("payload")) {
                navigate("/minhaconta");
              } else {
                navigate("/login");
              }
            }}
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
            className="produtos-icon-button"
            aria-label="Acompanhar Pedidos"
            title="Acompanhar Pedidos"
            onClick={() => navigate("/pedidosProdutos")}
          >
            <IconesProdutos name="truck" size={20} />
          </button>

          {/* Botão de modo claro/escuro */}
          <button
            type="button"
            className="produtos-tema-botao"
            onClick={alternarTema}
            aria-label={tema === "escuro" ? "Ativar modo claro" : "Ativar modo escuro"}
            title={tema === "escuro" ? "Modo claro" : "Modo escuro"}
          >
            {tema === "escuro" ? "☀️" : "🌙"}
          </button>

          <button
            type="button"
            className="produtos-icon-button"
            aria-label="Favoritos"
          >
            <IconesProdutos name="heart" size={20} />
          </button>

          <button
            type="button"
            className="produtos-icon-button"
            aria-label="Carrinho"
            onClick={() => navigate("/carrinho")}
          >
            <IconesProdutos name="cart" size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};