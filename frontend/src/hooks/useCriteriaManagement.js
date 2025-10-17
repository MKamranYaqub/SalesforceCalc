/**
 * Hook for managing criteria and tier calculation with dynamic configuration
 */
import { useState, useMemo, useCallback } from 'react';
import { PROPERTY_TYPES } from '../config/constants';

export const useCriteriaManagement = (propertyType, criteriaConfig, coreCriteriaConfig) => {
  const getCurrentCriteria = useCallback(() => {
    if (!criteriaConfig) return null;
    
    if (propertyType === PROPERTY_TYPES.COMMERCIAL || 
        propertyType === PROPERTY_TYPES.SEMI_COMMERCIAL) {
      return criteriaConfig.Commercial || criteriaConfig.Residential;
    }
    return criteriaConfig.Residential;
  }, [propertyType, criteriaConfig]);

  const initializeCriteriaState = useCallback((cfg) => {
    if (!cfg) return {};
    
    const state = {};
    cfg?.propertyQuestions?.forEach((q) => {
      state[q.key] = q.options[0].label;
    });
    cfg?.applicantQuestions?.forEach((q) => {
      state[q.key] = q.options[0].label;
    });
    return state;
  }, []);

  const [criteria, setCriteria] = useState(() => 
    initializeCriteriaState(getCurrentCriteria())
  );

  const tier = useMemo(() => {
    const cfg = getCurrentCriteria();
    if (!cfg) return 'Tier 1';
    
    let maxTier = 1;
    cfg?.propertyQuestions?.forEach((q) => {
      const answer = criteria[q.key];
      const option = q.options.find((opt) => opt.label === answer);
      if (option && option.tier > maxTier) maxTier = option.tier;
    });
    cfg?.applicantQuestions?.forEach((q) => {
      const answer = criteria[q.key];
      const option = q.options.find((opt) => opt.label === answer);
      if (option && option.tier > maxTier) maxTier = option.tier;
    });
    return `Tier ${maxTier}`;
  }, [criteria, getCurrentCriteria]);

  const isWithinCoreCriteria = useMemo(() => {
    if (propertyType !== PROPERTY_TYPES.RESIDENTIAL) return false;
    if (!coreCriteriaConfig) return false;
    
    const coreCfg = coreCriteriaConfig?.Residential;
    if (!coreCfg) return false;

    const checkGroup = (groupKey, fullCfg) => {
      const coreGroup = coreCfg?.[groupKey] || [];
      for (const q of fullCfg?.[groupKey] || []) {
        const selectedAnswer = criteria[q.key];
        const coreQ = coreGroup.find((c) => c.key === q.key);
        if (!coreQ) continue;
        const allowedLabels = coreQ.options.map((o) => o.label);
        if (!allowedLabels.includes(selectedAnswer)) {
          return false;
        }
      }
      return true;
    };

     const standardCriteria = criteriaConfig?.Residential;
    if (!standardCriteria) return false;

    const okProp = checkGroup("propertyQuestions", standardCriteria);
    const okApp = checkGroup("applicantQuestions", standardCriteria);
    return okProp && okApp;
  }, [criteria, propertyType, criteriaConfig, coreCriteriaConfig]);

  return {
    criteria,
    setCriteria,
    tier,
    getCurrentCriteria,
    isWithinCoreCriteria,
    initializeCriteriaState,
  };
};