const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `${API_BASE_URL}${imagePath}`;
};


export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


/**
 * Format ISO date string to DD-MM-YYYY HH:MM:SS format
 * @param {string} isoDate - ISO date string from backend
 * @returns {string} Formatted date time string
 */
export const formatDateTime = (isoDate) => {
  if (!isoDate) return "-";

  try {
    const date = new Date(isoDate);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "-";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
};