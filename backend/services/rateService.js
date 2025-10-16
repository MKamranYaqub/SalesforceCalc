import { supabase } from '../config/supabase.js';

/**
 * Fetch all active rates from Supabase
 */
export const fetchRates = async () => {
  const { data, error } = await supabase
    .from('rates')
    .select(`
      *,
      product_group:product_groups(name),
      property_type:property_types(name),
      tier:tiers(name, tier_number),
      rate_type:rate_types(name, is_margin)
    `)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching rates:', error);
    throw error;
  }

  return data;
};

/**
 * Fetch loan limits from Supabase
 */
export const fetchLoanLimits = async () => {
  const { data, error } = await supabase
    .from('loan_limits')
    .select(`
      *,
      property_type:property_types(name)
    `)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching loan limits:', error);
    throw error;
  }

  return data;
};

/**
 * Fetch term months configuration
 */
export const fetchTermMonths = async () => {
  const { data, error } = await supabase
    .from('term_months')
    .select(`
      *,
      rate_type:rate_types(name)
    `);

  if (error) {
    console.error('Error fetching term months:', error);
    throw error;
  }

  return data;
};

/**
 * Transform rates from database format to application format
 */
export const transformRatesForApp = (rates) => {
  const transformed = {};

  rates.forEach(rate => {
    const productGroup = rate.product_group.name;
    const propertyType = rate.property_type.name;
    const tier = rate.tier.name;
    const rateType = rate.rate_type.name;
    const fee = rate.fee_percentage;
    const isRetention = rate.is_retention;
    const retentionLtv = rate.retention_ltv;

    // Build nested structure
    if (!transformed[productGroup]) transformed[productGroup] = {};
    if (!transformed[productGroup][propertyType]) transformed[productGroup][propertyType] = {};
    
    const retentionKey = isRetention ? 'retention' : 'standard';
    if (!transformed[productGroup][propertyType][retentionKey]) {
      transformed[productGroup][propertyType][retentionKey] = {};
    }

    const path = transformed[productGroup][propertyType][retentionKey];

    if (isRetention) {
      if (!path[retentionLtv]) path[retentionLtv] = {};
      const tierPath = path[retentionLtv];
      if (!tierPath[tier]) tierPath[tier] = {};
      if (!tierPath[tier][rateType]) tierPath[tier][rateType] = {};
      tierPath[tier][rateType][fee] = rate.rate_value;
      if (rate.rate_type.is_margin) {
        tierPath[tier][rateType].isMargin = true;
      }
    } else {
      if (!path[tier]) path[tier] = {};
      if (!path[tier][rateType]) path[tier][rateType] = {};
      path[tier][rateType][fee] = rate.rate_value;
      if (rate.rate_type.is_margin) {
        path[tier][rateType].isMargin = true;
      }
    }
  });

  return transformed;
};