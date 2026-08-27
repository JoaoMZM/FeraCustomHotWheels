import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecuperarSenhaPage() {
  // ⚠️ Hooks sempre dentro do corpo do componente, junto com os useState.
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErro("");
    setSucesso("");

    if (!email) {
      setErro("Digite seu e-mail.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErro("Digite um e-mail válido.");
      return;
    }

    setCarregando(true);

    try {
      // BACK-END
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSucesso("Enviamos um link de recuperação para seu e-mail.");
    } catch (err) {
      setErro("Erro ao enviar recuperação.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cadastro-container">
      {/* Logo */}
      <div className="brand-logo">
        <img
          src="/FeraCustomLogo.jpg"
          alt="Fera Custom Hot Wheels"
          className="logo-img"
        />
        <span className="brand-logo-text">Fera Custom Hot Wheels</span>
      </div>

      {/* Header */}
      <div className="card-header">
        <h2>Recuperar Senha</h2>
        <p className="cadastro-subtitle">
          Digite seu e-mail para recuperar o acesso
        </p>
      </div>

      <div className="cadastro-divider"></div>

      {/* Alertas */}
      {erro && <div className="alert alert-error">{erro}</div>}

      {sucesso && <div className="alert alert-success">{sucesso}</div>}

      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>

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
              type="email"
              id="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-com-icone"
            />
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
              Enviando...
            </>
          ) : (
            <>
              Enviar Recuperação
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

      {/* Footer */}
      <div className="cadastro-footer">
        <button
          type="button"
          className="btn-link"
          onClick={() => navigate("/")}
        >
          Voltar para login
        </button>
      </div>
    </div>
  );
}