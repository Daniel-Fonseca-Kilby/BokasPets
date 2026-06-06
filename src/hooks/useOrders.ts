import { useState, useCallback, useContext } from 'react';
import axios from 'axios';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export interface Order {
  _id: string;
  totalPrice: number;
  createdAt: string;
  items: Array<{ name: string; qty: number; price: number }>;
}

export interface CreateOrderData {
  totalPrice: number;
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
    } catch (err: unknown) {
      let msg = 'Error fetching orders';
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.response?.data?.error || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
      console.error(msg, err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const createOrder = async (orderData: CreateOrderData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/orders', orderData);
      toast.success('Plan comprado exitosamente ✅');
      return { success: true, data: res.data };
    } catch (err: unknown) {
      let msg = 'Error creando la orden';
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.response?.data?.error || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
      toast.error(`Error: ${msg}`);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, fetchOrders, createOrder };
};
