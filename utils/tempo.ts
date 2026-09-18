export function formatarMinutos(minutos: number): string {
    const total = Math.max(0, Math.round(minutos));
    const h = Math.floor(total / 60);
    const m = total % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
}
