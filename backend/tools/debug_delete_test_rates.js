import dotenv from 'dotenv';
import { supabase } from '../config/supabase.js';

dotenv.config();

(async () => {
  try {
    const { data, error } = await supabase.from('rates').delete().eq('fee_percentage', 98).select();
    if (error) {
      console.error('Error deleting test rates:', error);
      return;
    }
    console.log('Deleted rows:', data);
  } catch (err) {
    console.error('Error in debug_delete_test_rates:', err.message || err);
  }
})();
