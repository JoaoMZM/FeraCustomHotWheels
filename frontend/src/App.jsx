import React, { useState } from 'react';

import LoginPage from './pages/usuarios/login.page.js';
import CadastroPage from './pages/usuarios/cadastro.page.js';
import RecuperarSenhaPage from './pages/usuarios/recuperacao.page.js';

export default function App() {

    const [pagina, setPagina] = useState('login');

    return (
        <div>

            {pagina === 'login' && (
                <LoginPage
                    onNavigateToCadastro={() => setPagina('cadastro')}
                    onNavigateToRecuperarSenha={() => setPagina('recuperar')}
                />
            )}

            {pagina === 'cadastro' && (
                <CadastroPage />
            )}

            {pagina === 'recuperar' && (
                <RecuperarSenhaPage
                    onVoltarLogin={() => setPagina('login')}
                />
            )}

        </div>
    );
}