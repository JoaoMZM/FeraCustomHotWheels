import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import clienteRepository from "../repositories/cliente.repository.js";

const adminController = {
    loginAdmin: async (req, res) => {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ message: "Informe todos os campos" });
            }

            const usuarioResult = await clienteRepository.buscarPorEmail(email);
            const usuario = usuarioResult && usuarioResult[0];

            if (!usuario || !usuario.is_admin) {
                return res.status(401).json({ message: "Credenciais inválidas" });
            }

            const validPassword = await bcrypt.compare(senha, usuario.senha);
            if (!validPassword) {
                return res.status(401).json({ message: "Credenciais inválidas" });
            }

            const cookieOptions = {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            };

            const token = jwt.sign(
                { id_cliente: usuario.id_cliente, role: 'admin' },
                process.env.ADMIN_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            res.cookie('admin_token', token, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

            const payload = {
                sub: usuario.id_cliente,
                name: usuario.nome_cliente,
                email: usuario.email,
                role: 'admin'
            };

            return res.status(200).json({
                message: "Login de administrador realizado com sucesso!",
                payload
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    },

    logoutAdmin: async (req, res) => {
        try {
            const cookieOptions = {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            };

            res.clearCookie('admin_token', cookieOptions);
            return res.status(200).json({ message: "Logout realizado com sucesso!" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao tentar fazer logout." });
        }
    },

    testeLoginAdmin: async (req, res) => {
        return res.status(200).json({ message: "Token de admin válido", role: req.role });
    }
};

export default adminController;