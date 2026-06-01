import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import clienteRepository from '../repositories/cliente.repository.js';
import { transporter } from '../configs/mail.js';

export const senhaController = {
    solicitarRecuperacao: async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ message: "Você não informou email" });

            const usuario = await clienteRepository.buscarPorEmail(email);
            
            if (!usuario) {
                return res.status(400).json({ message: "Este usuário não existe" });
            }

            const secretUnico = process.env.TOKEN_SECRET + usuario.senha;

            const token = jwt.sign(
                { id_cliente: usuario.id_cliente }, 
                secretUnico, 
                { expiresIn: '15m' }
            );

            const linkBackend = `https://localhost:443/senha/validar-token-recuperacao?id_cliente=${usuario.id_liente}&token=${token}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: usuario.email,
                subject: 'Fera Custom - Recuperação de Senha',
                html: `
                    <h2>Você solicitou a alteração de sua senha</h2>
                    <p>Clique no link abaixo para cadastrar uma nova senha. Este link é válido por 15 minutos.</p>
                    <a href="${linkBackend}" target="_blank" style="background:#ff5500; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px; display:inline-block;">Redefinir Senha</a>
                    <p>Se não foi você quem solicitou, ignore este e-mail.</p>
                `
            };

            const result = await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "Link de recuperação foi enviado.", result });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao processar solicitação.' });
        }
    },

    validarLink: async (req, res) => {
        try {
            const { id_cliente, token } = req.query; 
            const link = 'https://localhost:443';

            if (!id_cliente || !token) {
                return res.redirect(`${link}/login?erro=link_invalido`);
            }

            const usuario = await clienteRepository.selecionarPorId(id_cliente);
            if (!usuario) {
                return res.redirect(`${link}/login?erro=usuario_nao_encontrado`);
            }

            const tokenUnico = process.env.TOKEN_SECRET + usuario.senha;

            jwt.verify(token, tokenUnico);

            return res.redirect(`${link}/senha/redefinir-senha?id_cliente=${id_cliente}&token=${token}`);

        } catch (error) {
            const link = 'https://localhost:443';
            return res.status(400).json({message: "Token expirado"});
        }
    },

    redefinirSenha: async (req, res) => {
        try {
            const { idCliente, token, novaSenha } = req.body;

            if (!idCliente || !token || !novaSenha) {
                return res.status(400).json({ message: "Dados incompletos." });
            }

            const usuario = await clienteRepository.selecionarPorId(idCliente);
            if (!usuario) return res.status(404).json({ message: "Usuário não encontrado." });

            const tokenUnico = process.env.TOKEN_SECRET + usuario.senha;

            try {
                jwt.verify(token, tokenUnico);
            } catch (error) {
                return res.status(403).json({ message: "Token inválido ou expirado." });
            }

            const saltRounds = 10;
            const novaSenhaHash = await bcrypt.hash(novaSenha, saltRounds);

            const result = await clienteRepository.atualizarSenha(idCliente, novaSenhaHash);

            return res.status(200).json({ message: "Senha atualizada com sucesso!", result });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao atualizar senha.' });
        }
    }
};