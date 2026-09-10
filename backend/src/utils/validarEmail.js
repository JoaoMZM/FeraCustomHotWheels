export function validarEmail(email) {
    if (!email) return false;

    email = email.trim();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
}