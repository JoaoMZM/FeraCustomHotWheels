const API_URL = 'https://localhost:443';

// ── CADASTRO DE USUÁRIO ─────────────────────────────────────────────────────
export const cadastrarUsuario = async (dadosUsuario) => {
    try {
        const response = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosUsuario)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao cadastrar usuário.');
        }

        return data;
    } catch (error) {
        console.error('Erro no serviço de cadastro:', error);
        throw error;
    }
};

// ── LOGIN DE USUÁRIO ────────────────────────────────────────────────────────
export const loginUsuario = async (email, senha) => {
    try {
        const response = await fetch(`${API_URL}/clientes/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authMethod: email,
                senha
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao realizar login.');
        }

        return data;
    } catch (error) {
        console.error('Erro no serviço de login:', error);
        throw error;
    }
};

// ── LOGOUT DE USUÁRIO ───────────────────────────────────────────────────────
export const logoutUsuario = async () => {
    try {
        const response = await fetch(`${API_URL}/clientes/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao realizar logout.');
        }

        return data;
    } catch (error) {
        console.error('Erro no serviço de logout:', error);
        throw error;
    }
};

export const confirmarContaUsuario = async (token) => {
    try {
        const response = await fetch(`http://localhost:443/clientes/confirmar?token=${token}`, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao confirmar conta.');
        }

        return data;
    } catch (error) {
        console.error('Erro no serviço de confirmação:', error);
        throw error;
    }
};