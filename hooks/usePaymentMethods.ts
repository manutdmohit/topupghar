'use client';

import { useEffect, useState } from 'react';
import type { PaymentMethodDto } from '@/lib/payment-methods';

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMethods() {
      try {
        setLoading(true);
        const response = await fetch('/api/payment-methods');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load payment methods');
        }

        if (!cancelled) {
          setPaymentMethods(data.paymentMethods || []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load payment methods',
          );
          setPaymentMethods([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMethods();

    return () => {
      cancelled = true;
    };
  }, []);

  return { paymentMethods, loading, error };
}
