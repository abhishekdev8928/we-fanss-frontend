import httpClient from "../config/http/httpClient";


const extractErrorMessage = (error, defaultMessage) => {
  return error.response?.data?.message || defaultMessage;
};


/**
 * @route   POST /api/options/celebrities
 * @desc    Get celebrity options (id and label)
 * @access  Private
 * @param   {string[]} excludeList - Optional array of celebrity IDs to exclude
 */
export const getCelebrityOptions = async (excludeList = []) => {
  try {
    const { data } = await httpClient.post("/options/celebrities", {
      excludeList,
    });
    return data;
  } catch (error) {
    throw extractErrorMessage(error, "Failed to fetch celebrity options");
  }
};


/**
 * @route   POST /api/options/languages
 * @desc    Get language options (id and label)
 * @access  Private
 * @param   {string[]} excludeList - Optional array of language IDs to exclude
 */
export const getLanguageOptions = async (excludeList = []) => {
  try {
    const { data } = await httpClient.post("/options/languages", {
      excludeList,
    });
    return data;
  } catch (error) {
    throw extractErrorMessage(error, "Failed to fetch language options");
  }
};


/**
 * @route   POST /api/options/social-links
 * @desc    Get social link options (id and label)
 * @access  Private
 * @param   {string[]} excludeList - Optional array of social link IDs to exclude
 */
export const getSocialLinkOptions = async (excludeList = []) => {
  try {
    const { data } = await httpClient.post("/options/social-links", {
      excludeList,
    });
    return data;
  } catch (error) {
    throw extractErrorMessage(error, "Failed to fetch social link options");
  }
};


/**
 * @route   POST /api/options/trivia-types
 * @desc    Get trivia type options (id and label)
 * @access  Private
 * @param   {string[]} excludeList - Optional array of trivia type IDs to exclude
 */
export const getTriviaTypeOptions = async (excludeList = []) => {
  try {
    const { data } = await httpClient.post("/options/trivia-types", {
      excludeList,
    });
    return data;
  } catch (error) {
    throw extractErrorMessage(error, "Failed to fetch trivia type options");
  }
};


/**
 * @desc    Get relationship type options for Related Personalities
 * @returns {Array} Array of {id, label} objects
 */
export const getRelationshipTypeOptions = () => {
  return [
    { id: "Mentor", label: "Mentor" },
    { id: "Co-star", label: "Co-star" },
    { id: "Rival", label: "Rival" },
    { id: "Family", label: "Family" },
    { id: "Politically", label: "Politically" },
    { id: "Other", label: "Other" },
  ];
};