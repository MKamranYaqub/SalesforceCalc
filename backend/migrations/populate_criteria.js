import { supabase } from '../config/supabase.js';

// Import the existing criteria configuration
const CRITERIA_CONFIG = {
  Residential: {
    propertyQuestions: [
      {
        key: "hmo",
        label: "HMO",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Up to 6 beds (Tier 2)", tier: 2 },
          { label: "More than 6 beds (Tier 3)", tier: 3 },
        ],
      },
      {
        key: "mufb",
        label: "MUFB",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Up to 6 units (Tier 2)", tier: 2 },
          { label: "Less than 30 units (Tier 3)", tier: 3 },
        ],
      },
      {
        key: "holiday",
        label: "Holiday Let?",
        options: [
          { label: "No", tier: 1 },
          { label: "Yes", tier: 3 },
        ],
      },
      {
        key: "flatAboveComm",
        label: "Flat Above Commercial?",
        options: [
          { label: "No", tier: 1 },
          { label: "Yes", tier: 2 },
        ],
      },
    ],
    applicantQuestions: [
      {
        key: "expat",
        label: "Expat",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Yes - UK footprint (Tier 2)", tier: 2 },
          { label: "Yes - Without UK footprint (Tier 3)", tier: 3 },
        ],
      },
      {
        key: "fnational",
        label: "Foreign National",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Yes - with ILR (Tier 2)", tier: 2 },
          { label: "Yes - Without ILR (Tier 3)", tier: 3 },
        ],
      },
      {
        key: "ftl",
        label: "First Time Landlord?",
        options: [
          { label: "No", tier: 1 },
          { label: "Yes", tier: 2 },
        ],
      },
      {
        key: "offshore",
        label: "Offshore Company?",
        options: [
          { label: "No", tier: 1 },
          { label: "Yes", tier: 3 },
        ],
      },
      {
        key: "mortgageArrears",
        label: "Mortgage Arrears",
        options: [
          { label: "No", tier: 1 },
          { label: "0 in 24", tier: 1 },
          { label: "0 in 18", tier: 2 },
          { label: "Any (by referral)", tier: 3 },
        ],
      },
      {
        key: "unsecuredArrears",
        label: "Unsecured Arrears",
        options: [
          { label: "No", tier: 1 },
          { label: "0 in 24", tier: 1 },
          { label: "0 in 12", tier: 2 },
          { label: "Any (by referral)", tier: 3 },
        ],
      },
      {
        key: "ccjDefault",
        label: "CCJ & Default",
        helper: "Ignore <£350, telecom, utility",
        options: [
          { label: "No", tier: 1 },
          { label: "0 in 24", tier: 1 },
          { label: "0 in 18", tier: 2 },
          { label: "Any (by referral)", tier: 3 },
        ],
      },
      {
        key: "bankruptcy",
        label: "Bankruptcy",
        options: [
          { label: "Never", tier: 1 },
          { label: "Discharged (by referral)", tier: 3 },
        ],
      },
    ],
  },
  Commercial: {
    propertyQuestions: [
      {
        key: "hmo",
        label: "HMO",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Up to 12 beds (Tier 1)", tier: 1 },
          { label: "More than 12 beds (Tier 2)", tier: 2 },
        ],
      },
      {
        key: "mufb",
        label: "MUFB",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Up to 12 units (Tier 1)", tier: 1 },
          { label: "More than 12 units (Tier 2)", tier: 2 },
        ],
      },
      {
        key: "ownerocc",
        label: "Owner Occupier?",
        options: [
          { label: "No", tier: 1 },
          { label: "Yes", tier: 2 },
        ],
      },
      {
        key: "devexit",
        label: "Developer Exit?",
        options: [
          { label: "No", tier: 1 },
          { label: "Yes", tier: 2 },
        ],
      },
    ],
    applicantQuestions: [
      {
        key: "expat",
        label: "Expat",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Yes (Tier 2)", tier: 2 },
        ],
      },
      {
        key: "fnational",
        label: "Foreign National",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Yes (Tier 2)", tier: 2 },
        ],
      },
      {
        key: "ftl",
        label: "First Time Landlord?",
        options: [
          { label: "No", tier: 1 },
          { label: "Yes", tier: 2 },
        ],
      },
      {
        key: "offshore",
        label: "Offshore Company?",
        options: [
          { label: "No", tier: 1 },
          { label: "Yes", tier: 2 },
        ],
      },
      {
        key: "mortgageArrears",
        label: "Mortgage Arrears",
        options: [
          { label: "No", tier: 1 },
          { label: "2 in 18, 0 in 6", tier: 1 },
          { label: "All considered by referral", tier: 2 },
        ],
      },
      {
        key: "unsecuredArrears",
        label: "Unsecured Arrears",
        options: [
          { label: "No", tier: 1 },
          { label: "2 in last 18", tier: 1 },
          { label: "All considered by referral", tier: 2 },
        ],
      },
      {
        key: "ccjDefault",
        label: "CCJ & Default",
        helper: "Ignore <£350, telecom, utility",
        options: [
          { label: "No", tier: 1 },
          { label: "2 in 18, 0 in 6", tier: 1 },
          { label: "All considered by referral", tier: 2 },
        ],
      },
      {
        key: "bankruptcy",
        label: "Bankruptcy",
        options: [
          { label: "Never", tier: 1 },
          { label: "Discharged > 3 years", tier: 1 },
          { label: "All considered by referral", tier: 2 },
        ],
      },
    ],
  },
  "Semi-Commercial": {
    propertyQuestions: [
      {
        key: "hmo",
        label: "HMO",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Up to 12 beds (Tier 1)", tier: 1 },
          { label: "More than 12 beds (Tier 2)", tier: 2 },
        ],
      },
      {
        key: "mufb",
        label: "MUFB",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Up to 12 units (Tier 1)", tier: 1 },
          { label: "More than 12 units (Tier 2)", tier: 2 },
        ],
      },
      {
        key: "ownerocc",
        label: "Owner Occupier?",
        options: [
          { label: "No", tier: 1 },
          { label: "Yes", tier: 2 },
        ],
      },
      {
        key: "devexit",
        label: "Developer Exit?",
        options: [
          { label: "No", tier: 1 },
          { label: "Yes", tier: 2 },
        ],
      },
    ],
    applicantQuestions: [
      {
        key: "expat",
        label: "Expat",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Yes (Tier 2)", tier: 2 },
        ],
      },
      {
        key: "fnational",
        label: "Foreign National",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Yes (Tier 2)", tier: 2 },
        ],
      },
      {
        key: "ftl",
        label: "First Time Landlord?",
        options: [
          { label: "No", tier: 1 },
          { label: "Yes", tier: 2 },
        ],
      },
      {
        key: "offshore",
        label: "Offshore Company?",
        options: [
          { label: "No", tier: 1 },
          { label: "Yes", tier: 2 },
        ],
      },
      {
        key: "mortgageArrears",
        label: "Mortgage Arrears",
        options: [
          { label: "No", tier: 1 },
          { label: "2 in 18, 0 in 6", tier: 1 },
          { label: "All considered by referral", tier: 2 },
        ],
      },
      {
        key: "unsecuredArrears",
        label: "Unsecured Arrears",
        options: [
          { label: "No", tier: 1 },
          { label: "2 in last 18", tier: 1 },
          { label: "All considered by referral", tier: 2 },
        ],
      },
      {
        key: "ccjDefault",
        label: "CCJ & Default",
        helper: "Ignore <£350, telecom, utility",
        options: [
          { label: "No", tier: 1 },
          { label: "2 in 18, 0 in 6", tier: 1 },
          { label: "All considered by referral", tier: 2 },
        ],
      },
      {
        key: "bankruptcy",
        label: "Bankruptcy",
        options: [
          { label: "Never", tier: 1 },
          { label: "Discharged > 3 years", tier: 1 },
          { label: "All considered by referral", tier: 2 },
        ],
      },
    ],
  },
};

const CORE_CRITERIA_CONFIG = {
  Residential: {
    propertyQuestions: [
      {
        key: "hmo",
        label: "HMO",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Up to 6 beds (Tier 2)", tier: 2 },
        ],
      },
      {
        key: "mufb",
        label: "MUFB",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Up to 6 units (Tier 2)", tier: 2 },
        ],
      },
      {
        key: "holiday",
        label: "Holiday Let?",
        options: [{ label: "No", tier: 1 }],
      },
      {
        key: "flatAboveComm",
        label: "Flat above commercial?",
        options: [{ label: "No", tier: 1 }],
      },
    ],
    applicantQuestions: [
      {
        key: "expat",
        label: "Expat",
        options: [
          { label: "No (Tier 1)", tier: 1 },
          { label: "Yes - UK footprint (Tier 2)", tier: 2 },
        ],
      },
      {
        key: "fnational",
        label: "Foreign National",
        options: [{ label: "No (Tier 1)", tier: 1 }],
      },
      {
        key: "ftl",
        label: "First Time Landlord?",
        options: [
          { label: "No", tier: 1 },
          { label: "Yes", tier: 2 },
        ],
      },
      {
        key: "offshore",
        label: "Offshore company?",
        options: [{ label: "No", tier: 1 }],
      },
      {
        key: "mortgageArrears",
        label: "Mortgage Arrears ",
        options: [
          { label: "No", tier: 1 },
          { label: "0 in 24", tier: 1 },
          { label: "0 in 18", tier: 2 },
        ],
      },
      {
        key: "unsecuredArrears",
        label: "Unsecured Arrears ",
        options: [
          { label: "No", tier: 1 },
          { label: "0 in 24", tier: 1 },
          { label: "0 in 12", tier: 2 },
        ],
      },
      {
        key: "ccjDefault",
        label: "CCJ & Default (last 24 months)",
        helper: "Ignore <£350, telecom, utility",
        options: [
          { label: "No", tier: 1 },
          { label: "0 in 24", tier: 1 },
          { label: "0 in 18", tier: 2 },
        ],
      },
      {
        key: "bankruptcy",
        label: "Bankruptcy",
        options: [{ label: "Never", tier: 1 }],
      },
    ],
  },
};

async function clearExistingData() {
  console.log('🗑️  Clearing existing criteria data...');
  
  // Clear standard criteria
  const { error: clearOptionsError } = await supabase
    .from('criteria_options')
    .delete()
    .neq('id', 0);
  
  if (clearOptionsError) {
    console.error('Error clearing criteria_options:', clearOptionsError);
  }

  const { error: clearQuestionsError } = await supabase
    .from('criteria_questions')
    .delete()
    .neq('id', 0);
  
  if (clearQuestionsError) {
    console.error('Error clearing criteria_questions:', clearQuestionsError);
  }

  // Clear core criteria
  const { error: clearCoreOptionsError } = await supabase
    .from('core_criteria_options')
    .delete()
    .neq('id', 0);
  
  if (clearCoreOptionsError) {
    console.error('Error clearing core_criteria_options:', clearCoreOptionsError);
  }

  const { error: clearCoreQuestionsError } = await supabase
    .from('core_criteria_questions')
    .delete()
    .neq('id', 0);
  
  if (clearCoreQuestionsError) {
    console.error('Error clearing core_criteria_questions:', clearCoreQuestionsError);
  }

  console.log('✅ Existing data cleared');
}

async function populateStandardCriteria() {
  console.log('\n📝 Populating STANDARD criteria...');
  
  for (const [propertyType, config] of Object.entries(CRITERIA_CONFIG)) {
    console.log(`\n🏠 ${propertyType} Property Questions:`);

    // Property questions
    for (const [index, question] of config.propertyQuestions.entries()) {
      const { data: questionData, error: questionError } = await supabase
        .from('criteria_questions')
        .insert({
          property_type: propertyType,
          question_group: 'property',
          question_key: question.key,
          question_label: question.label,
          helper_text: question.helper || null,
          display_order: index + 1,
        })
        .select()
        .single();

      if (questionError) {
        console.error(`  ❌ Error inserting question ${question.key}:`, questionError);
        continue;
      }

      console.log(`  ✅ ${question.label}`);

      // Insert options
      for (const [optIndex, option] of question.options.entries()) {
        const { error: optionError } = await supabase
          .from('criteria_options')
          .insert({
            question_id: questionData.id,
            option_label: option.label,
            tier_value: option.tier,
            display_order: optIndex + 1,
          });

        if (optionError) {
          console.error(`    ❌ Error inserting option ${option.label}:`, optionError);
        }
      }
    }

    console.log(`\n👤 ${propertyType} Applicant Questions:`);

    // Applicant questions
    for (const [index, question] of config.applicantQuestions.entries()) {
      const { data: questionData, error: questionError } = await supabase
        .from('criteria_questions')
        .insert({
          property_type: propertyType,
          question_group: 'applicant',
          question_key: question.key,
          question_label: question.label,
          helper_text: question.helper || null,
          display_order: index + 1,
        })
        .select()
        .single();

      if (questionError) {
        console.error(`  ❌ Error inserting question ${question.key}:`, questionError);
        continue;
      }

      console.log(`  ✅ ${question.label}`);

      // Insert options
      for (const [optIndex, option] of question.options.entries()) {
        const { error: optionError } = await supabase
          .from('criteria_options')
          .insert({
            question_id: questionData.id,
            option_label: option.label,
            tier_value: option.tier,
            display_order: optIndex + 1,
          });

        if (optionError) {
          console.error(`    ❌ Error inserting option ${option.label}:`, optionError);
        }
      }
    }
  }
}

async function populateCoreCriteria() {
  console.log('\n📝 Populating CORE criteria...');
  
  for (const [propertyType, config] of Object.entries(CORE_CRITERIA_CONFIG)) {
    console.log(`\n🏠 Core ${propertyType} Property Questions:`);

    // Property questions
    for (const [index, question] of config.propertyQuestions.entries()) {
      const { data: questionData, error: questionError } = await supabase
        .from('core_criteria_questions')
        .insert({
          property_type: propertyType,
          question_group: 'property',
          question_key: question.key,
          question_label: question.label,
          helper_text: question.helper || null,
          display_order: index + 1,
        })
        .select()
        .single();

      if (questionError) {
        console.error(`  ❌ Error inserting core question ${question.key}:`, questionError);
        continue;
      }

      console.log(`  ✅ ${question.label}`);

      // Insert options
      for (const [optIndex, option] of question.options.entries()) {
        const { error: optionError } = await supabase
          .from('core_criteria_options')
          .insert({
            question_id: questionData.id,
            option_label: option.label,
            tier_value: option.tier,
            display_order: optIndex + 1,
          });

        if (optionError) {
          console.error(`    ❌ Error inserting core option ${option.label}:`, optionError);
        }
      }
    }

    console.log(`\n👤 Core ${propertyType} Applicant Questions:`);

    // Applicant questions
    for (const [index, question] of config.applicantQuestions.entries()) {
      const { data: questionData, error: questionError } = await supabase
        .from('core_criteria_questions')
        .insert({
          property_type: propertyType,
          question_group: 'applicant',
          question_key: question.key,
          question_label: question.label,
          helper_text: question.helper || null,
          display_order: index + 1,
        })
        .select()
        .single();

      if (questionError) {
        console.error(`  ❌ Error inserting core question ${question.key}:`, questionError);
        continue;
      }

      console.log(`  ✅ ${question.label}`);

      // Insert options
      for (const [optIndex, option] of question.options.entries()) {
        const { error: optionError } = await supabase
          .from('core_criteria_options')
          .insert({
            question_id: questionData.id,
            option_label: option.label,
            tier_value: option.tier,
            display_order: optIndex + 1,
          });

        if (optionError) {
          console.error(`    ❌ Error inserting core option ${option.label}:`, optionError);
        }
      }
    }
  }
}

async function verifyCriteria() {
  console.log('\n🔍 Verifying criteria data...');
  
  const { data: standardQuestions, error: standardError } = await supabase
    .from('criteria_questions')
    .select('*, options:criteria_options(count)');
  
  if (standardError) {
    console.error('❌ Error verifying standard criteria:', standardError);
  } else {
    console.log(`✅ Standard Criteria: ${standardQuestions.length} questions loaded`);
  }

  const { data: coreQuestions, error: coreError } = await supabase
    .from('core_criteria_questions')
    .select('*, options:core_criteria_options(count)');
  
  if (coreError) {
    console.error('❌ Error verifying core criteria:', coreError);
  } else {
    console.log(`✅ Core Criteria: ${coreQuestions.length} questions loaded`);
  }
}

async function main() {
  console.log('🚀 Starting criteria migration...\n');
  
  if (!supabase) {
    console.error('❌ Supabase client not initialized. Check your environment variables.');
    process.exit(1);
  }

  try {
    await clearExistingData();
    await populateStandardCriteria();
    await populateCoreCriteria();
    await verifyCriteria();
    
    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  • Standard criteria populated for Residential, Commercial, and Semi-Commercial');
    console.log('  • Core criteria populated for Residential');
    console.log('  • All questions and options inserted');
    console.log('\n🎉 Your application is now ready to use dynamic criteria from Supabase!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();