import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obterProdutoPorId, adicionarAoCarrinho } from '../../services/api.js';

export function useProdutoDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [produto, setProduto] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const [imagemAtiva, setImagemAtiva] = useState(0);
    const [quantidade, setQuantidade] = useState(1);
    const [adicionado, setAdicionado] = useState(false);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        async function carregar() {
            setCarregando(true);
            setErro('');
            try {
                const dados = await obterProdutoPorId(id);
                const item = Array.isArray(dados) ? dados[0] : (dados.produto || dados);

                if (!item) {
                    throw new Error('Produto não encontrado');
                }

                let imagens = [];
                if (Array.isArray(item.imagens) && item.imagens.length > 0) {
                    imagens = item.imagens;
                } else if (item.imagem_produto) {
                    imagens = [`https://localhost/${item.imagem_produto}`];
                } else if (item.imagem || item.imagem_url) {
                    imagens = [item.imagem || item.imagem_url];
                } else {
                    imagens = ['/placeholder.png'];
                }

                const precoNum = Number(item.preco) || 0;

                setProduto({
                    ...item,
                    nome: item.nome || item.nome_produto || 'Produto sem nome',
                    preco: precoNum,
                    imagens,
                });
            } catch (err) {
                console.error("Erro ao carregar detalhes do produto:", err);
                setErro(err.message || 'Erro ao carregar detalhes do produto.');
            } finally {
                setCarregando(false);
            }
        }

        if (id) carregar();
    }, [id]);

    const handleAdicionar = async () => {
        if (!produto || produto.estoque <= 0) return;

        const idValido = produto.id_produto || produto.id || produto._id;

        setEnviando(true);
        try {
            await adicionarAoCarrinho({
                produtoId: idValido,
                quantidade,
            });
            setAdicionado(true);
            setTimeout(() => setAdicionado(false), 2000);
        } catch (err) {
            alert(err.message || 'Erro ao adicionar ao carrinho.');
        } finally {
            setEnviando(false);
        }
    };

    return {
        produto,
        carregando,
        erro,
        imagemAtiva,
        setImagemAtiva,
        quantidade,
        setQuantidade,
        adicionado,
        enviando,
        handleAdicionar,
        navigate,
    };
}