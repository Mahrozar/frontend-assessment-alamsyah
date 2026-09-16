import { Icon } from './Icons';

export function TableSkeleton() {
  return (
    <div className="skeleton" aria-label="Memuat produk" role="status">
      {[1, 2, 3, 4].map((row) => (
        <div className="skeleton__row" key={row}>
          <span /><span /><span /><span /><span />
        </div>
      ))}
    </div>
  );
}

export function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div className={`toast toast--${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}>
      <div>
        <strong>{toast.type === 'error' ? 'Terjadi kesalahan' : 'Berhasil'}</strong>
        <p>{toast.message}</p>
      </div>
      {toast.retry && <button type="button" onClick={toast.retry}>Coba lagi</button>}
      <button type="button" className="toast__close" onClick={onClose} aria-label="Tutup notifikasi"><Icon name="close" size={16} /></button>
    </div>
  );
}
