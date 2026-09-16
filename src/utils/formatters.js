export function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Tidak diketahui';
  return new Intl.DateTimeFormat('id-ID', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(date);
}
