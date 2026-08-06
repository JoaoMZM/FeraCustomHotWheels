const API_URL = 'http://localhost:8080';

export const cadastrarUsuario = async (dadosUsuario) => {
    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosUsuario),
        });

        if (!response.ok) {
            const errorData = await response.json();

            throw new Error(
                errorData.mensagem || 'Erro ao cadastrar usuário.'
            );
        }

        return await response.json();

    } catch (error) {

        console.error('Erro no serviço de cadastro:', error);

        throw error;
    }
};
