const API_URL = import.meta.env.VITE_API_URL?.trim();

async function request(url = '', options = {}) {
  if (!API_URL) {
    throw new Error('URL API belum dikonfigurasi. Salin .env.example ke .env dan perbarui VITE_API_URL.');
  }

  const response = await fetch(`${API_URL}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Permintaan gagal dengan status ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const productApi = {
  list: () => request(),
  create: (product) => request('', { method: 'POST', body: JSON.stringify(product) }),
  update: (id, product) => request(`/${id}`, { method: 'PATCH', body: JSON.stringify(product) }),
  remove: (id) => request(`/${id}`, { method: 'DELETE' }),
};
