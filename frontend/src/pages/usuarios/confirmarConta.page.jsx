import React, { useEffect, useState } from 'react';
import { confirmarContaUsuario } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';

export default function ConfirmarContaPage({ onNavigateToLogin, onVoltarLogin }) {
    const irParaLogin = onNavigateToLogin || onVoltarLogin;
    const [status, setStatus] = useState('processando');
    const [mensagem, setMensagem] = useState('Verificando seu token de ativação...');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
            setStatus('erro');
            setMensagem('Token de confirmação não foi encontrado na URL.');
            return;
        }

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

    const handleIrParaLogin = (e) => {
        if (e) e.preventDefault();
        if (irParaLogin) {
            irParaLogin();
        } else {
            window.location.href = '/login';
        }
    };

    return (
        <div className="cadastro-container">
            <div className="brand-logo">
                <img src="/FeraCustomLogo.jpg" alt="Fera Custom Hot Wheels" className="logo-img" />
                <span className="brand-logo-text">Fera Custom Hot Wheels</span>
            </div>

            <div className="card-header">
                <h2>Verificação de Cadastro</h2>
            </div>

            <div className="cadastro-divider" />

            {status === 'processando' && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div className="spinner" style={{ margin: '0 auto 15px' }} />
                    <p style={{ color: '#666', fontSize: '0.95rem' }}>{mensagem}</p>
                </div>
            )}

            {status === 'sucesso' && (
                <>
                    <Alert tipo="success" mensagem={mensagem} />
                    <button type="button" className="btn-submit" onClick={handleIrParaLogin}>
                        Ir para o Login
                    </button>
                </>
            )}

            {status === 'erro' && (
                <>
                    <Alert tipo="error" mensagem={mensagem} />
                    <div className="cadastro-footer">
                        <a href="#" onClick={handleIrParaLogin}>
                            Voltar para a página de Login
                        </a>
                    </div>
                </>
            )}
        </div>
    );
}