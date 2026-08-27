import React, { useEffect, useState } from 'react';
import { confirmarContaUsuario } from '../../services/api.js'; // Ajuste o caminho da pasta se necessário

export default function ConfirmarContaPage({ onNavigateToLogin }) {
    const [status, setStatus] = useState('processando'); // valores: 'processando', 'sucesso', 'erro'
    const [mensagem, setMensagem] = useState('Verificando seu token de ativação...');

    useEffect(() => {
        // 1. Captura o token diretamente da URL (?token=...)
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
            setStatus('erro');
            setMensagem('Token de confirmação não foi encontrado na URL.');
            return;
        }

        // 2. Envia o token para o seu Backend Node.js
        confirmarContaUsuario(token)
            .then((dados) => {
                setStatus('sucesso');
                setMensagem(dados.message || 'Sua conta foi ativada com sucesso!');
            })
            .catch((err) => {
                setStatus('erro');
                setMensagem(err.message || 'Este link de ativação é inválido ou já expirou.');
            });
    }, []);

    // ── Ícones SVG para os Estados da Tela ──────────────────────────────────

    const IconeSucesso = () => (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '20px auto' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );

    const IconeErro = () => (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#e60000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '20px auto' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    );

    // ── Renderização da Página ──────────────────────────────────────────────

    return (
        <div className="cadastro-container" style={{ textAlign: 'center', padding: '40px 20px' }}>
            {/* Brand/Logo */}
            <div className="brand-logo" style={{ justifyContent: 'center' }}>
                <img
                    src="../../../vite-project/public/FeraCustomLogo.jpg"
                    alt="Fera Custom Hot Wheels"
                    className="logo-img"
                />
                <span className="brand-logo-text">Fera Custom Hot Wheels</span>
            </div>

            <div className="card-header">
                <h2>Verificação de Cadastro</h2>
            </div>

            <div className="cadastro-divider" />

            {/* Renderização conforme o estado da requisição */}
            <div style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {status === 'processando' && (
                    <>
                        <div className="spinner" style={{ margin: '20px auto' }}></div>
                        <p style={{ color: '#666', fontSize: '15px' }}>{mensagem}</p>
                    </>
                )}

                {status === 'sucesso' && (
                    <>
                        <IconeSucesso />
                        <p style={{ color: '#28a745', fontSize: '16px', fontWeight: '500', marginBottom: '25px' }}>
                            {mensagem}
                        </p>
                        <button 
                            type="button" 
                            className="btn-submit"
                            onClick={() => {
                                // Se você usa rotas manuais por prop, chama a função. 
                                // Se usa React Router, pode trocar por: window.location.href = '/login'
                                if (onNavigateToLogin) {
                                    onNavigateToLogin();
                                } else {
                                    window.location.href = '/login';
                                }
                            }}
                        >
                            Ir para o Login
                        </button>
                    </>
                )}

                {status === 'erro' && (
                    <>
                        <IconeErro />
                        <p style={{ color: '#e60000', fontSize: '15px', fontWeight: '500', marginBottom: '20px' }}>
                            {mensagem}
                        </p>
                        <div className="cadastro-footer">
                            <a 
                                href="#" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (onNavigateToLogin) onNavigateToLogin();
                                    else window.location.href = '/login';
                                }}
                            >
                                Voltar para a página de Login
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}