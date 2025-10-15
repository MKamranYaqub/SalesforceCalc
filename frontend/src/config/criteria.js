export const CRITERIA_CONFIG = {
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
    // NEW: Semi-Commercial uses same criteria as Commercial
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
  
  export const CORE_CRITERIA_CONFIG = {
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
  
  export const MAX_LTV_RULES = {
    default: {
      Residential: 75,
      Commercial: 70,
      "Semi-Commercial": 70,
    },
    retention: {
      Residential: { 75: 75, 65: 65 },
      Commercial: { 75: 70, 65: 65 },
      "Semi-Commercial": { 75: 70, 65: 65 },
    },
    flatAboveCommOverrides: {
      "Tier 2": 60,
      "Tier 3": 70,
    },
  };