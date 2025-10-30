import dotenv from 'dotenv';
import { fetchRates } from '../services/rateService.js';

dotenv.config();

(async () => {
  try {
    const rates = await fetchRates();
    console.log('Fetched rates count:', Array.isArray(rates) ? rates.length : 0);
    console.log('Sample 3 rows:', rates.slice(0, 3));
  } catch (err) {
    console.error('Error in test_list_rates:', err.message || err);
    process.exitCode = 1;
  }
})();
