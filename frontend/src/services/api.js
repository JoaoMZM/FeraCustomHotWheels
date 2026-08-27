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
            // Tenta ler como JSON; se o servidor retornar HTML (ex: Erro 500), usa texto padrão
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
