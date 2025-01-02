export const formatPrice = (price: number) => `$${price.toFixed(2)}`;
export const formatDate = (date: Date) => new Date(date).toLocaleDateString();
