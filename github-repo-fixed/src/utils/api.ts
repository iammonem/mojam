import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Main Meanings API
export const getMainMeanings = async (letter = '') => {
  try {
    const response = await axios.get(`${API_URL}/meanings${letter ? `?letter=${letter}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching main meanings:', error);
    throw error;
  }
};

export const getMainMeaningById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/meanings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching main meaning:', error);
    throw error;
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
    console.error('Error updating main meaning:', error);
    throw error;
  }
};

export const deleteMainMeaning = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/meanings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting main meaning:', error);
    throw error;
  }
};

// Sub Meanings API
export const getSubMeanings = async (mainMeaningId = '') => {
  try {
    const response = await axios.get(`${API_URL}/submeanings${mainMeaningId ? `?mainMeaning=${mainMeaningId}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sub meanings:', error);
    throw error;
  }
};

export const getSubMeaningById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/submeanings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sub meaning:', error);
    throw error;
  }
};

export const createSubMeaning = async (meaningData) => {
  try {
    const response = await axios.post(`${API_URL}/submeanings`, meaningData);
    return response.data;
  } catch (error) {
    console.error('Error creating sub meaning:', error);
    throw error;
  }
};

export const updateSubMeaning = async (id, meaningData) => {
  try {
    const response = await axios.put(`${API_URL}/submeanings/${id}`, meaningData);
    return response.data;
  } catch (error) {
    console.error('Error updating sub meaning:', error);
    throw error;
  }
};

export const deleteSubMeaning = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/submeanings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting sub meaning:', error);
    throw error;
  }
};

// References API
export const getReferences = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.mainMeaning) queryParams.append('mainMeaning', params.mainMeaning);
    if (params.subMeaning) queryParams.append('subMeaning', params.subMeaning);
    if (params.type) queryParams.append('type', params.type);
    
    const queryString = queryParams.toString();
    const response = await axios.get(`${API_URL}/references${queryString ? `?${queryString}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching references:', error);
    throw error;
  }
};

export const getReferenceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/references/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reference:', error);
    throw error;
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
    console.error('Error updating reference:', error);
    throw error;
  }
};

export const deleteReference = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/references/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting reference:', error);
    throw error;
  }
};

export const likeReference = async (id, action) => {
  try {
    const response = await axios.put(`${API_URL}/references/${id}/like`, { action });
    return response.data;
  } catch (error) {
    console.error('Error liking/disliking reference:', error);
    throw error;
  }
};

export const addComment = async (referenceId, commentData) => {
  try {
    const response = await axios.post(`${API_URL}/references/${referenceId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const addReply = async (referenceId, commentId, replyData) => {
  try {
    const response = await axios.post(`${API_URL}/references/${referenceId}/comments/${commentId}/replies`, replyData);
    return response.data;
  } catch (error) {
    console.error('Error adding reply:', error);
    throw error;
  }
};

export const searchReferences = async (query, type = '') => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('query', query);
    if (type) queryParams.append('type', type);
    
    const response = await axios.get(`${API_URL}/references/search?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error searching references:', error);
    throw error;
  }
};
