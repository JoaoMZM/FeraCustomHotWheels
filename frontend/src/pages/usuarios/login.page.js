import React, { useState } from 'react';


export default function LoginPage({ onNavigateToCadastro, onNavigateToRecuperarSenha }) {
    const [formData, setFormData] = useState({ email: '', senha: '' });
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [senhaVisivel, setSenhaVisivel] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (erro) setErro('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        if (!formData.email || !formData.senha) {
            setErro('Por favor, preencha todos os campos.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErro('Digite um e-mail válido.');
            return;
        }
        setCarregando(true);
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.mensagem || 'E-mail ou senha incorretos.');
            }
            const dados = await response.json();
            if (dados.token) localStorage.setItem('fera_token', dados.token);
            window.location.href = '/';
        } catch (err) {
            setErro(err.message || 'Falha ao conectar com o servidor.');
        } finally {
            setCarregando(false);
        }
    };

    return React.createElement('div', { className: 'cadastro-container' },

        // Brand
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

        // Card badge
        React.createElement('div', { className: 'card-header' },
            React.createElement('h2', null, 'Bem-vindo de Volta'),
            React.createElement('p', { classNme: 'cadastro-subtitle' }, 'Crie a conta para continuar')
        ),

        React.createElement('div', { className: 'cadastro-divider' }),

        // Error alert
        erro && React.createElement('div', { className: 'alert alert-error', role: 'alert' },
            React.createElement('svg', { width: '15', height: '15', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', style: { flexShrink: 0 } },
                React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
                React.createElement('line', { x1: '12', y1: '8', x2: '12', y2: '12' }),
                React.createElement('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })
            ),
            erro
        ),

        // Form
        React.createElement('form', { onSubmit: handleSubmit, noValidate: true },

            // Email
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', { htmlFor: 'login-email' }, 'E-mail'),
                React.createElement('div', { className: 'input-wrap' },
                    React.createElement('svg', { className: 'input-icon', width: '15', height: '15', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
                        React.createElement('path', { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' }),
                        React.createElement('polyline', { points: '22,6 12,13 2,6' })
                    ),
                    React.createElement('input', {
                        id: 'login-email', type: 'email', name: 'email',
                        value: formData.email, onChange: handleChange,
                        placeholder: 'seuemail@exemplo.com', autoComplete: 'email',
                        className: `input-com-icone${erro && !formData.email ? ' input-erro' : ''}`,
                    })
                )
            ),

            // Senha
            React.createElement('div', { className: 'form-group' },
                React.createElement('div', { className: 'senha-row' },
                    React.createElement('label', { htmlFor: 'login-senha', style: { marginBottom: 0 } }, 'Senha'),
                    React.createElement('button', { type: 'button', className: 'link-esqueceu', onClick: onNavigateToRecuperarSenha}, 'Esqueceu a senha?')
                ),
                React.createElement('div', { className: 'input-wrap' },
                    React.createElement('svg', { className: 'input-icon', width: '15', height: '15', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
                        React.createElement('rect', { x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' }),
                        React.createElement('path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' })
                    ),
                    React.createElement('input', {
                        id: 'login-senha', type: senhaVisivel ? 'text' : 'password',
                        name: 'senha', value: formData.senha, onChange: handleChange,
                        placeholder: '••••••••', autoComplete: 'current-password',
                        className: 'input-com-icone input-com-toggle',
                    }),
                    React.createElement('button', {
                        type: 'button', className: 'btn-toggle-senha',
                        onClick: () => setSenhaVisivel(!senhaVisivel),
                        'aria-label': senhaVisivel ? 'Ocultar senha' : 'Mostrar senha',
                    },
                        senhaVisivel
                            ? React.createElement('svg', { width: '15', height: '15', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
                                React.createElement('path', { d: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94' }),
                                React.createElement('path', { d: 'M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19' }),
                                React.createElement('line', { x1: '1', y1: '1', x2: '23', y2: '23' })
                            )
                            : React.createElement('svg', { width: '15', height: '15', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
                                React.createElement('path', { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' }),
                                React.createElement('circle', { cx: '12', cy: '12', r: '3' })
                            )
                    )
                )
            ),

            // Submit
            React.createElement('button', { type: 'submit', disabled: carregando, className: 'btn-submit' },
                carregando
                    ? React.createElement(React.Fragment, null,
                        React.createElement('span', { className: 'spinner', 'aria-hidden': 'true' }),
                        'Verificando...'
                    )
                    : React.createElement(React.Fragment, null,
                        'Entrar na Conta',
                        React.createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' },
                            React.createElement('line', { x1: '5', y1: '12', x2: '19', y2: '12' }),
                            React.createElement('polyline', { points: '12 5 19 12 12 19' })
                        )
                    )
            )
        ),

        // Footer
        React.createElement('div', { className: 'cadastro-footer' },
            'Não tem conta?  ',
            React.createElement('a', { href: '#', onClick: (e) => { e.preventDefault(); onNavigateToCadastro(); } }, 'Criar conta gratuita')
        )
    );
}