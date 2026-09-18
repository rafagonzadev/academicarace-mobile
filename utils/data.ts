// Formata dígitos digitados livremente em DD/MM/AAAA (padrão brasileiro),
// inserindo as barras conforme a pessoa digita (e encolhendo certo ao apagar).
export function formatarDataDigitada(texto: string): string {
    const digitos = texto.replace(/[^0-9]/g, '').slice(0, 8);
    const dia = digitos.slice(0, 2);
    const mes = digitos.slice(2, 4);
    const ano = digitos.slice(4, 8);

    let resultado = dia;
    if (mes) resultado += '/' + mes;
    if (ano) resultado += '/' + ano;
    return resultado;
}

// Data de hoje já em DD/MM/AAAA, pra usar como valor inicial de campos de data.
export function hojeFormatado(): string {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${hoje.getFullYear()}`;
}

// Converte DD/MM/AAAA -> AAAA-MM-DD (formato ISO que o backend espera).
// Retorna null se a data estiver incompleta ou não bater com o formato.
export function paraIso(dataBr: string): string | null {
    const match = dataBr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;
    const [, dia, mes, ano] = match;
    return `${ano}-${mes}-${dia}`;
}
