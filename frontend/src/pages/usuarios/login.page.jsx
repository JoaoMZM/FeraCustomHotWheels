import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function LoginPage({
  onNavigateToCadastro,
  onNavigateToRecuperarSenha,
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (erro) setErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!formData.email || !formData.senha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErro("Digite um e-mail válido.");
      return;
    }

    setCarregando(true);
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensagem || "E-mail ou senha incorretos.");
      }

      const dados = await response.json();
      if (dados.token) localStorage.setItem("fera_token", dados.token);

      navigate("/produtos"); // <-- em vez de window.location.href
    } catch (err) {
      setErro(err.message || "Falha ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      {/* Logo */}
      <div className="brand-logo">
        <img
          src="/FeraCustomLogo.jpg"
          alt="Fera Custom Hot Wheels"
          className="logo-img"
        />

        <span className="brand-logo-text">
          Fera Custom Hot Wheels
        </span>
      </div>

      {/* Cabeçalho */}
      <div className="card-header">
        <h2>Bem-vindo de Volta</h2>

        <p className="cadastro-subtitle">
          Entre na sua conta para continuar
        </p>
      </div>

      <div className="cadastro-divider"></div>

      {/* Erro */}
      {erro && (
        <div className="alert alert-error" role="alert">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>

          {erro}
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="login-email">E-mail</label>

          <div className="input-wrap">
            <svg
              className="input-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>

            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
              className={`input-com-icone${erro && !formData.email ? " input-erro" : ""
                }`}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="senha-row">
            <label
              htmlFor="login-senha"
              style={{ marginBottom: 0 }}
            >
              Senha
            </label>

            <button
              type="button"
              className="link-esqueceu"
              onClick={() => navigate("/recuperar-senha")}
            >
              Esqueceu a senha?
            </button>
          </div>

          <div className="input-wrap">
            <svg
              className="input-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                ry="2"
              />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>

            <input
              id="login-senha"
              type={senhaVisivel ? "text" : "password"}
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              className="input-com-icone input-com-toggle"
            />

            <button
              type="button"
              className="btn-toggle-senha"
              onClick={() => setSenhaVisivel(!senhaVisivel)}
              aria-label={
                senhaVisivel ? "Ocultar senha" : "Mostrar senha"
              }
            >
              {senhaVisivel ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="btn-submit"
        >
          {carregando ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
              Verificando...
            </>
          ) : (
            <>
              Entrar na Conta

              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Rodapé */}
      <div className="cadastro-footer">
        Não tem conta?{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/cadastro");
          }}
        >
          Criar conta
        </a>
      </div>
    </div>
  );
}