import { useState, useEffect } from 'react';
import { fetchCriteriaConfig, fetchCoreCriteriaConfig } from '../services/criteriaService';

export const useDynamicCriteria = () => {
  const [criteriaConfig, setCriteriaConfig] = useState(null);
  const [coreCriteriaConfig, setCoreCriteriaConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCriteria();
  }, []);

  return {
    criteriaConfig,
    coreCriteriaConfig,
    loading,
    error,
    reload: () => {
      setLoading(true);
      loadCriteria();
    },
  };
};