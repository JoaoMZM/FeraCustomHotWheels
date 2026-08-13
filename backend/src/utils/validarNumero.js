export function validarTelefone(telefone) {

    if (!telefone) return false;

    const telefoneLimpo = telefone.toString().replace(/\D/g, '');

    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
        return false;
    }

    if (/^(\d)\1+$/.test(telefoneLimpo)) {
        return false;
    }

    const ddd = parseInt(telefoneLimpo.substring(0, 2));
    if (ddd < 11 || ddd > 99) {
        return false;
    }

    if (telefoneLimpo.length === 11) {
        if (telefoneLimpo[2] !== '9') {
            return false;
        }
    }

    return true;
}