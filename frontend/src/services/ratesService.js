import { supabase } from '../config/supabase';
import * as localRates from '../config/rates';

/**
 * ratesStore holds the current rate tables used by the app.
 * It's initialized from local config and may be overridden by Supabase data.
 */
export const ratesStore = {
  ...localRates,
};

/**
 * Try to load rates from Supabase. This function is tolerant of a few
 * possible table shapes: prefers a single-row JSON column in `rates_config`
 * or `rates_json`. If nothing is found or Supabase isn't configured it
 * leaves the in-memory `ratesStore` unchanged and returns false.
 */
export async function loadRatesFromSupabase() {
  if (!supabase) {
    console.warn('Supabase client not configured; using local rates');
    return false;
  }

  try {
    // Prefer existing JSON blob tables if present
    let res = await supabase.from('rates_config').select('config').limit(1).maybeSingle();
    if (res && !res.error && res.data && res.data.config) {
      Object.assign(ratesStore, res.data.config);
      console.info('Loaded rates from supabase.rates_config');
      return true;
    }

    res = await supabase.from('rates_json').select('data').limit(1).maybeSingle();
    if (res && !res.error && res.data && res.data.data) {
      Object.assign(ratesStore, res.data.data);
      console.info('Loaded rates from supabase.rates_json');
      return true;
    }

    // If those don't exist, try the normalized schema: rates + rate_types + lookups
    const { data: ratesRows, error: ratesErr } = await supabase.from('rates').select('*').eq('is_active', true).order('effective_from', { ascending: false }).limit(1000);
    if (!ratesErr && Array.isArray(ratesRows) && ratesRows.length) {
      // Fetch lookup tables
      const [{ data: typeRows }, { data: pgRows }, { data: tierRows }, { data: propRows }] = await Promise.all([
        supabase.from('rate_types').select('*'),
        supabase.from('product_groups').select('*'),
        supabase.from('tiers').select('*'),
        supabase.from('property_types').select('*'),
      ]);

      const rateTypeById = (typeRows || []).reduce((acc, r) => ((acc[r.id] = r), acc), {});
      const pgById = (pgRows || []).reduce((acc, r) => ((acc[r.id] = r), acc), {});
      const tierById = (tierRows || []).reduce((acc, r) => ((acc[r.id] = r), acc), {});
      const propById = (propRows || []).reduce((acc, r) => ((acc[r.id] = r), acc), {});

      const mapped = {};

      const ensurePath = (obj, path) => {
        let cur = obj;
        for (const p of path) {
          if (!cur[p]) cur[p] = {};
          cur = cur[p];
        }
        return cur;
      };

      for (const row of ratesRows) {
        const pg = (pgById[row.product_group_id] && pgById[row.product_group_id].name) || 'Other';
        const prop = (propById[row.property_type_id] && propById[row.property_type_id].name) || null;
        const tier = (tierById[row.tier_id] && tierById[row.tier_id].name) || 'Tier 1';
        const rateType = (rateTypeById[row.rate_type_id] && rateTypeById[row.rate_type_id].name) || 'Product';
        const ltv = row.fee_percentage;
        const rateVal = row.rate_value;
        const isRetention = !!row.is_retention;
        const retentionLtv = row.retention_ltv;

        // Build target keys
        if (isRetention) {
          // retention sets are split by LTV and sometimes by product group (core)
          const baseKey = (String(pg).toLowerCase().includes('core')) ? `RATES_CORE_RETENTION_${retentionLtv}` : `RATES_RETENTION_${retentionLtv}`;
          // structure: baseKey -> propertyType (Residential/Commercial) -> tier -> products -> productName -> { ltv: value }
          const tierObj = ensurePath(mapped, [baseKey, prop || 'Residential', tier]);
          if (!tierObj.products) tierObj.products = {};
          if (!tierObj.products[rateType]) tierObj.products[rateType] = {};
          tierObj.products[rateType][ltv] = rateVal;
          // also set isMargin if rate type indicates it
          if (rateTypeById[row.rate_type_id] && rateTypeById[row.rate_type_id].is_margin) {
            tierObj.products[rateType].isMargin = true;
          }
        } else {
          // Non-retention: map into one of RATES_CORE, RATES_COMMERCIAL, RATES_SEMI_COMMERCIAL, or RATES_DATA
          let key = 'RATES_DATA';
          const pgName = String(pg).toLowerCase();
          if (pgName.includes('core')) key = 'RATES_CORE';
          else if (pgName.includes('semi')) key = 'RATES_SEMI_COMMERCIAL';
          else if (pgName.includes('commercial')) key = 'RATES_COMMERCIAL';
          // structure: key -> tier -> products -> productName -> { ltv: value }
          const tierObj = ensurePath(mapped, [key, tier]);
          if (!tierObj.products) tierObj.products = {};
          if (!tierObj.products[rateType]) tierObj.products[rateType] = {};
          tierObj.products[rateType][ltv] = rateVal;
          if (rateTypeById[row.rate_type_id] && rateTypeById[row.rate_type_id].is_margin) {
            tierObj.products[rateType].isMargin = true;
          }
        }
      }

      // Merge mapped object into ratesStore
      Object.assign(ratesStore, mapped);
      console.info('Loaded and mapped rates from normalized Supabase tables');
      return true;
    }

    // No DB rates found
    console.info('No rates found in Supabase; using local config');
    return false;
  } catch (err) {
    console.warn('Failed to load rates from Supabase:', err.message || err);
    return false;
  }
}
