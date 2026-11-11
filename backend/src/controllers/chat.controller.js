import chatRepository from "../repositories/chat.repository.js";
import { produtoRepository } from "../repositories/produto.repository.js";

const TAMANHO_MAXIMO = 1000;
const LIMITE_MENSAGENS_POR_MINUTO = 20;

const lerApos = (valor) => {
    const n = Number(valor);
    return Number.isInteger(n) && n > 0 ? n : 0;
};

// Valida e normaliza o texto. Retorna { texto } ou { erro }.
const validarTexto = (bruto) => {
    if (typeof bruto !== 'string') return { erro: "Digite uma mensagem." };
    const texto = bruto.trim();
    if (!texto) return { erro: "Digite uma mensagem." };
    if (texto.length > TAMANHO_MAXIMO) return { erro: `A mensagem pode ter no máximo ${TAMANHO_MAXIMO} caracteres.` };
    return { texto };
};

const erroInterno = (res, error) => {
    console.error('[chat]', error);
    return res.status(500).json({ message: "Erro interno do servidor" });
};

const chatController = {

    // ---------------- CLIENTE ----------------

    // GET /chat/produtos/:idProduto?apos=<id>
    buscarConversaDoProduto: async (req, res) => {
        try {
            const { idProduto } = req.params;
            const conversa = await chatRepository.buscarConversa(idProduto, req.id_cliente);

            if (!conversa) {
                return res.status(200).json({ idConversa: null, mensagens: [] });
            }

            const mensagens = await chatRepository.listarMensagens(conversa.id_conversa, lerApos(req.query.apos));
            // Quem abre a conversa leu as respostas do vendedor
            await chatRepository.marcarComoLidas(conversa.id_conversa, 'vendedor');

            return res.status(200).json({ idConversa: conversa.id_conversa, mensagens });
        } catch (error) {
            return erroInterno(res, error);
        }
    },

    // POST /chat/produtos/:idProduto/mensagens
    enviarDoCliente: async (req, res) => {
        try {
            const { idProduto } = req.params;
            const { texto, erro } = validarTexto(req.body?.texto);
            if (erro) return res.status(400).json({ message: erro });

            const produto = await produtoRepository.selecionarPorId(idProduto);
            if (!produto) return res.status(404).json({ message: "Produto não encontrado." });

            if (await chatRepository.contarMensagensRecentes(req.id_cliente) >= LIMITE_MENSAGENS_POR_MINUTO) {
                return res.status(429).json({ message: "Muitas mensagens em pouco tempo. Aguarde um instante." });
            }

            const conversa = await chatRepository.obterOuCriarConversa(idProduto, req.id_cliente);
            const mensagem = await chatRepository.inserirMensagem({
                idConversa: conversa.id_conversa,
                remetente: 'cliente',
                idAutor: req.id_cliente,
                texto,
            });

            return res.status(201).json({ idConversa: conversa.id_conversa, mensagem });
        } catch (error) {
            return erroInterno(res, error);
        }
    },

    // ---------------- VENDEDOR (admin) ----------------

    // GET /chat/admin/conversas
    listarConversas: async (req, res) => {
        try {
            const conversas = await chatRepository.listarConversasAdmin();
            return res.status(200).json({
                conversas,
                totalNaoLidas: conversas.reduce((soma, c) => soma + Number(c.nao_lidas), 0),
            });
        } catch (error) {
            return erroInterno(res, error);
        }
    },

    // GET /chat/admin/conversas/:id/mensagens?apos=<id>
    listarMensagensAdmin: async (req, res) => {
        try {
            const conversa = await chatRepository.buscarConversaPorId(req.params.id);
            if (!conversa) return res.status(404).json({ message: "Conversa não encontrada." });

            const mensagens = await chatRepository.listarMensagens(conversa.id_conversa, lerApos(req.query.apos));
            await chatRepository.marcarComoLidas(conversa.id_conversa, 'cliente');

            return res.status(200).json({
                conversa: {
                    id: conversa.id_conversa,
                    idProduto: conversa.id_produto,
                    nomeProduto: conversa.nome_produto,
                    nomeCliente: conversa.nome_cliente,
                },
                mensagens,
            });
        } catch (error) {
            return erroInterno(res, error);
        }
    },

    // POST /chat/admin/conversas/:id/mensagens
    enviarDoVendedor: async (req, res) => {
        try {
            const { texto, erro } = validarTexto(req.body?.texto);
            if (erro) return res.status(400).json({ message: erro });

            const conversa = await chatRepository.buscarConversaPorId(req.params.id);
            if (!conversa) return res.status(404).json({ message: "Conversa não encontrada." });

            const mensagem = await chatRepository.inserirMensagem({
                idConversa: conversa.id_conversa,
                remetente: 'vendedor',
                idAutor: req.id_cliente,
                texto,
            });

            return res.status(201).json({ mensagem });
        } catch (error) {
            return erroInterno(res, error);
        }
    },
};

export default chatController;
