import React, { useState } from 'react';
import { cadastrarUsuario } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import CampoTexto from '../../components/common/CampoTexto.jsx';
import { IconeUsuario, IconeCpf, IconeEmail, IconeTelefone, IconeCadeado } from '../../components/icons/Icones.jsx';

export default function CadastroPage({ onNavigateToLogin, onVoltarLogin }) {
    const irParaLogin = onNavigateToLogin || onVoltarLogin;
    const [formData, setFormData] = useState({ nome: '', cpf: '', email: '', telefone: '', senha: '', confirmarSenha: '' });
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
    const [camposComErro, setCamposComErro] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (erro) setErro('');
        if (mensagem) setMensagem('');
        if (camposComErro[name]) setCamposComErro((prev) => ({ ...prev, [name]: false }));
    };

    const validar = () => {
        const novosErros = {};
        Object.keys(formData).forEach((key) => { if (!formData[key].trim()) novosErros[key] = true; });

        if (Object.keys(novosErros).length > 0) {
            setCamposComErro(novosErros);
            setErro('Por favor, preencha todos os campos obrigatórios.');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
        setErro(''); setMensagem(''); setCamposComErro({});
        if (!validar()) return;

        setCarregando(true);
        try {
            await cadastrarUsuario(formData);
            setMensagem('Cadastro realizado com sucesso! Verifique seu e-mail.');
            setFormData({ nome: '', cpf: '', email: '', telefone: '', senha: '', confirmarSenha: '' });
        } catch (err) {
            setErro(err.message || 'Falha ao conectar com o servidor.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="cadastro-container">
            <div className="brand-logo">
                <img src="/FeraCustomLogo.jpg" alt="Logo" className="logo-img" />
                <span className="brand-logo-text">Fera Custom Hot Wheels</span>
            </div>

            <div className="card-header">
                <h2>Crie Sua Conta</h2>
                <p className="cadastro-subtitle">FAÇA LOGIN PARA CONTINUAR</p>
            </div>

            <div className="cadastro-divider" />

            <Alert tipo="success" mensagem={mensagem} />
            <Alert tipo="error" mensagem={erro} />

            <form onSubmit={handleSubmit} noValidate>
                <CampoTexto id="cadastro-nome" label="Nome completo" name="nome" value={formData.nome} onChange={handleChange} hasError={camposComErro.nome} placeholder="Digite seu nome completo" icone={<IconeUsuario />} />
                <CampoTexto id="cadastro-cpf" label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} hasError={camposComErro.cpf} placeholder="000.000.000-00" icone={<IconeCpf />} />
                <CampoTexto id="cadastro-email" label="E-mail" name="email" tipo="email" value={formData.email} onChange={handleChange} hasError={camposComErro.email} placeholder="seuemail@exemplo.com" icone={<IconeEmail />} />
                <CampoTexto id="cadastro-telefone" label="Telefone / WhatsApp" name="telefone" tipo="tel" value={formData.telefone} onChange={handleChange} hasError={camposComErro.telefone} placeholder="(00) 00000-0000" icone={<IconeTelefone />} />
                <CampoTexto id="cadastro-senha" label="Senha" name="senha" tipo="password" value={formData.senha} onChange={handleChange} hasError={camposComErro.senha} placeholder="Mínimo 6 caracteres" visivel={senhaVisivel} onToggleVisivel={() => setSenhaVisivel(!senhaVisivel)} icone={<IconeCadeado />} />
                <CampoTexto id="cadastro-confirmar-senha" label="Confirmar senha" name="confirmarSenha" tipo="password" value={formData.confirmarSenha} onChange={handleChange} hasError={camposComErro.confirmarSenha} placeholder="Repita sua senha" visivel={confirmarSenhaVisivel} onToggleVisivel={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)} icone={<IconeCadeado />} />

                <button type="submit" disabled={carregando} className="btn-submit">
                    {carregando ? 'Criando conta...' : 'Criar Conta'}
                </button>
            </form>

            <div className="cadastro-footer">
                Já tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); irParaLogin?.(); }}>Entrar</a>
            </div>
        </div>
    );
}