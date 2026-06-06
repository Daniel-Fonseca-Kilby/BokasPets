import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import api from '../services/api';
import toast from 'react-hot-toast';

export interface RevenueMonth {
  month: string;
  revenue: number;
  orders: number;
}

export interface OrderStatus {
  name: string;
  value: number;
  color: string;
}

export interface UserGrowth {
  week: string;
  users: number;
}

export interface PlanDistribution {
  name: string;
  value: number;
  color: string;
}

export interface MetricsData {
  revenueByMonth: RevenueMonth[];
  ordersByStatus: OrderStatus[];
  userGrowth: UserGrowth[];
  planDistribution: PlanDistribution[];
  orders: {
    total: number;
    pending: number;
    processing: number;
    delivered: number;
    thisMonth: number;
    revenueThisMonth: number;
  };
  users: {
    total: number;
    newThisWeek: number;
  };
  plans: {
    mostSold: string;
    distribution: { name: string; count: number }[];
  };
}

// Global cache variables to persist across hook mounts
let cachedData: MetricsData | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useMetrics = () => {
  const [data, setData] = useState<MetricsData | null>(cachedData);
  const [loading, setLoading] = useState<boolean>(!cachedData);
  const [error, setError] = useState<string | null>(null);
  
  // Prevent strict mode double fetching
  const isFetching = useRef(false);

  const fetchMetrics = useCallback(async (force = false) => {
    const now = Date.now();
    
    // Si no forzamos y aún hay caché válido, no hacemos nada
    if (!force && cachedData && now - lastFetchTime < CACHE_DURATION) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    if (isFetching.current) return;
    
    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const res = await api.get<MetricsData>('/admin/metrics');
      cachedData = res.data;
      lastFetchTime = Date.now();
      setData(res.data);
    } catch (err: unknown) {
      let msg = 'Error cargando métricas del dashboard';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMetrics();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchMetrics]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchMetrics(true)
  };
};
