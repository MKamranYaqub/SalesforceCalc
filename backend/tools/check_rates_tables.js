#!/usr/bin/env node
import { supabase } from '../config/supabase.js';

async function main() {
  if (!supabase) {
    console.error('Supabase client not configured. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in backend/.env');
    process.exit(1);
  }

  try {
    // List public tables so we can find similarly named tables (e.g., rate_types)
    console.log('Listing tables in public schema (limit 200)');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(200);

    if (tablesError) {
      console.warn('Could not list information_schema.tables:', tablesError.message || tablesError);
    } else {
      const names = (tables || []).map((t) => t.table_name).sort();
      console.log('Public tables (sample):', names.slice(0, 80));
    }

    console.log('Querying table: rates (limit 50)');
    const { data: ratesData, error: ratesError, count: ratesCount } = await supabase
      .from('rates')
      .select('*', { count: 'exact' })
      .limit(50);

    if (ratesError) {
      console.error('Error reading `rates`:', ratesError.message || ratesError);
    } else {
      console.log(`rates: returned ${ratesData ? ratesData.length : 0} rows (count: ${ratesCount})`);
      console.log('Sample rates rows:', JSON.stringify(ratesData?.slice(0, 5) || [], null, 2));
    }

    console.log('\nQuerying table: rates_type (limit 50)');
    const { data: typesData, error: typesError, count: typesCount } = await supabase
      .from('rates_type')
      .select('*', { count: 'exact' })
      .limit(50);

    if (typesError) {
      console.error('Error reading `rates_type`:', typesError.message || typesError);
    } else {
      console.log(`rates_type: returned ${typesData ? typesData.length : 0} rows (count: ${typesCount})`);
      console.log('Sample rates_type rows:', JSON.stringify(typesData?.slice(0, 10) || [], null, 2));
    }

    // Optionally show a mapping of distinct rate_type ids if present
    if (ratesData && typesData) {
      const distinctTypeIds = [...new Set(ratesData.map((r) => r.rate_type_id).filter(Boolean))];
      console.log('\nDistinct rate_type_id values referenced in `rates` sample:', distinctTypeIds);
    }
    
      // Try a list of common candidate table names for rate types
      const candidates = ['rate_types', 'rates_types', 'rate_type', 'rates_type', 'rate_types_lookup', 'rates_lookup', 'rate_types_lookup'];
      for (const name of candidates) {
        try {
          const { data: candData, error: candError } = await supabase.from(name).select('*').limit(5);
          if (!candError) {
            console.log(`\nFound candidate table: ${name} (sample rows):`, JSON.stringify(candData || [], null, 2));
          }
        } catch (e) {
          // ignore
        }
      }
  } catch (err) {
    console.error('Unexpected error while querying Supabase:', err.message || err);
    process.exit(2);
  }
}

main();
