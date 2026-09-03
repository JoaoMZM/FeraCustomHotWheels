import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import clienteRepository from '../repositories/cliente.repository.js';
import { transporter } from '../utils/mailer.js';

export const senhaController = {
    solicitarRecuperacao: async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ message: "Você não informou o e-mail." });

            const usuarioResult = await clienteRepository.buscarPorEmail(email);
            const usuario = Array.isArray(usuarioResult) ? usuarioResult[0] : usuarioResult;

            if (!usuario) {
                return res.status(200).json({ message: "Se o e-mail estiver cadastrado, um link de recuperação foi enviado." });
            }

            const secretUnico = process.env.TOKEN_SECRET + usuario.senha;

            const token = jwt.sign(
                { id_cliente: usuario.id_cliente },
                secretUnico,
                { expiresIn: '15m' }
            );

            const porta = process.env.SERVER_PORT || 443;
            const linkBackend = `https://localhost:${porta}/senha/validar-token-recuperacao?id_cliente=${usuario.id_cliente}&token=${token}`;

            const mailOptions = {
                from: `"Fera Custom Hot Wheels" <${process.env.EMAIL_USER}>`,
                to: usuario.email,
                subject: 'Fera Custom - Recuperação de Senha',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #e60000;">Olá, ${usuario.nome || 'Cliente'}!</h2>
                            <p>Você solicitou a alteração da sua senha na Fera Custom Hot Wheels.</p>
                            <p>Para cadastrar uma nova senha e recuperar seu acesso, clique no botão vermelho abaixo (este link é válido por 15 minutos):</p>
                    <div style="text-align: center; margin: 30px 0;">
                            <a href="${linkBackend}" style="background: #e60000; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
                    </div>
                            <p style="font-size: 12px; color: #666;">Se o botão não funcionar, copie e cole este link no seu navegador:<br>${linkBackend}</p>
                            <p style="font-size: 12px; color: #666;">Se não foi você quem solicitou a redefinição, apenas ignore este e-mail.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "Se o e-mail estiver cadastrado, um link de recuperação foi enviado." });

        } catch (error) {
            console.error("Erro ao solicitar recuperação:", error);
            return res.status(500).json({ message: 'Erro ao processar solicitação.' });
        }
    },

    validarLink: async (req, res) => {
        const linkFrontend = 'http://localhost:5173';

        try {
            const { id_cliente, token } = req.query;

            if (!id_cliente || !token) {
                return res.redirect(`${linkFrontend}/login?erro=link_invalido`);
            }

            const usuarioResult = await clienteRepository.selecionarPorId(id_cliente);
            const usuario = Array.isArray(usuarioResult) ? usuarioResult[0] : usuarioResult;

            if (!usuario) {
                return res.redirect(`${linkFrontend}/login?erro=usuario_nao_encontrado`);
            }

            const tokenUnico = process.env.TOKEN_SECRET + usuario.senha;

            jwt.verify(token, tokenUnico);

            return res.redirect(`${linkFrontend}/redefinir-senha?id_cliente=${id_cliente}&token=${token}`);

        } catch (error) {
            console.error("Erro na validação do token:", error);
            return res.redirect(`${linkFrontend}/login?erro=token_expirado_ou_invalido`);
        }
    },

    redefinirSenha: async (req, res) => {
        try {
            const { id_cliente, idCliente, token, novaSenha } = req.body;
            const id = id_cliente || idCliente;

            if (!id || !token || !novaSenha) {
                return res.status(400).json({ message: "Dados incompletos." });
            }

            const usuarioResult = await clienteRepository.selecionarPorId(id);
            const usuario = Array.isArray(usuarioResult) ? usuarioResult[0] : usuarioResult;

            if (!usuario) return res.status(404).json({ message: "Usuário não encontrado." });

            const tokenUnico = process.env.TOKEN_SECRET + usuario.senha;

            try {
                jwt.verify(token, tokenUnico);
            } catch (error) {
                return res.status(403).json({ message: "Token inválido ou expirado." });
            }

            const saltRounds = 10;
            const novaSenhaHash = await bcrypt.hash(novaSenha, saltRounds);

            const result = await clienteRepository.atualizarSenha(id, novaSenhaHash);

            return res.status(200).json({ message: "Senha atualizada com sucesso!", result });

        } catch (error) {
            console.error("Erro ao redefinir senha:", error);
            return res.status(500).json({ message: 'Erro ao atualizar senha.' });
        }
    }
};