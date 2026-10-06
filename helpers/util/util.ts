export function formatDate(value: number | string): string {
    return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function formatShortDate(value: Date): string {
    const day = String(value.getDate()).padStart(2, '0');
    const month = value.toLocaleDateString('en-US', { month: 'short' });
    return `${day}-${month}-${value.getFullYear()}`;
}
