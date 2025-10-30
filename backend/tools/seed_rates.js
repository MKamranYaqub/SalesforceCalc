#!/usr/bin/env node
import { supabase } from '../config/supabase.js';
import * as rates from '../../frontend/src/config/rates.js';

/**
 * Seed script to upload the local rates config into Supabase.
 *
 * It attempts to upsert a single row into `rates_config` with columns:
 * - id (primary key)
 * - config (json)
 *
 * If your `rates_config` table doesn't exist, the script will print an
 * instructional message rather than attempting to create DB schema.
 */
async function main() {
  if (!supabase) {
    console.error('❌ Supabase client not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) in the environment.');
    process.exit(1);
  }

  // Build a plain object containing all exported rate constants
  const ratesObj = {};
  Object.keys(rates).forEach((k) => {
    ratesObj[k] = rates[k];
  });

  try {
    // Upsert a single row with id=1. Adjust `id` if your table uses a different PK.
    const payload = { id: 1, config: ratesObj };
    const { data, error } = await supabase.from('rates_config').upsert([payload], { returning: 'representation' });

    if (error) {
      // Common case: table does not exist
      const msg = String(error.message || error);
      if (/relation .* does not exist|table .* does not exist/i.test(msg)) {
        console.error('❌ Table `rates_config` not found in your database. Create it with:');
        console.error(`  CREATE TABLE rates_config (id integer primary key, config jsonb);`);
        console.error('Then re-run this script.');
        process.exit(2);
      }

      console.error('❌ Failed to upsert into rates_config:', error);
      process.exit(3);
    }

    console.log('✅ Rates upserted into `rates_config`:', Array.isArray(data) ? data[0] : data);
    process.exit(0);
  } catch (err) {
    console.error('❌ Unexpected error seeding rates:', err);
    process.exit(4);
  }
}

main();
