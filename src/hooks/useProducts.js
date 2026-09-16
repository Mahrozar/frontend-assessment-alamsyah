import { useCallback, useEffect, useRef, useState } from 'react';
import { productApi } from '../services/productApi';

export function useProducts(notify) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const productsRef = useRef(products);

  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productApi.list();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      notify(error.message, 'error', loadProducts);
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const createProduct = async (values) => {
    const temporaryId = `temp-${crypto.randomUUID()}`;
    const optimisticProduct = {
      ...values,
      id: temporaryId,
      createdAt: new Date().toISOString(),
    };

    setProducts((current) => [optimisticProduct, ...current]);

    try {
      const saved = await productApi.create(values);
      setProducts((current) => current.map((item) => (
        item.id === temporaryId
          ? { ...optimisticProduct, ...saved, createdAt: saved?.createdAt ?? optimisticProduct.createdAt }
          : item
      )));
      notify('Produk berhasil ditambahkan.', 'success');
      return true;
    } catch (error) {
      setProducts((current) => current.filter((item) => item.id !== temporaryId));
      notify(`Produk tidak dapat ditambahkan. ${error.message}`, 'error');
      return false;
    }
  };

  const updateProduct = async (id, values) => {
    const previous = productsRef.current.find((item) => item.id === id);
    if (!previous) return false;

    setProducts((current) => current.map((item) => (
      item.id === id ? { ...item, ...values } : item
    )));

    try {
      const saved = await productApi.update(id, values);
      setProducts((current) => current.map((item) => (
        item.id === id ? { ...item, ...saved } : item
      )));
      notify('Produk berhasil diperbarui.', 'success');
      return true;
    } catch (error) {
      setProducts((current) => current.map((item) => (
        item.id === id ? previous : item
      )));
      notify(`Pembaruan gagal dan perubahan dikembalikan. ${error.message}`, 'error');
      return false;
    }
  };

  const deleteProduct = async (product) => {
    const originalIndex = productsRef.current.findIndex((item) => item.id === product.id);
    setProducts((current) => current.filter((item) => item.id !== product.id));

    try {
      await productApi.remove(product.id);
      notify('Produk berhasil dihapus.', 'success');
      return true;
    } catch (error) {
      setProducts((current) => {
        const restored = [...current];
        restored.splice(Math.max(originalIndex, 0), 0, product);
        return restored;
      });
      notify(`Penghapusan gagal dan perubahan dikembalikan. ${error.message}`, 'error');
      return false;
    }
  };

  return { products, loading, loadProducts, createProduct, updateProduct, deleteProduct };
}
