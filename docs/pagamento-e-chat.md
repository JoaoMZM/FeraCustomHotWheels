# Pagamento (Mercado Pago) e chat do produto

## Configuração
1. Rode `backend/src/database/migracao_pagamento_chat.sql` no MySQL (uma vez).
2. Copie `backend/.env.example` para `backend/.env` e preencha `MP_ACCESS_TOKEN` (credencial de **teste** `TEST-...` em https://www.mercadopago.com.br/developers/panel).
3. Webhook em desenvolvimento: o Mercado Pago não alcança `localhost`. Suba um túnel (ngrok/cloudflared) e defina `MP_NOTIFICATION_URL=https://SEU-TUNEL/pagamentos/webhook`. Sem isso o pagamento ainda é confirmado quando o cliente volta para `/pagamento/retorno` (o servidor consulta a API do MP).
4. Em produção, cadastre a URL do webhook no painel do MP e preencha `MP_WEBHOOK_SECRET` (valida `x-signature`).

## Fluxo de pagamento
Carrinho → `POST /pedidos` (preços/estoque do banco) → `POST /pagamentos/pedidos/:id/checkout` → redireciona ao Checkout Pro →
volta em `/pagamento/retorno` (`POST /pagamentos/pedidos/:id/sincronizar`) e/ou `POST /pagamentos/webhook`.
Pedido só vira "Em Processamento" quando o pagamento está `approved` **e** o valor pago = total do pedido. Pedido pendente pode ser pago depois em "Meus Pedidos".

## Chat
- Cliente: `GET /chat/produtos/:idProduto?apos=`, `POST /chat/produtos/:idProduto/mensagens` (widget na página do produto).
- Vendedor (admin): `GET /chat/admin/conversas`, `GET|POST /chat/admin/conversas/:id/mensagens` (tela `/admin/mensagens`).
- Atualização por polling incremental (4 s cliente, 3 s/6 s admin), pausado com a aba oculta. Limite de 1000 caracteres e 20 mensagens/min por cliente.
