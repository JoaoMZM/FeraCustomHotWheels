import { NavLink, useNavigate } from "react-router-dom";
import "./AdminHeader.css";

export default function AdminHeader() {
  const navigate = useNavigate();

  return (
    <header className="admin-header">
      <div className="admin-header-inner">
        <div className="admin-logo" onClick={() => navigate("/")}>
          <img src="/FeraCustomLogo.jpg" alt="Fera Custom Logo" />
          <strong>FERA CUSTOM</strong>
          <span className="badge-admin">Painel Admin</span>
        </div>

        <nav className="admin-abas" aria-label="Seções do painel">
          <NavLink
            to="/admin/produtos"
            className={({ isActive }) =>
              isActive ? "admin-aba ativo" : "admin-aba"
            }
          >
            Produtos
          </NavLink>
          <NavLink
            to="/admin/pedidos"
            className={({ isActive }) =>
              isActive ? "admin-aba ativo" : "admin-aba"
            }
          >
            Pedidos
          </NavLink>
        </nav>

        <button
          type="button"
          className="btn-voltar-loja"
          onClick={() => navigate("/")}
        >
          Ir para a Loja
        </button>
      </div>
    </header>
  );
}
