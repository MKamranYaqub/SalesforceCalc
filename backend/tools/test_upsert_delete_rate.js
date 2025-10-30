import dotenv from 'dotenv';
import { upsertRates, fetchRates, deleteRate } from '../services/rateService.js';

dotenv.config();

(async () => {
  try {
    // Use existing foreign ids from the sample data in this project — adjust if needed
    const sample = {
      product_group_id: '0640e862-b28c-4c09-a494-76b3b69b4c85',
      property_type_id: 'ec3c82c6-d286-4879-acec-50dfada005ec',
      tier_id: 'cdc2dc27-db74-4346-860d-8d7fa436baf3',
      rate_type_id: '4321a937-5833-4d46-96fc-f289e0e00985',
      fee_percentage: 99,
      rate_value: 0.9999,
      is_retention: false,
      is_active: false
    };

    console.log('Upserting test rate (inactive)...');
    const upserted = await upsertRates([sample]);
    console.log('Upsert result:', upserted);

    // Find the inserted row by the distinctive rate_value
    const rates = await fetchRates();
    const found = rates.find(r => Number(r.rate_value) === 0.9999 || Number(r.fee_percentage) === 99);
    if (!found) {
      console.error('Inserted rate not found in fetchRates() result (it may be filtered by is_active).');
      process.exit(1);
    }

    console.log('Found inserted rate (id):', found.id);

    console.log('Deleting test rate...');
    const del = await deleteRate(found.id);
    console.log('Delete result:', del);
  } catch (err) {
    console.error('Error in test_upsert_delete_rate:', err.message || err);
    process.exitCode = 1;
  }
})();
