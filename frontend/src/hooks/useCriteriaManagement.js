// Custom hook to manage criteria selection for different product and property types.
//
// This hook extends the original BTL criteria management to support
// the combined Bridge & Fusion product.  It exposes the current
// criteria answers, functions to update them, and helpers to derive
// the overall tier and core‑criteria compliance.  When the selected
// product is "Bridge & Fusion" the hook returns the questions under
// the "Bridge & Fusion" key from the provided criteria configuration.
// Otherwise it falls back to the normal Residential, Commercial and
// Semi‑Commercial branches based on the property type.

import { useState, useEffect, useCallback } from "react";
// Import the local criteria definitions as a fallback.  The dynamic
// criteria fetched from Supabase may not include a Bridge & Fusion
// section, so we merge in the local configuration when necessary.
import { CRITERIA_CONFIG as LOCAL_CRITERIA_CONFIG } from "../config/criteria";

/**
 * Determine the maximum tier from an array of selected answers.  The
 * questions in the criteria configuration carry a `tier` value on
 * each option; the maximum tier across all selected answers becomes
 * the overall tier for the case.
 *
 * @param {object} criteriaAnswers The current answers keyed by question key.
 * @param {object} currentCriteria The criteria definition containing property
 *   and applicant questions.
 * @returns {number} The highest tier among the selected answers.
 */
function calculateOverallTier(criteriaAnswers = {}, currentCriteria) {
  let maxTier = 1;
  // If there is no criteria definition, default to Tier 1
  if (!currentCriteria) return maxTier;
  // Flatten property and applicant questions into a single array
  const allQuestions = [
    ...(currentCriteria.propertyQuestions || []),
    ...(currentCriteria.applicantQuestions || []),
  ];
  allQuestions.forEach((question) => {
    if (!question || !question.key) return;
    // Read the user's answer; guard against undefined criteriaAnswers
    const answer = criteriaAnswers ? criteriaAnswers[question.key] : undefined;
    if (!answer) return;
    // Find the tier for the selected answer label
    const option = question.options && question.options.find((o) => o.label === answer);
    if (option && option.tier && option.tier > maxTier) {
      maxTier = option.tier;
    }
  });
  return maxTier;
}

/**
 * Determine whether the current answers fall within the core criteria
 * configuration.  Core criteria defines the most conservative tier
 * limits allowed without requiring referral.  This helper returns
 * true if all selected answers are present in the core criteria for
 * the current property type and false otherwise.
 *
 * @param {object} criteriaAnswers The current answers keyed by question key.
 * @param {string} propertyType The selected property type.
 * @param {object} coreCriteriaConfig The core criteria configuration.
 * @returns {boolean} True if all answers are allowed in core criteria.
 */
function checkWithinCoreCriteria(
  criteriaAnswers = {},
  propertyType,
  coreCriteriaConfig
) {
  const core = coreCriteriaConfig && coreCriteriaConfig[propertyType];
  if (!core) return true;
  const allCoreQuestions = [
    ...(core.propertyQuestions || []),
    ...(core.applicantQuestions || []),
  ];
  return Object.entries(criteriaAnswers || {}).every(([key, answer]) => {
    const coreQuestion = allCoreQuestions.find((q) => q.key === key);
    if (!coreQuestion) {
      // No restriction in core criteria for this question
      return true;
    }
    // Answer must exist in core options; otherwise it's outside core
    return coreQuestion.options.some((o) => o.label === answer);
  });
}

/**
 * Initialize answers for a given criteria definition.  Each property and
 * applicant question will be set to the first option's label by default.
 *
 * @param {object} currentCriteria The criteria definition.
 * @returns {object} A map of question keys to default answer labels.
 */
function initializeAnswers(currentCriteria) {
  const answers = {};
  if (!currentCriteria) return answers;
  const allQuestions = [
    ...(currentCriteria.propertyQuestions || []),
    ...(currentCriteria.applicantQuestions || []),
  ];
  allQuestions.forEach((question) => {
    const defaultOption = question.options && question.options[0];
    if (defaultOption) {
      answers[question.key] = defaultOption.label;
    }
  });
  return answers;
}

/**
 * Hook for managing criteria answers and tier calculations.  Pass in
 * the selected property type and product type as well as the criteria
 * configuration objects.  The hook will automatically update the
 * criteria definition when either the property or product type changes.
 *
 * @param {string} propertyType The selected property type (e.g. Residential).
 * @param {string} productType The selected main product type (e.g. BTL or Bridge & Fusion).
 * @param {object} criteriaConfig The full criteria configuration.
 * @param {object} coreCriteriaConfig The core criteria configuration.
 */
export function useCriteriaManagement(
  propertyType,
  productType,
  criteriaConfig,
  coreCriteriaConfig
) {
  const [criteria, setCriteria] = useState({});
  const [tier, setTier] = useState(1);
  const [currentCriteria, setCurrentCriteria] = useState(null);
  const [withinCore, setWithinCore] = useState(true);

  /**
   * Compute the criteria definition based on product and property type.  If
   * the product is Bridge & Fusion we return that criteria directly.
   * Otherwise, fall back to the property type keys (Residential,
   * Commercial, Semi-Commercial).
   */
  const determineCurrentCriteria = useCallback(() => {
    // If no dynamic config is provided, fall back entirely to the local configuration.
    if (!criteriaConfig) {
      if (
        productType === "Bridge & Fusion"
      ) {
        return LOCAL_CRITERIA_CONFIG["Bridge & Fusion"] || null;
      }
      // fallback for property-based products
      const localByType = LOCAL_CRITERIA_CONFIG[propertyType];
      if (localByType) return localByType;
      return LOCAL_CRITERIA_CONFIG["Residential"] || null;
    }
    // When the main product type is Bridge, Fusion or the combined Bridge & Fusion
    // return that criteria section.  This allows us to treat "Bridge" and
    // "Fusion" as aliases for the combined Bridge & Fusion product when
    // selecting criteria, while leaving the original mainProductType value
    // untouched in other parts of the app.
    if (
      productType === "Bridge" ||
      productType === "Fusion" ||
      productType === "Bridge & Fusion"
    ) {
      // Always prioritise the local Bridge & Fusion configuration.  This
      // ensures the sub‑product options include a propertyType field
      // for filtering.  If the local config is missing, fall back
      // to the dynamic config.
      const localBridge = LOCAL_CRITERIA_CONFIG["Bridge & Fusion"];
      if (localBridge) return localBridge;
      return criteriaConfig["Bridge & Fusion"] || null;
    }
    // Otherwise, choose the criteria based on property type.  Fall back
    // to Residential if no exact match is found.
    const configByType = criteriaConfig[propertyType] || null;
    if (configByType) return configByType;
    // Fall back to local configuration if dynamic config lacks the property type.
    return (
      criteriaConfig["Residential"] ||
      LOCAL_CRITERIA_CONFIG[propertyType] ||
      LOCAL_CRITERIA_CONFIG["Residential"] ||
      null
    );
  }, [productType, propertyType, criteriaConfig]);

  // Update the current criteria whenever product or property type changes
  useEffect(() => {
    const cc = determineCurrentCriteria();
    // Filter sub‑product options based on the selected property type when
    // using the Bridge & Fusion product.  The subProductType question
    // includes a propertyType attribute on each option.  Only show
    // residential options when the property type is Residential; otherwise
    // show commercial/semi‑commercial options.  Dev Exit and
    // Permitted/Light Dev appear in both categories and will be included
    // accordingly.
    let filteredCriteria = cc;
    if (
      cc &&
      (productType === "Bridge" ||
        productType === "Fusion" ||
        productType === "Bridge & Fusion")
    ) {
      const propertyCategory =
        propertyType === "Residential" ? "Residential" : "Commercial";
      filteredCriteria = {
        ...cc,
        propertyQuestions: (cc.propertyQuestions || []).map((question) => {
          if (question.key !== "subProductType") return question;
          // Filter options by the propertyType attribute; if no propertyType
          // attribute is provided on an option, it will be shown regardless.
          const newOptions = (question.options || []).filter((opt) => {
            if (!opt.propertyType) return true;
            return opt.propertyType === propertyCategory;
          });
          return { ...question, options: newOptions };
        }),
      };
    }
    setCurrentCriteria(filteredCriteria);
    // Reset answers to defaults when switching criteria
    const initial = initializeAnswers(filteredCriteria);
    setCriteria(initial);
  }, [determineCurrentCriteria]);

  // Recalculate tier and core compliance whenever answers change
  useEffect(() => {
    const t = calculateOverallTier(criteria, currentCriteria);
    setTier(t);
    const coreOk = checkWithinCoreCriteria(
      criteria,
      productType === "Bridge & Fusion" ? "Residential" : propertyType,
      coreCriteriaConfig
    );
    setWithinCore(coreOk);
  }, [criteria, currentCriteria, propertyType, productType, coreCriteriaConfig]);

  /**
   * Expose helpers and state to consumers.  `isWithinCoreCriteria` and
   * `initializeCriteriaState` mirror the original hook API used in
   * SalesforceCalc.  The overall tier is returned as a string (e.g.
   * "Tier 1", "Tier 2", etc.).
   */
  const isWithinCoreCriteria = useCallback(() => {
    return withinCore;
  }, [withinCore]);

  const initializeCriteriaState = useCallback(() => {
    const cc = determineCurrentCriteria();
    const initial = initializeAnswers(cc);
    setCriteria(initial);
  }, [determineCurrentCriteria]);

  return {
    criteria,
    setCriteria,
    tier: `Tier ${tier}`,
    getCurrentCriteria: determineCurrentCriteria,
    isWithinCoreCriteria,
    initializeCriteriaState,
  };
}