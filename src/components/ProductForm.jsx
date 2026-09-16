import { useMemo, useState } from 'react';

export const CATEGORIES = ['Electronics', 'Home & Kitchen', 'Apparel'];
export const STATUSES = ['In Stock', 'Out of Stock'];
export const CATEGORY_LABELS = {
  Electronics: 'Elektronik',
  'Home & Kitchen': 'Rumah & Dapur',
  Apparel: 'Pakaian',
};
export const STATUS_LABELS = {
  'In Stock': 'Tersedia',
  'Out of Stock': 'Habis',
};

const EMPTY_FORM = {
  name: '',
  category: '',
  price: '',
  status: 'In Stock',
};

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Nama produk wajib diisi.';
  if (!CATEGORIES.includes(values.category)) errors.category = 'Pilih kategori yang valid.';
  if (values.price === '' || !Number.isFinite(Number(values.price)) || Number(values.price) <= 0) {
    errors.price = 'Harga harus berupa angka lebih dari 0.';
  }
  if (!STATUSES.includes(values.status)) errors.status = 'Pilih status stok yang valid.';
  return errors;
}

export function ProductForm({ product, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => product ? {
    name: product.name,
    category: product.category,
    price: String(product.price),
    status: product.status,
  } : EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const errors = useMemo(() => validate(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  const updateField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid || submitting) return;

    setSubmitting(true);
    const succeeded = await onSubmit({
      name: values.name.trim(),
      category: values.category,
      price: Number(values.price),
      status: values.status,
    });
    setSubmitting(false);
    if (succeeded) onCancel();
  };

  const showError = (field) => (touched[field] || submitted) && errors[field];

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <div className="field field--full">
        <label htmlFor="name">Nama produk</label>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={updateField}
          onBlur={() => setTouched((current) => ({ ...current, name: true }))}
          aria-invalid={Boolean(showError('name'))}
          aria-describedby={showError('name') ? 'name-error' : undefined}
          placeholder="mis. Headphone Studio"
          autoFocus
        />
        {showError('name') && <span id="name-error" className="field__error">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="category">Kategori</label>
        <select
          id="category"
          name="category"
          value={values.category}
          onChange={updateField}
          onBlur={() => setTouched((current) => ({ ...current, category: true }))}
          aria-invalid={Boolean(showError('category'))}
        >
          <option value="">Pilih kategori</option>
          {CATEGORIES.map((category) => <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>)}
        </select>
        {showError('category') && <span className="field__error">{errors.category}</span>}
      </div>

      <div className="field">
        <label htmlFor="price">Harga (IDR)</label>
        <div className="input-prefix">
          <span>Rp</span>
          <input
            id="price"
            name="price"
            type="number"
            min="1"
            step="1"
            value={values.price}
            onChange={updateField}
            onBlur={() => setTouched((current) => ({ ...current, price: true }))}
            aria-invalid={Boolean(showError('price'))}
            placeholder="0"
          />
        </div>
        {showError('price') && <span className="field__error">{errors.price}</span>}
      </div>

      <fieldset className="field field--full status-options">
        <legend>Status</legend>
        <div className="status-options__row">
          {STATUSES.map((status) => (
            <label key={status} className={`radio-card ${values.status === status ? 'radio-card--active' : ''}`}>
              <input
                type="radio"
                name="status"
                value={status}
                checked={values.status === status}
                onChange={updateField}
              />
              <span className={`status-dot ${status === 'In Stock' ? 'status-dot--green' : 'status-dot--red'}`} />
              {STATUS_LABELS[status]}
            </label>
          ))}
        </div>
      </fieldset>

      <footer className="form-actions field--full">
        <button className="button button--secondary" type="button" onClick={onCancel}>Batal</button>
        <button className="button button--primary" type="submit" disabled={!isValid || submitting}>
          {submitting ? 'Menyimpan...' : product ? 'Simpan perubahan' : 'Tambah produk'}
        </button>
      </footer>
    </form>
  );
}
