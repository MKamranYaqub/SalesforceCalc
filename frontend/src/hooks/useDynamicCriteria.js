import { useState, useEffect } from 'react';
import { fetchCriteriaConfig, fetchCoreCriteriaConfig } from '../services/criteriaService';

export const useDynamicCriteria = () => {
  const [criteriaConfig, setCriteriaConfig] = useState(null);
  const [coreCriteriaConfig, setCoreCriteriaConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extracted loader so it can be called from effect and reload
  const loadCriteria = async () => {
    try {
      setLoading(true);
      const [standard, core] = await Promise.all([
        fetchCriteriaConfig(),
        fetchCoreCriteriaConfig(),
      ]);

      setCriteriaConfig(standard);
      setCoreCriteriaConfig(core);
      setError(null);
    } catch (err) {
      console.error('Failed to load criteria:', err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCriteria();
  }, []);

  return {
    criteriaConfig,
    coreCriteriaConfig,
    loading,
    error,
    reload: () => {
      // expose a safe reload that re-runs the loader
      loadCriteria();
    },
  };
};