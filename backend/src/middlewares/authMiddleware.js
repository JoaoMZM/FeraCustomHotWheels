import jwt from 'jsonwebtoken';
import e from 'express';
import 'dotenv/config';

function validarToken (req, res, next) {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({message: "Faça login"});

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.id_cliente = decoded.id_cliente;
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({message: "Token inválido"})
    }
}

export default validarToken;