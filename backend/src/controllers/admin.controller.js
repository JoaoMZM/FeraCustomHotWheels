const adminController = {
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