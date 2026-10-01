import jwt from 'jsonwebtoken';
import e from 'express';
import 'dotenv/config';

function validarToken(req, res, next) {
    const token = req.cookies.token;
    console.log(token);
    if (!token) return res.status(400).json({ message: "Faça login" });

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.id_cliente = decoded.id_cliente;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Token inválido" })
    }
}

function validarTokenAdmin(req, res, next) {
    const token = req.cookies.admin_token;
    if (!token) return res.status(400).json({ message: "Faça login como administrador" });

    try {
        const decoded = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: "Acesso restrito ao administrador" });
        }

        req.id_cliente = decoded.id_cliente;
        req.role = decoded.role;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Token inválido" })
    }
}

export default validarToken;
export { validarTokenAdmin };