import { supabase } from '../config/supabase';

/**
 * Fetch criteria configuration from Supabase
 */
export const fetchCriteriaConfig = async () => {
  try {
    // Fetch all questions with their options
    const { data: questions, error: questionsError } = await supabase
      .from('criteria_questions')
      .select(`
        *,
        options:criteria_options(*)
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (questionsError) throw questionsError;

    // Transform to the format expected by the app
    const config = {};

    questions.forEach(question => {
      if (!config[question.property_type]) {
        config[question.property_type] = {
          propertyQuestions: [],
          applicantQuestions: [],
        };
      }

      const formattedQuestion = {
        key: question.question_key,
        label: question.question_label,
        helper: question.helper_text,
        options: question.options
          .sort((a, b) => a.display_order - b.display_order)
          .map(opt => ({
            label: opt.option_label,
            tier: opt.tier_value,
          })),
      };

      if (question.question_group === 'property') {
        config[question.property_type].propertyQuestions.push(formattedQuestion);
      } else {
        config[question.property_type].applicantQuestions.push(formattedQuestion);
      }
    });

    return config;
  } catch (error) {
    console.error('Error fetching criteria config:', error);
    throw error;
  }
};

/**
 * Fetch Core criteria configuration from Supabase
 */
export const fetchCoreCriteriaConfig = async () => {
  try {
    const { data: questions, error: questionsError } = await supabase
      .from('core_criteria_questions')
      .select(`
        *,
        options:core_criteria_options(*)
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (questionsError) throw questionsError;

    const config = {};

    questions.forEach(question => {
      if (!config[question.property_type]) {
        config[question.property_type] = {
          propertyQuestions: [],
          applicantQuestions: [],
        };
      }

      const formattedQuestion = {
        key: question.question_key,
        label: question.question_label,
        helper: question.helper_text,
        options: question.options
          .sort((a, b) => a.display_order - b.display_order)
          .map(opt => ({
            label: opt.option_label,
            tier: opt.tier_value,
          })),
      };

      if (question.question_group === 'property') {
        config[question.property_type].propertyQuestions.push(formattedQuestion);
      } else {
        config[question.property_type].applicantQuestions.push(formattedQuestion);
      }
    });

    return config;
  } catch (error) {
    console.error('Error fetching core criteria config:', error);
    throw error;
  }
};