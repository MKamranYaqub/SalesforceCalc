import dotenv from 'dotenv';
import { supabase } from '../config/supabase.js';

dotenv.config();

(async () => {
  try {
    const { data, error } = await supabase.from('rates').select('*').eq('fee_percentage', 98);
    if (error) {
      console.error('Error querying rates:', error);
      return;
    }
    console.log('Found rows with fee_percentage=98:', data);
  } catch (err) {
    console.error('Error in debug_find_rate:', err.message || err);
  }
})();
