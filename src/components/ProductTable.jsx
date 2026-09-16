import { formatCurrency, formatDate } from '../utils/formatters';
import { Icon } from './Icons';
import { CATEGORY_LABELS, STATUS_LABELS } from './ProductForm';

function Badge({ children, type }) {
  return <span className={`badge badge--${type}`}>{children}</span>;
}

function Actions({ product, onView, onEdit, onDelete }) {
  return (
    <div className="row-actions" onClick={(event) => event.stopPropagation()}>
      <button type="button" className="icon-button" onClick={() => onView(product)} aria-label={`Lihat ${product.name}`}><Icon name="eye" /></button>
      <button type="button" className="icon-button" onClick={() => onEdit(product)} aria-label={`Edit ${product.name}`}><Icon name="edit" /></button>
      <button type="button" className="icon-button icon-button--danger" onClick={() => onDelete(product)} aria-label={`Hapus ${product.name}`}><Icon name="trash" /></button>
    </div>
  );
}

export function ProductTable({ products, onView, onEdit, onDelete }) {
  if (!products.length) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon"><Icon name="box" size={28} /></div>
        <h3>Produk tidak ditemukan</h3>
        <p>Coba ubah pencarian atau pilihan filter.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nama</th><th>Kategori</th><th>Harga</th><th>Status</th><th>Dibuat</th><th><span className="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} onClick={() => onView(product)} tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && onView(product)}>
                <td><strong>{product.name}</strong></td>
                <td><Badge type="category">{CATEGORY_LABELS[product.category] ?? product.category}</Badge></td>
                <td className="price-cell">{formatCurrency(product.price)}</td>
                <td><Badge type={product.status === 'In Stock' ? 'available' : 'unavailable'}>{STATUS_LABELS[product.status] ?? product.status}</Badge></td>
                <td className="muted-cell">{formatDate(product.createdAt)}</td>
                <td><Actions product={product} onView={onView} onEdit={onEdit} onDelete={onDelete} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="product-cards">
        {products.map((product) => (
          <article className="product-card" key={product.id} onClick={() => onView(product)}>
            <div className="product-card__top">
              <Badge type={product.status === 'In Stock' ? 'available' : 'unavailable'}>{STATUS_LABELS[product.status] ?? product.status}</Badge>
              <Actions product={product} onView={onView} onEdit={onEdit} onDelete={onDelete} />
            </div>
            <h3>{product.name}</h3>
            <Badge type="category">{CATEGORY_LABELS[product.category] ?? product.category}</Badge>
            <div className="product-card__meta">
              <strong>{formatCurrency(product.price)}</strong>
              <span>{formatDate(product.createdAt)}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
