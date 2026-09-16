import { useCallback, useMemo, useState } from 'react';
import { Toast, TableSkeleton } from './components/Feedback';
import { Icon } from './components/Icons';
import { Modal } from './components/Modal';
import { CATEGORIES, CATEGORY_LABELS, ProductForm, STATUSES, STATUS_LABELS } from './components/ProductForm';
import { ProductTable } from './components/ProductTable';
import { useProducts } from './hooks/useProducts';
import { formatCurrency, formatDate } from './utils/formatters';

function App() {
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [modal, setModal] = useState(null);

  const notify = useCallback((message, type = 'success', retry = null) => {
    setToast({ message, type, retry });
    if (type === 'success') window.setTimeout(() => setToast(null), 3500);
  }, []);

  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts(notify);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return products.filter((product) => {
      const matchesSearch = !query || product.name.toLocaleLowerCase().includes(query);
      const matchesCategory = category === 'All' || product.category === category;
      const matchesStatus = status === 'All' || product.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  const stockCount = products.filter((product) => product.status === 'In Stock').length;
  const closeModal = useCallback(() => setModal(null), []);

  const handleDelete = async () => {
    const product = modal.product;
    closeModal();
    await deleteProduct(product);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#main" aria-label="Beranda dasbor Stockroom">
          <span className="brand__mark"><Icon name="box" size={20} /></span>
          <span>Stockroom</span>
        </a>
        <div className="topbar__meta">
          <span className="live-dot" /> Ruang kerja katalog
        </div>
      </header>

      <main id="main" className="workspace">
        <section className="page-heading">
          <div>
            <p className="eyebrow">Inventaris</p>
            <h1>Katalog produk</h1>
            <p>Kelola detail produk, harga, dan ketersediaan stok.</p>
          </div>
          <button className="button button--primary button--add" type="button" onClick={() => setModal({ type: 'create' })}>
            <Icon name="plus" /> Tambah produk
          </button>
        </section>

        <section className="summary" aria-label="Ringkasan katalog">
          <div className="summary__item"><span>Total produk</span><strong>{products.length}</strong></div>
          <div className="summary__divider" />
          <div className="summary__item"><span>Tersedia saat ini</span><strong>{stockCount}</strong></div>
          <div className="summary__divider" />
          <div className="summary__item"><span>Kategori</span><strong>{new Set(products.map((item) => item.category)).size}</strong></div>
        </section>

        <section className="catalogue-panel">
          <div className="toolbar">
            <div className="search-box">
              <Icon name="search" />
              <label className="sr-only" htmlFor="search">Cari produk</label>
              <input id="search" type="search" placeholder="Cari berdasarkan nama produk..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <div className="filters">
              <label>
                <span className="sr-only">Filter berdasarkan kategori</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option value="All">Semua</option>
                  {CATEGORIES.map((item) => <option key={item} value={item}>{CATEGORY_LABELS[item]}</option>)}
                </select>
              </label>
              <label>
                <span className="sr-only">Filter berdasarkan status</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="All">Semua</option>
                  {STATUSES.map((item) => <option key={item} value={item}>{STATUS_LABELS[item]}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className="result-bar">
            <span>{filteredProducts.length} produk</span>
            {(search || category !== 'All' || status !== 'All') && (
              <button type="button" onClick={() => { setSearch(''); setCategory('All'); setStatus('All'); }}>Hapus filter</button>
            )}
          </div>

          {loading ? (
            <TableSkeleton />
          ) : (
            <ProductTable
              products={filteredProducts}
              onView={(product) => setModal({ type: 'view', product })}
              onEdit={(product) => setModal({ type: 'edit', product })}
              onDelete={(product) => setModal({ type: 'delete', product })}
            />
          )}
        </section>
      </main>

      {modal?.type === 'create' && (
        <Modal title="Tambah produk baru" eyebrow="Buat produk" onClose={closeModal}>
          <ProductForm onSubmit={createProduct} onCancel={closeModal} />
        </Modal>
      )}

      {modal?.type === 'edit' && (
        <Modal title={`Edit ${modal.product.name}`} eyebrow="Perbarui produk" onClose={closeModal}>
          <ProductForm product={modal.product} onSubmit={(values) => updateProduct(modal.product.id, values)} onCancel={closeModal} />
        </Modal>
      )}

      {modal?.type === 'view' && (
        <Modal title={modal.product.name} eyebrow="Detail produk" onClose={closeModal}>
          <div className="detail-grid">
            <div><span>Kategori</span><strong>{CATEGORY_LABELS[modal.product.category] ?? modal.product.category}</strong></div>
            <div><span>Status</span><strong>{STATUS_LABELS[modal.product.status] ?? modal.product.status}</strong></div>
            <div><span>Harga</span><strong>{formatCurrency(modal.product.price)}</strong></div>
            <div><span>Dibuat</span><strong>{formatDate(modal.product.createdAt)}</strong></div>
          </div>
          <footer className="form-actions">
            <button className="button button--secondary" type="button" onClick={closeModal}>Tutup</button>
            <button className="button button--primary" type="button" onClick={() => setModal({ type: 'edit', product: modal.product })}>Edit produk</button>
          </footer>
        </Modal>
      )}

      {modal?.type === 'delete' && (
        <Modal title="Hapus produk?" eyebrow="Konfirmasi" onClose={closeModal} size="small">
          <p className="confirmation-copy">Yakin ingin menghapus <strong>{modal.product.name}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
          <footer className="form-actions">
            <button className="button button--secondary" type="button" onClick={closeModal}>Batal</button>
            <button className="button button--danger" type="button" onClick={handleDelete}>Hapus produk</button>
          </footer>
        </Modal>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
