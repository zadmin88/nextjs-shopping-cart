import { Inter } from 'next/font/google';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import Products from '../components/Products';
import { useSelector } from 'react-redux';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const store = useSelector((state) => state);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/products');
      const newProducts = await res.json();
      setProducts(newProducts);
    } catch (err) {
      setError(true);
    }

    setLoading(false);
  }

  if (error) {
    return <div>Failed to load</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <main className={styles.main}>
        <Products data={products} />
      </main>
    </>
  );
}
