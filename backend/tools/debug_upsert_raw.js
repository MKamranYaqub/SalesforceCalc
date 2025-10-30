import dotenv from 'dotenv';
import { supabase } from '../config/supabase.js';

dotenv.config();

(async () => {
  try {
    const row = {
      product_group_id: '0640e862-b28c-4c09-a494-76b3b69b4c85',
      property_type_id: 'ec3c82c6-d286-4879-acec-50dfada005ec',
      tier_id: 'cdc2dc27-db74-4346-860d-8d7fa436baf3',
      rate_type_id: '4321a937-5833-4d46-96fc-f289e0e00985',
      fee_percentage: 98,
      rate_value: 0.9888,
      is_retention: false,
      is_active: false
    };

    const resp = await supabase.from('rates').insert([row], { returning: 'representation' });
    console.log('Raw upsert response:', resp);
  } catch (err) {
    console.error('Error in debug_upsert_raw:', err.message || err);
  }
})();
