const API_URL = 'https://localhost:443';

export const cadastrarUsuario = async (dadosUsuario) => {
    try {
        const response = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosUsuario),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.mensagem || errorData.message || 'Erro ao cadastrar usuário.'
            );
        }

        return await response.json();

    } catch (error) {
        console.error('Erro no serviço de cadastro:', error);
        throw error;
    }
};

export const fazerLogin = async (dadosLogin) => {
    try {
        const response = await fetch(`${API_URL}/clientes/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(dadosLogin),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.mensagem || errorData.message || 'Erro ao realizar login.'
            );
        }

        return await response.json();

    } catch (error) {
        console.error('Erro no serviço de login:', error);
        throw error;
    }
};

export const solicitarRecuperacao = async (email) => {
    try {
        const response = await fetch(`${API_URL}/senha/recuperar-senha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.mensagem || errorData.message || 'Erro ao solicitar recuperação.'
            );
        }

        return await response.json();

    } catch (error) {
        console.error('Erro no serviço de recuperação:', error);
        throw error;
    }
};

export const redefinirSenha = async ({ id_cliente, token, novaSenha }) => {
    try {
        const response = await fetch(`${API_URL}/senha/redefinir-senha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_cliente, token, novaSenha }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.mensagem || errorData.message || 'Erro ao redefinir senha.'
            );
        }

        return await response.json();

    } catch (error) {
        console.error('Erro no serviço de redefinição:', error);
        throw error;
    }
};