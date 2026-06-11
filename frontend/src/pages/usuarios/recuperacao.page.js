import React, { useState } from 'react';

export default function RecuperarSenhaPage({ onVoltarLogin }) {

    const [email, setEmail] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErro('');
        setSucesso('');

        if (!email) {
            setErro('Digite seu e-mail.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setErro('Digite um e-mail válido.');
            return;
        }

        setCarregando(true);

        try {

            // BACK-END
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSucesso('Enviamos um link de recuperação para seu e-mail.');

        } catch (error) {
            setErro('Erro ao enviar recuperação.');
        } finally {
            setCarregando(false);
        }
    };

    return React.createElement('div', { className: 'cadastro-container' },

        // Logo
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

        // Header
        React.createElement('div', { className: 'card-header' },

            React.createElement('h2', null, 'Recuperar Senha'),

            React.createElement('p', {
                className: 'cadastro-subtitle'
            }, 'Digite seu e-mail para recuperar o acesso')
        ),

        React.createElement('div', {
            className: 'cadastro-divider'
        }),

        // Alertas
        erro && React.createElement('div', {
            className: 'alert alert-error'
        }, erro),

        sucesso && React.createElement('div', {
            className: 'alert alert-success'
        }, sucesso),

        // Form
        React.createElement('form', {
            onSubmit: handleSubmit
        },

            React.createElement('div', {
                className: 'form-group'
            },

                React.createElement('label', {
                    htmlFor: 'email'
                }, 'E-mail'),

                React.createElement('div', {
                    className: 'input-wrap'
                },

                    React.createElement('svg', {
                        className: 'input-icon',
                        width: '15',
                        height: '15',
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        strokeWidth: '1.8',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round'
                    },
                        React.createElement('path', {
                            d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'
                        }),

                        React.createElement('polyline', {
                            points: '22,6 12,13 2,6'
                        })
                    ),

                    React.createElement('input', {
                        type: 'email',
                        id: 'email',
                        placeholder: 'seuemail@exemplo.com',
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        className: 'input-com-icone'
                    })
                )
            ),

            // Botão
            React.createElement('button', {
                type: 'submit',
                disabled: carregando,
                className: 'btn-submit'
            },

                carregando
                    ? React.createElement(
                        React.Fragment,
                        null,

                        React.createElement('span', {
                            className: 'spinner',
                            'aria-hidden': 'true'
                        }),

                        'Enviando...'
                    )

                    : React.createElement(
                        React.Fragment,
                        null,

                        'Enviar Recuperação',

                        React.createElement('svg', {
                            width: '16',
                            height: '16',
                            viewBox: '0 0 24 24',
                            fill: 'none',
                            stroke: 'currentColor',
                            strokeWidth: '2.5',
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round'
                        },

                            React.createElement('line', {
                                x1: '5',
                                y1: '12',
                                x2: '19',
                                y2: '12'
                            }),

                            React.createElement('polyline', {
                                points: '12 5 19 12 12 19'
                            })
                        )
                    )
            )
        ),

        // Footer
        React.createElement('div', {
            className: 'cadastro-footer'
        },

            React.createElement('button', {
                type: 'button',
                className: 'btn-link',
                onClick: onVoltarLogin
            }, 'Voltar para login')
        )
    );
}