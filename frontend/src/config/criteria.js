// Criteria configuration for product tiers and questions.
//
// This file extends the existing Buy‑to‑Let (BTL) criteria with
// additional sections for Bridge and Fusion products.  The BTL sections
// (Residential, Commercial, Semi‑Commercial) are unchanged from the
// upstream SalesforceCalc repository.  New sections for Bridge and
// Fusion introduce product‑specific questions such as charge type,
// applicant type, multi‑property loans and sub‑product types.  These
// questions allow the UI to dynamically present the correct inputs
// when a user selects a Bridge or Fusion product in the Product Setup.

export const CRITERIA_CONFIG = {
  // Existing BTL sections (Residential, Commercial and Semi‑Commercial)
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
  // Semi‑Commercial shares the same criteria as Commercial
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
  // Bridge & Fusion product criteria.  These questions are shown when the
  // main product type is set to "Bridge & Fusion" in the ProductSetup.
  // Because Bridge and Fusion are now considered a single product,
  // the questions consolidate aspects of both.  Applicants choose the
  // charge type (first vs second), indicate whether the loan covers
  // multiple properties, and select a sub‑product type.  The sub‑product
  // list includes all residential and commercial bridge options as
  // well as high‑level Fusion property categories.  Applicant type
  // differentiates personal from corporate borrowers.
  "Bridge & Fusion": {
    propertyQuestions: [
      {
        key: "chargeType",
        label: "Charge Type",
        options: [
          { label: "First Charge", tier: 1 },
          { label: "2nd Charge", tier: 2 },
        ],
      },
      {
        key: "multiPropertyLoan",
        label: "Multi Property Loan",
        options: [
          { label: "No", tier: 1 },
          { label: "Yes", tier: 2 },
        ],
      },
      {
        key: "subProductType",
        label: "Sub Product Type",
        // Each sub‑product option includes a propertyType attribute so the UI
        // can filter the list based on the selected property type.  For
        // example, when the property type is Residential the user will only
        // see residential bridge options; when it is Commercial or
        // Semi‑Commercial they will see commercial bridge options.  Dev
        // Exit and Permitted/Light Dev are available to both categories.
        options: [
          // Residential bridge sub‑products
          { label: "Resi BTL single unit", tier: 1, propertyType: "Residential" },
          { label: "Resi Large Loan", tier: 1, propertyType: "Residential" },
          { label: "Resi Portfolio", tier: 1, propertyType: "Residential" },
          { label: "Dev Exit", tier: 1, propertyType: "Residential" },
          { label: "Permitted/Light Dev", tier: 1, propertyType: "Residential" },
          // Commercial and Semi‑Commercial bridge sub‑products
          { label: "Semi & Full Commercial", tier: 1, propertyType: "Commercial" },
          { label: "Semi & Full Commercial Large Loan", tier: 1, propertyType: "Commercial" },
          { label: "Dev Exit", tier: 1, propertyType: "Commercial" },
          { label: "Permitted/Light Dev", tier: 1, propertyType: "Commercial" },
        ],
      },
    ],
    applicantQuestions: [
      {
        key: "applicantType",
        label: "Applicant Type",
        options: [
          { label: "Personal", tier: 1 },
          { label: "Corporate", tier: 1 },
        ],
      },
    ],
  },
};

// Core criteria remain unchanged.  These are used for the BTL core
// product set and do not currently apply to Bridge or Fusion.  If
// needed, similar sections can be added here for Bridge/Fusion core.
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

// Maximum loan‑to‑value rules used for display and validation.
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