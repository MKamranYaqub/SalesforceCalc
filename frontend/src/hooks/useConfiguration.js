import { useState, useEffect } from 'react';

export const useConfiguration = () => {
  const [rates, setRates] = useState(null);
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/configuration');
        const result = await response.json();

        if (result.success) {
          setRates(result.data.rates);
          setLimits(result.data.limits);
        } else {
          throw new Error(result.message || 'Failed to fetch configuration');
        }
      } catch (err) {
        console.error('Error fetching configuration:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfiguration();
  }, []);

  return { rates, limits, loading, error };
};