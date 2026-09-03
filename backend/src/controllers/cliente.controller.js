import { Cliente } from "../models/Cliente.js";
import { validarCPF } from "../utils/validarCpf.js";
import clienteRepository from "../repositories/cliente.repository.js";
import { validarEmail } from "../utils/validarEmail.js";
import { validarTelefone } from "../utils/validarNumero.js";
import { limparNumero } from "../utils/limparNumero.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { transporter } from "../utils/mailer.js";

const clienteController = {

    buscarTodosClientes: async (req, res) => {
        try {
            const resultado = await clienteRepository.selecionar();

            if (!resultado || resultado.length === 0) {
                return res.status(200).json({ message: 'A tabela não contém dados', data: [] });
            }

            return res.status(200).json({ message: 'Dados recebidos', data: resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    },

    buscarClientePorID: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultado = await clienteRepository.selecionarPorId(id);

            if (!resultado) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            return res.status(200).json(resultado);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar cliente', errorMessage: error.message });
        }
    },

    incluirCliente: async (req, res) => {
        try {
            const { nome, cpf, email, senha, telefone } = req.body;

            if (!nome || !cpf || !email || !senha || !telefone) {
                return res.status(400).json({ sucesso: false, message: "Campos obrigatórios não informados" });
            }

            const cpfLimpo = limparNumero(cpf);
            const telefoneLimpo = limparNumero(telefone);

            if (!validarCPF(cpf)) {
                return res.status(400).json({ sucesso: false, message: "CPF inválido" });
            }

            const clienteExistente = await clienteRepository.buscarPorCpf(cpfLimpo);
            if (clienteExistente && clienteExistente.length > 0) {
                return res.status(400).json({ sucesso: false, message: "CPF já cadastrado" });
            }

            if (!validarEmail(email)) {
                return res.status(400).json({ sucesso: false, message: "E-mail inválido" });
            }

            const clienteExistente2 = await clienteRepository.buscarPorEmail(email);
            if (clienteExistente2 && clienteExistente2.length > 0) {
                return res.status(400).json({ sucesso: false, message: "E-mail já cadastrado" });
            }

            if (!validarTelefone(telefone)) {
                return res.status(400).json({ sucesso: false, message: "Telefone inválido" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(senha, salt);

            const tokenConfirmacao = crypto.randomBytes(20).toString('hex');

            const resultado = await clienteRepository.criar({
                nome,
                cpf: cpfLimpo,
                email,
                senha: hashedPassword,
                telefone: telefoneLimpo,
                confirmado: 0,
                token_confirmacao: tokenConfirmacao
            });

            try {
                const linkConfirmacao = `https://localhost:443/clientes/confirmar?token=${tokenConfirmacao}`;

                await transporter.sendMail({
                    from: `"Fera Custom Hot Wheels" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: "Confirme sua conta - Fera Custom Hot Wheels",
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                            <h2 style="color: #e60000;">Olá, ${nome}!</h2>
                            <p>Obrigado por se cadastrar na Fera Custom Hot Wheels.</p>
                            <p>Para ativar sua conta e liberar seu acesso ao sistema, clique no botão vermelho abaixo:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${linkConfirmacao}" style="background: #e60000; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Confirmar Minha Conta</a>
                            </div>
                            <p style="font-size: 12px; color: #666;">Se o botão não funcionar, copie e cole este link no seu navegador:<br>${linkConfirmacao}</p>
                        </div>
                    `
                });
            } catch (mailError) {
                console.error("⚠️ Alerta: Falha ao enviar e-mail de confirmação:", mailError.message);
            }

            return res.status(201).json({
                sucesso: true,
                message: "Cliente criado com sucesso! Verifique seu e-mail para confirmar a conta.",
                result: resultado
            });

        } catch (error) {
            console.error("Erro na criação do cliente:", error);
            return res.status(500).json({ sucesso: false, message: "Erro no servidor", errorMessage: error.message });
        }
    },

    atualizarCliente: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (!id) {
                return res.status(400).json({ message: "ID é obrigatório" });
            }

            const { nome, cpf, email, senha, telefone } = req.body;
            const cpfLimpo = limparNumero(cpf);
            const telefoneLimpo = limparNumero(telefone);
            const clienteAtual = await clienteRepository.selecionarPorId(id);

            if (!clienteAtual) {
                return res.status(404).json({ message: "Cliente não encontrado" });
            }

            let senhaFinal = clienteAtual.senha;
            if (senha && senha.trim() !== "") {
                const salt = await bcrypt.genSalt(10);
                senhaFinal = await bcrypt.hash(senha, salt);
            }

            const clienteEditado = Cliente.editar(
                { nome, cpf: cpfLimpo, email, senha: senhaFinal, telefone: telefoneLimpo },
                clienteAtual
            );
            const resultado = await clienteRepository.editar(clienteEditado);

            return res.status(200).json({ message: "Cliente atualizado com sucesso", result: resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro no servidor", errorMessage: error.message });
        }
    },

    excluirCliente: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const cliente = await clienteRepository.selecionarPorId(id);

            if (!cliente) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            const exclusao = await clienteRepository.deletar(id);
            return res.status(200).json({ message: 'Cliente excluído com sucesso', detalhes: exclusao });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    },

    loginCliente: async (req, res) => {
        try {
            const { authMethod, email, senha } = req.body;
            const identificador = authMethod || email;

            const cookieOptions = {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            };

            if (!identificador || !senha) {
                return res.status(400).json({ message: "Informe todos os campos" });
            }

            const usuarioResult = await clienteRepository.buscarPorEmail(identificador);
            const usuario = usuarioResult && usuarioResult[0];

            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            if (!usuario.confirmado || usuario.confirmado === 0) {
                return res.status(401).json({ message: "Sua conta ainda não foi ativada. Verifique seu e-mail de confirmação." });
            }

            const validPassword = await bcrypt.compare(senha, usuario.senha);
            if (!validPassword) return res.status(400).json({ message: "Senha inválida" });

            res.clearCookie('token', cookieOptions);

            const token = jwt.sign({ id_cliente: usuario.id_cliente }, process.env.TOKEN_SECRET, { expiresIn: '8h' });

            res.cookie('token', token, { ...cookieOptions, maxAge: 8 * 3600000 });

            return res.status(200).json({
                message: "Login realizado com sucesso!",
                token
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    },

    logoutCliente: async (req, res) => {
        try {
            const cookieOptions = {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            };

            res.clearCookie('token', cookieOptions);
            return res.status(200).json({ message: "Logout realizado com sucesso!" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao tentar fazer logout." });
        }
    },

    testeLogin: async (req, res) => {
        try {
            return res.status(200).json({ message: "Você está logado com token" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    },

    confirmarConta: async (req, res) => {
        try {
            const { token } = req.query;

            if (!token) {
                return res.redirect('http://localhost:5173/?erro=token-ausente');
            }

            const usuarioResult = await clienteRepository.buscarPorTokenConfirmacao(token);

            const usuario = usuarioResult && usuarioResult[0];

            if (!usuario) {
                return res.redirect('http://localhost:5173/?erro=token-invalido');
            }

            await clienteRepository.atualizarStatusConfirmado(usuario.id_cliente);

            return res.redirect('http://localhost:5173/?confirmado=true');

        } catch (error) {
            console.error("Erro na confirmação:", error);
            return res.redirect('http://localhost:5173/?erro=servidor');
        }
    }
};

export default clienteController;