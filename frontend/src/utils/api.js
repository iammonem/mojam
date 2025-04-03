import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Main Meanings
export const getMainMeanings = async () => {
  try {
    const response = await axios.get(`${API_URL}/meanings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching main meanings:', error);
    return [];
  }
};

export const getMainMeaningsByLetter = async (letter) => {
  try {
    const response = await axios.get(`${API_URL}/meanings/letter/${letter}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching main meanings for letter ${letter}:`, error);
    return [];
  }
};

export const getMainMeaningById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/meanings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching main meaning with id ${id}:`, error);
    return null;
  }
};

export const createMainMeaning = async (meaningData) => {
  try {
    const response = await axios.post(`${API_URL}/meanings`, meaningData);
    return response.data;
  } catch (error) {
    console.error('Error creating main meaning:', error);
    throw error;
  }
};

export const updateMainMeaning = async (id, meaningData) => {
  try {
    const response = await axios.put(`${API_URL}/meanings/${id}`, meaningData);
    return response.data;
  } catch (error) {
    console.error(`Error updating main meaning with id ${id}:`, error);
    throw error;
  }
};

export const deleteMainMeaning = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/meanings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting main meaning with id ${id}:`, error);
    throw error;
  }
};

// Sub Meanings
export const getSubMeanings = async (mainMeaningId) => {
  try {
    const response = await axios.get(`${API_URL}/submeanings/main/${mainMeaningId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sub meanings for main meaning ${mainMeaningId}:`, error);
    return [];
  }
};

export const getSubMeaningById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/submeanings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sub meaning with id ${id}:`, error);
    return null;
  }
};

export const createSubMeaning = async (subMeaningData) => {
  try {
    const response = await axios.post(`${API_URL}/submeanings`, subMeaningData);
    return response.data;
  } catch (error) {
    console.error('Error creating sub meaning:', error);
    throw error;
  }
};

export const updateSubMeaning = async (id, subMeaningData) => {
  try {
    const response = await axios.put(`${API_URL}/submeanings/${id}`, subMeaningData);
    return response.data;
  } catch (error) {
    console.error(`Error updating sub meaning with id ${id}:`, error);
    throw error;
  }
};

export const deleteSubMeaning = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/submeanings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting sub meaning with id ${id}:`, error);
    throw error;
  }
};

// References
export const getReferences = async (subMeaningId) => {
  try {
    const response = await axios.get(`${API_URL}/references/submeaning/${subMeaningId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching references for sub meaning ${subMeaningId}:`, error);
    return [];
  }
};

export const getReferenceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/references/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reference with id ${id}:`, error);
    return null;
  }
};

export const createReference = async (referenceData) => {
  try {
    const response = await axios.post(`${API_URL}/references`, referenceData);
    return response.data;
  } catch (error) {
    console.error('Error creating reference:', error);
    throw error;
  }
};

export const updateReference = async (id, referenceData) => {
  try {
    const response = await axios.put(`${API_URL}/references/${id}`, referenceData);
    return response.data;
  } catch (error) {
    console.error(`Error updating reference with id ${id}:`, error);
    throw error;
  }
};

export const deleteReference = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/references/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting reference with id ${id}:`, error);
    throw error;
  }
};

export const likeReference = async (id, like) => {
  try {
    const response = await axios.put(`${API_URL}/references/${id}/like`, { like });
    return response.data;
  } catch (error) {
    console.error(`Error liking reference with id ${id}:`, error);
    throw error;
  }
};

export const addComment = async (referenceId, commentData) => {
  try {
    const response = await axios.post(`${API_URL}/references/${referenceId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error(`Error adding comment to reference ${referenceId}:`, error);
    throw error;
  }
};

export const addReply = async (referenceId, commentId, replyData) => {
  try {
    const response = await axios.post(`${API_URL}/references/${referenceId}/comments/${commentId}/replies`, replyData);
    return response.data;
  } catch (error) {
    console.error(`Error adding reply to comment ${commentId}:`, error);
    throw error;
  }
};

export const searchReferences = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/references/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching references with query ${query}:`, error);
    return [];
  }
};
