import crypto from 'crypto';
import 'dotenv/config';
import { FRONTEND_URL, BACKEND_URL } from './urls.js';

const API = 'https://api.mercadopago.com';

export const mpConfig = {
    get accessToken() { return process.env.MP_ACCESS_TOKEN; },
    get webhookSecret() { return process.env.MP_WEBHOOK_SECRET; },
    get notificationUrl() {
        return process.env.MP_NOTIFICATION_URL || `${BACKEND_URL}/pagamentos/webhook`;
    },
    backUrl: `${FRONTEND_URL}/pagamento/retorno`,
};

export const mpConfigurado = () => Boolean(mpConfig.accessToken);

async function chamar(path, { method = 'GET', body, headers = {} } = {}) {
    if (!mpConfigurado()) {
        throw Object.assign(new Error('Gateway de pagamento não configurado (MP_ACCESS_TOKEN).'), { status: 503 });
    }

    const resposta = await fetch(`${API}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${mpConfig.accessToken}`,
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(15000),
    });

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        const erro = new Error(dados?.message || `Mercado Pago respondeu ${resposta.status}`);
        erro.status = 502;
        erro.detalhes = dados;
        throw erro;
    }

    return dados;
}

export const mercadoPago = {
    criarPreferencia: (preferencia, idempotencyKey) =>
        chamar('/checkout/preferences', {
            method: 'POST',
            body: preferencia,
            headers: idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {},
        }),

    buscarPagamento: (id) => chamar(`/v1/payments/${encodeURIComponent(id)}`),

    buscarPagamentosPorReferencia: async (referencia) => {
        const dados = await chamar(
            `/v1/payments/search?external_reference=${encodeURIComponent(referencia)}&sort=date_created&criteria=desc`
        );
        return dados.results || [];
    },
};

export function assinaturaWebhookValida(req, dataId) {
    const segredo = mpConfig.webhookSecret;
    if (!segredo) return true;

    const assinatura = req.get('x-signature');
    const requestId = req.get('x-request-id') || '';
    if (!assinatura) return false;

    const partes = Object.fromEntries(
        assinatura.split(',').map((p) => p.trim().split('=').map((s) => s.trim()))
    );
    if (!partes.ts || !partes.v1) return false;

    const id = /^[a-z0-9]+$/i.test(String(dataId)) ? String(dataId).toLowerCase() : String(dataId);
    const manifesto = `id:${id};request-id:${requestId};ts:${partes.ts};`;
    const esperado = crypto.createHmac('sha256', segredo).update(manifesto).digest('hex');

    const a = Buffer.from(esperado);
    const b = Buffer.from(partes.v1);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}
