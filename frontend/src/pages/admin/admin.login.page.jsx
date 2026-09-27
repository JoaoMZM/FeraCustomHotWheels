import React, { useState } from 'react';
import { fazerLoginAdmin } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import CampoTexto from '../../components/common/CampoTexto.jsx';
import { IconeEmail, IconeCadeado } from '../../components/icons/Icones.jsx';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginPage({ onLoginSuccess }) {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        if (!email.trim() || !senha) {
            setErro('Por favor, preencha todos os campos.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setErro('Digite um e-mail válido.');
            return;
        }

        setCarregando(true);

        try {
            const dados = await fazerLoginAdmin({ email: email.trim(), senha });
            onLoginSuccess(dados.payload);
            navigate('/');

        } catch (err) {
            setErro(err.message || 'E-mail ou senha incorretos.');
        } finally {
            setCarregando(false);
        }
    };


    return (
        <div className="auth-page" >
            <div className="login-container">
                <div className="brand-logo">
                    <img
                        src="/FeraCustomLogo.jpg"
                        alt="Fera Custom Hot Wheels"
                        className="logo-img"
                    />
                    <span className="brand-logo-text">Fera Custom Hot Wheels</span>
                </div>

                <div className="card-header">
                    <h2>Painel Administrativo</h2>
                    <p className="cadastro-subtitle">Acesso restrito ao administrador</p>
                </div>

                <div className="cadastro-divider" />

                <Alert tipo="error" mensagem={erro} />

                <form onSubmit={handleSubmit} noValidate>
                    <CampoTexto
                        id="admin-login-email"
                        label="E-mail"
                        tipo="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (erro) setErro('');
                        }}
                        placeholder="admin@exemplo.com"
                        autoComplete="email"
                        icone={<IconeEmail />}
                    />

                    <div className="form-group">
                        <div className="senha-row">
                            <label htmlFor="admin-login-senha" style={{ marginBottom: 0 }}>
                                Senha
                            </label>
                        </div>

                        <CampoTexto
                            id="admin-login-senha"
                            tipo="password"
                            value={senha}
                            onChange={(e) => {
                                setSenha(e.target.value);
                                if (erro) setErro('');
                            }}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            visivel={senhaVisivel}
                            onToggleVisivel={() => setSenhaVisivel(!senhaVisivel)}
                            icone={<IconeCadeado />}
                        />
                    </div>

                    <button type="submit" disabled={carregando} className="btn-submit">
                        {carregando ? (
                            <>
                                <span className="spinner" aria-hidden="true" />
                                Verificando...
                            </>
                        ) : (
                            <>
                                Entrar no Painel
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
            </div>
        </div>
    );
}