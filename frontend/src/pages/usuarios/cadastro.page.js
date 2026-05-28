import React, { useState } from 'react';
import { cadastrarUsuario } from '../../services/api.js';

export default function CadastroPage({ onNavigateToLogin }) {
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });
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
                senha: formData.senha,
                tipoPerfil: 'cliente',
            };
            await cadastrarUsuario(dadosParaEnviar);
            setMensagem('Cadastro realizado com sucesso! Bem-vindo à FERA.');
            setFormData({ nome: '', email: '', senha: '', confirmarSenha: '' });
        } catch (err) {
            setErro(err.message || 'Falha ao conectar com o servidor.');
        } finally {
            setCarregando(false);
        }
    };

    // ── Ícones SVG ──────────────────────────────────────────────────────────────

    const IconeUsuario = () =>
        React.createElement(
            'svg',
            { className: 'input-icon', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' },
            React.createElement('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
            React.createElement('circle', { cx: '12', cy: '7', r: '4' })
        );

    const IconeEmail = () =>
        React.createElement(
            'svg',
            { className: 'input-icon', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' },
            React.createElement('path', { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' }),
            React.createElement('polyline', { points: '22,6 12,13 2,6' })
        );

    const IconeCadeado = ({ small } = {}) => {
        const size = small ? '16' : '28';
        return React.createElement(
            'svg',
            { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: small ? 'currentColor' : '#CC0000', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', ...(small ? { className: 'input-icon' } : {}) },
            React.createElement('rect', { x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' }),
            React.createElement('path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' })
        );
    };

    const IconeOlhoAberto = () =>
        React.createElement(
            'svg',
            { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' },
            React.createElement('path', { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' }),
            React.createElement('circle', { cx: '12', cy: '12', r: '3' })
        );

    const IconeOlhoFechado = () =>
        React.createElement(
            'svg',
            { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' },
            React.createElement('path', { d: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94' }),
            React.createElement('path', { d: 'M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19' }),
            React.createElement('line', { x1: '1', y1: '1', x2: '23', y2: '23' })
        );

    const IconeErro = () =>
        React.createElement(
            'svg',
            { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', style: { flexShrink: 0, marginTop: '1px' }, 'aria-hidden': 'true' },
            React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
            React.createElement('line', { x1: '12', y1: '8', x2: '12', y2: '12' }),
            React.createElement('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })
        );

    const IconeSucesso = () =>
        React.createElement(
            'svg',
            { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', style: { flexShrink: 0, marginTop: '1px' }, 'aria-hidden': 'true' },
            React.createElement('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
            React.createElement('polyline', { points: '22 4 12 14.01 9 11.01' })
        );

    // ── Campo reutilizável ──────────────────────────────────────────────────────

    const CampoTexto = ({ id, label, tipo = 'text', name, placeholder, autoComplete, visivel, onToggleVisivel, icone }) => {
        const temToggle = tipo === 'password' || visivel !== undefined;
        return React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement('label', { htmlFor: id }, label),
            React.createElement(
                'div',
                { className: 'input-wrap' },
                icone,
                React.createElement('input', {
                    id,
                    type: temToggle ? (visivel ? 'text' : 'password') : tipo,
                    name,
                    value: formData[name],
                    onChange: handleChange,
                    placeholder,
                    autoComplete,
                    className: [
                        'input-com-icone',
                        temToggle ? 'input-com-toggle' : '',
                        camposComErro[name] ? 'input-erro' : '',
                    ].filter(Boolean).join(' '),
                }),
                temToggle && React.createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'btn-toggle-senha',
                        onClick: onToggleVisivel,
                        'aria-label': visivel ? 'Ocultar senha' : 'Mostrar senha',
                    },
                    visivel ? React.createElement(IconeOlhoFechado) : React.createElement(IconeOlhoAberto)
                )
            )
        );
    };

    // ── Render ──────────────────────────────────────────────────────────────────

    return React.createElement(
        'div',
        { className: 'cadastro-container' },

        // Ícone de topo
        React.createElement('div', { className: 'brand-logo' },

            React.createElement('img', {
                src: '../../../vite-project/public/FeraCustomLogo.jpg',
                alt: 'Fera Custom Hot Wheels',
                className: 'logo-img'
            }),

            React.createElement('span', {
                className: 'brand-logo-text'
            }, 'Fera Custom Hot Wheels')
        ),

        React.createElement('div', { className: 'card-header' },
            React.createElement('h2', null, 'Crie Sua Conta'),
            React.createElement('p', { classNme: 'cadastro-subtitle' }, 'Faça login para continuar')
        ),

        React.createElement('div', { className: 'cadastro-divider' }),

        // Mensagem de sucesso
        mensagem
            ? React.createElement(
                'p',
                { className: 'login-sucesso', role: 'status' },
                React.createElement(IconeSucesso),
                mensagem
            )
            : null,

        // Mensagem de erro
        erro
            ? React.createElement(
                'p',
                { className: 'login-erro', role: 'alert' },
                React.createElement(IconeErro),
                erro
            )
            : null,

        React.createElement(
            'form',
            { onSubmit: handleSubmit, noValidate: true },

            React.createElement(CampoTexto, {
                id: 'cadastro-nome',
                label: 'Nome completo',
                name: 'nome',
                tipo: 'text',
                placeholder: 'Digite seu nome completo',
                autoComplete: 'name',
                icone: React.createElement(IconeUsuario),
            }),

            React.createElement(CampoTexto, {
                id: 'cadastro-email',
                label: 'E-mail',
                name: 'email',
                tipo: 'email',
                placeholder: 'seuemail@exemplo.com',
                autoComplete: 'email',
                icone: React.createElement(IconeEmail),
            }),

            React.createElement(CampoTexto, {
                id: 'cadastro-senha',
                label: 'Senha',
                name: 'senha',
                tipo: 'password',
                placeholder: 'Mínimo 6 caracteres',
                autoComplete: 'new-password',
                visivel: senhaVisivel,
                onToggleVisivel: () => setSenhaVisivel(!senhaVisivel),
                icone: React.createElement(IconeCadeado, { small: true }),
            }),

            React.createElement(CampoTexto, {
                id: 'cadastro-confirmar-senha',
                label: 'Confirmar senha',
                name: 'confirmarSenha',
                tipo: 'password',
                placeholder: 'Repita sua senha',
                autoComplete: 'new-password',
                visivel: confirmarSenhaVisivel,
                onToggleVisivel: () => setConfirmarSenhaVisivel(!confirmarSenhaVisivel),
                icone: React.createElement(IconeCadeado, { small: true }),
            }),

            React.createElement('button', { type: 'submit', disabled: carregando, className: 'btn-submit' },
                carregando
                    ? React.createElement(React.Fragment, null,
                        React.createElement('span', { className: 'spinner', 'aria-hidden': 'true' }),
                        'Criando conta...'
                    )
                    : React.createElement(React.Fragment, null, 'Criar Conta',
                        React.createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' },
                            React.createElement('line', { x1: '5', y1: '12', x2: '19', y2: '12' }),
                            React.createElement('polyline', { points: '12 5 19 12 12 19' })
                        )
                    )
            )
        ),

        // Rodapé
        React.createElement(
            'div',
            { className: 'cadastro-footer' },
            'Já tem uma conta? ',
            onNavigateToLogin
                ? React.createElement('a', { href: '#', onClick: (e) => { e.preventDefault(); onNavigateToLogin(); } }, 'Entrar')
                : React.createElement('a', { href: '/login' }, 'Entrar')
        )
    );
}
