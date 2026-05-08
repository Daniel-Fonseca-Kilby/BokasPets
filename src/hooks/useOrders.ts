import { useState, useCallback, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export interface Order {
  _id: string;
  totalPrice: number;
  createdAt: string;
  items: Array<{ name: string; qty: number; price: number }>;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Error fetching orders';
      setError(msg);
      console.error(msg, err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const createOrder = async (orderData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/orders', orderData);
      toast.success('Plan comprado exitosamente ✅');
      return { success: true, data: res.data };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Error creando la orden';
      setError(msg);
      toast.error(`Error: ${msg}`);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, fetchOrders, createOrder };
};
