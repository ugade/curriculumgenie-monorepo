import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export const generateDocument = async (prompt) => {
  try {
    const res = await axios.post(`${API_BASE}/api/generate`, { prompt });
    return res.data.output;
  } catch (e) {
    return 'Error generating document';
  }
};