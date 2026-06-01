import React, { useState } from 'react';
import { cadastrarUsuario } from '../../services/api.js';

export default function CadastroPage({ onNavigateToLogin }) {
    const [formData, setFormData] = useState({ nome: '', cpf: '', telefone: '', email: '', senha: '', confirmarSenha: '' });
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
    const [camposComErro, setCamposComErro] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (erro) setErro('');
        if (mensagem) setMensagem('');
        if (camposComErro[name]) {
            setCamposComErro({ ...camposComErro, [name]: false });
        }
    };

    const validar = () => {
        const novosErros = {};

        if (!formData.nome.trim()) novosErros.nome = true;
        if (!formData.email.trim()) novosErros.email = true;
        if (!formData.cpf.trim()) novosErros.cpf = true;
        if (!formData.telefone.trim()) novosErros.telefone = true;
        if (!formData.senha) novosErros.senha = true;
        if (!formData.confirmarSenha) novosErros.confirmarSenha = true;

        if (Object.keys(novosErros).length > 0) {
            setCamposComErro(novosErros);
            setErro('Por favor, preencha todos os campos.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setCamposComErro({ email: true });
            setErro('Digite um e-mail válido.');
            return false;
        }

        if (formData.senha.length < 6) {
            setCamposComErro({ senha: true });
            setErro('A senha deve ter pelo menos 6 caracteres.');
            return false;
        }

        if (formData.senha !== formData.confirmarSenha) {
            setCamposComErro({ senha: true, confirmarSenha: true });
            setErro('As senhas não coincidem.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setMensagem('');
        setCamposComErro({});

        if (!validar()) return;

        setCarregando(true);
        try {
            const dadosParaEnviar = {
                nome: formData.nome.trim(),
                email: formData.email.trim(),
                cpf: formData.cpf.trim(),
                telefone: formData.telefone.trim(),
                senha: formData.senha
            };
            
            // 1. Guardamos a resposta do backend aqui
            const resposta = await cadastrarUsuario(dadosParaEnviar);
            
            // 2. Usamos a mensagem exata que veio do servidor ("Verifique seu e-mail...")
            setMensagem(resposta.message || 'Cadastro realizado com sucesso! Verifique seu e-mail.');
            
            // Limpa o formulário
            setFormData({ nome: '', email: '', cpf: '', telefone: '', senha: '', confirmarSenha: '' });
        } catch (err) {
            setErro(err.message || 'Falha ao conectar com o servidor.');
        } finally {
            setCarregando(false);
        }
    };

    // ── Ícones SVG ──────────────────────────────────────────────────────────────

    const IconeUsuario = () => (
        <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );

    const IconeEmail = () => (
        <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );

    const IconeCpf = () => (
        <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
            <line x1="7" y1="8" x2="11" y2="8" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="7" y1="16" x2="17" y2="16" />
        </svg>
    );

    const IconeTelefone = () => (
        <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );

    const IconeCadeado = ({ small } = {}) => {
        const size = small ? '16' : '28';
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={small ? 'currentColor' : '#CC0000'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={small ? 'input-icon' : ''}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        );
    };

    const IconeOlhoAberto = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );

    const IconeOlhoFechado = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );

    const IconeErro = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );

    const IconeSucesso = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );

    // ── Campo reutilizável ──────────────────────────────────────────────────────

    const CampoTexto = ({ id, label, tipo = 'text', name, placeholder, autoComplete, visivel, onToggleVisivel, icone }) => {
        const temToggle = tipo === 'password' || visivel !== undefined;
        
        return (
            <div className="form-group">
                <label htmlFor={id}>{label}</label>
                <div className="input-wrap">
                    {icone}
                    <input
                        id={id}
                        type={temToggle ? (visivel ? 'text' : 'password') : tipo}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        className={`input-com-icone ${temToggle ? 'input-com-toggle' : ''} ${camposComErro[name] ? 'input-erro' : ''}`.trim()}
                    />
                    {temToggle && (
                        <button
                            type="button"
                            className="btn-toggle-senha"
                            onClick={onToggleVisivel}
                            aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                            {visivel ? <IconeOlhoFechado /> : <IconeOlhoAberto />}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // ── Render ──────────────────────────────────────────────────────────────────

    return (
        <div className="cadastro-container">
            {/* Ícone de topo */}
            <div className="brand-logo">
                <img
                    src="../../../vite-project/public/FeraCustomLogo.jpg"
                    alt="Fera Custom Hot Wheels"
                    className="logo-img"
                />
                <span className="brand-logo-text">Fera Custom Hot Wheels</span>
            </div>

            <div className="card-header">
                <h2>Crie Sua Conta</h2>
                <p className="cadastro-subtitle">Faça login para continuar</p>
            </div>

            <div className="cadastro-divider" />

            {/* Mensagem de sucesso */}
            {mensagem && (
                <p className="login-sucesso" role="status">
                    <IconeSucesso />
                    {mensagem}
                </p>
            )}

            {/* Mensagem de erro */}
            {erro && (
                <p className="login-erro" role="alert">
                    <IconeErro />
                    {erro}
                </p>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <CampoTexto
                    id="cadastro-nome"
                    label="Nome completo"
                    name="nome"
                    tipo="text"
                    placeholder="Digite seu nome completo"
                    autoComplete="name"
                    icone={<IconeUsuario />}
                />

                <CampoTexto
                    id="cadastro-email"
                    label="E-mail"
                    name="email"
                    tipo="email"
                    placeholder="seuemail@exemplo.com"
                    autoComplete="email"
                    icone={<IconeEmail />}
                />

                <CampoTexto
                    id="cpf"
                    label="CPF"
                    name="cpf"
                    tipo="text"
                    placeholder="Digite seu CPF correto"
                    autoComplete="cpf"
                    icone={<IconeCpf />}
                />

                <CampoTexto
                    id="telefone"
                    label="Telefone"
                    name="telefone"
                    tipo="tel"
                    placeholder="Digite seu telefone corretamente"
                    autoComplete="tel"
                    icone={<IconeTelefone />}
                />

                <CampoTexto
                    id="cadastro-senha"
                    label="Senha"
                    name="senha"
                    tipo="password"
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    visivel={senhaVisivel}
                    onToggleVisivel={() => setSenhaVisivel(!senhaVisivel)}
                    icone={<IconeCadeado small />}
                />

                <CampoTexto
                    id="cadastro-confirmar-senha"
                    label="Confirmar senha"
                    name="confirmarSenha"
                    tipo="password"
                    placeholder="Repita sua senha"
                    autoComplete="new-password"
                    visivel={confirmarSenhaVisivel}
                    onToggleVisivel={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}
                    icone={<IconeCadeado small />}
                />

                <button type="submit" disabled={carregando} className="btn-submit">
                    {carregando ? (
                        <>
                            <span className="spinner" aria-hidden="true"></span>
                            Criando conta...
                        </>
                    ) : (
                        <>
                            Criar Conta
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </>
                    )}
                </button>
            </form>

            {/* Rodapé */}
            <div className="cadastro-footer">
                Já tem uma conta?{' '}
                {onNavigateToLogin ? (
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }}>Entrar</a>
                ) : (
                    <a href="/login">Entrar</a>
                )}
            </div>
        </div>
    );
}