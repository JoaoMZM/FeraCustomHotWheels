import React, { useState, useEffect } from 'react';
import { redefinirSenha } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import CampoTexto from '../../components/common/CampoTexto.jsx';
import { IconeCadeado } from '../../components/icons/Icones.jsx';

export default function RedefinirSenhaPage({ onVoltarLogin, onNavigateToLogin }) {
  const handleVoltar = onVoltarLogin || onNavigateToLogin;

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarVisivel, setConfirmarVisivel] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const idCliente = urlParams.get('id_cliente');
  const token = urlParams.get('token');

  const formDesabilitado = !idCliente || !token;

  useEffect(() => {
    if (formDesabilitado) {
      setErro('Link de redefinição inválido ou token ausente.');
    }
  }, [formDesabilitado]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (formDesabilitado) {
      setErro('Link de redefinição inválido.');
      return;
    }

    if (!novaSenha) {
      setErro('Digite a nova senha.');
      return;
    }

    if (novaSenha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setCarregando(true);

    try {
      const data = await redefinirSenha({
        id_cliente: idCliente,
        token: token,
        novaSenha: novaSenha,
      });

      setSucesso(data.message || data.mensagem || 'Senha redefinida com sucesso!');
      setNovaSenha('');
      setConfirmarSenha('');

      setTimeout(() => {
        if (handleVoltar) {
          handleVoltar();
        } else {
          window.location.href = '/';
        }
      }, 3000);
    } catch (err) {
      setErro(err.message || 'Erro ao redefinir a senha.');
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
        <h2>Criar Nova Senha</h2>
        <p className="cadastro-subtitle">
          Digite e confirme sua nova senha de acesso
        </p>
      </div>

      <div className="cadastro-divider" />

      <Alert tipo="error" mensagem={erro} />
      <Alert tipo="success" mensagem={sucesso} />

      <form onSubmit={handleSubmit} noValidate>
        <CampoTexto
          id="novaSenha"
          label="Nova Senha"
          tipo={senhaVisivel ? 'text' : 'password'}
          value={novaSenha}
          onChange={(e) => {
            setNovaSenha(e.target.value);
            if (erro) setErro('');
          }}
          placeholder="••••••••"
          disabled={formDesabilitado}
          visivel={senhaVisivel}
          onToggleVisivel={() => setSenhaVisivel(!senhaVisivel)}
          icone={<IconeCadeado />}
        />

        <CampoTexto
          id="confirmarSenha"
          label="Confirmar Nova Senha"
          tipo={confirmarVisivel ? 'text' : 'password'}
          value={confirmarSenha}
          onChange={(e) => {
            setConfirmarSenha(e.target.value);
            if (erro) setErro('');
          }}
          placeholder="••••••••"
          disabled={formDesabilitado}
          visivel={confirmarVisivel}
          onToggleVisivel={() => setConfirmarVisivel(!confirmarVisivel)}
          icone={<IconeCadeado />}
        />

        <button
          type="submit"
          disabled={carregando || formDesabilitado}
          className="btn-submit"
        >
          {carregando ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Salvando...
            </>
          ) : (
            <>
              Redefinir Senha
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="cadastro-footer">
        <button
          type="button"
          className="btn-link"
          onClick={handleVoltar || (() => (window.location.href = '/'))}
        >
          Voltar para login
        </button>
      </div>
    </div>
  );
}