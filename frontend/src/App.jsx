import React, { useState, useEffect } from 'react';
import LoginPage from './pages/usuarios/login.page';
import CadastroPage from './pages/usuarios/cadastro.page';
import ConfirmarContaPage from './pages/usuarios/confirmarConta.page';

export default function App() {
    // Começa na tela de login por padrão
    const [telaAtual, setTelaAtual] = useState('login'); 

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('confirmar') === 'true') {
            setTelaAtual('confirmar-conta');
        }
    }, []);

    return (
        <div className="app-container">
            {/* Tela de Login */}
            {telaAtual === 'login' && (
                <LoginPage onNavigateToCadastro={() => setTelaAtual('cadastro')} />
            )}
            
            {/* Tela de Cadastro */}
            {telaAtual === 'cadastro' && (
                <CadastroPage onNavigateToLogin={() => setTelaAtual('login')} />
            )}

            {/* Tela de Confirmação de Conta */}
            {telaAtual === 'confirmar-conta' && (
                <ConfirmarContaPage onNavigateToLogin={() => setTelaAtual('login')} />
            )}
        </div>
    );
}