import React, { useState } from 'react';
import { solicitarRecuperacao } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import CampoTexto from '../../components/common/CampoTexto.jsx';
import { IconeEmail } from '../../components/icons/Icones.jsx';

export default function RecuperarSenhaPage({ onVoltarLogin, onNavigateToLogin }) {
  const handleVoltar = onVoltarLogin || onNavigateToLogin;

  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!email.trim()) {
      setErro('Digite seu e-mail.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErro('Digite um e-mail válido.');
      return;
    }

    setCarregando(true);

    try {
      const data = await solicitarRecuperacao(email.trim());
      setSucesso(
        data.message || data.mensagem || 'Enviamos um link de recuperação para seu e-mail.'
      );
      setEmail('');
    } catch (err) {
      setErro(err.message || 'Erro ao solicitar recuperação.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="brand-logo">
        <img
          src="/FeraCustomLogo.jpg"
          alt="Fera Custom Hot Wheels"
          className="logo-img"
        />
        <span className="brand-logo-text">Fera Custom Hot Wheels</span>
      </div>

      <div className="card-header">
        <h2>Recuperar Senha</h2>
        <p className="cadastro-subtitle">
          Digite seu e-mail para recuperar o acesso
        </p>
      </div>

      <div className="cadastro-divider" />

      <Alert tipo="error" mensagem={erro} />
      <Alert tipo="success" mensagem={sucesso} />

      <form onSubmit={handleSubmit} noValidate>
        <CampoTexto
          id="email-recuperacao"
          label="E-mail"
          tipo="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (erro) setErro('');
          }}
          placeholder="seuemail@exemplo.com"
          autoComplete="email"
          icone={<IconeEmail />}
        />

        <button type="submit" disabled={carregando} className="btn-submit">
          {carregando ? (
            <>
              <span className="spinner" aria-hidden="true" />
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

      <div className="cadastro-footer">
        <button type="button" className="btn-link" onClick={handleVoltar}>
          Voltar para login
        </button>
      </div>
    </div>
  );
}