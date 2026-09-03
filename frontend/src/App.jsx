import React, { useState, useEffect } from 'react';

import LoginPage from './pages/usuarios/login.page.jsx';
import CadastroPage from './pages/usuarios/cadastro.page.jsx';
import RecuperarSenhaPage from './pages/usuarios/recuperacao.page.jsx';
import RedefinirSenhaPage from './pages/usuarios/redefinirSenha.page.jsx';

export default function App() {
  const getPaginaAtual = () => {
    const path = window.location.pathname;
    if (path === '/redefinir-senha') return 'redefinir';
    if (path === '/recuperar-senha') return 'recuperar';
    if (path === '/cadastro') return 'cadastro';
    return 'login';
  };

  const [pagina, setPagina] = useState(getPaginaAtual);

  useEffect(() => {
    const handlePopState = () => {
      setPagina(getPaginaAtual());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const voltarParaLogin = () => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setPagina('login');
  };

  const navegarPara = (novaPagina, caminho) => {
    if (caminho && window.location.pathname !== caminho) {
      window.history.pushState({}, '', caminho);
    }
    setPagina(novaPagina);
  };

  return (
    <div>
      {pagina === 'login' && (
        <LoginPage
          onNavigateToCadastro={() => navegarPara('cadastro', '/cadastro')}
          onNavigateToRecuperarSenha={() => navegarPara('recuperar', '/recuperar-senha')}
          onLoginSucesso={() => {
            window.location.href = '/dashboard';
          }}
        />
      )}

      {pagina === 'cadastro' && (
        <CadastroPage
          onVoltarLogin={voltarParaLogin}
          onNavigateToLogin={voltarParaLogin}
        />
      )}

      {pagina === 'recuperar' && (
        <RecuperarSenhaPage
          onVoltarLogin={voltarParaLogin}
          onNavigateToLogin={voltarParaLogin}
        />
      )}

      {pagina === 'redefinir' && (
        <RedefinirSenhaPage
          onVoltarLogin={voltarParaLogin}
          onNavigateToLogin={voltarParaLogin}
        />
      )}
    </div>
  );
}