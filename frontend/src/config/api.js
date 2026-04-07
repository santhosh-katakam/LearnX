// Backend URL configuration
// Using /_/backend prefix as defined in experimentalServices vercel.json
const API_BASE_URL = process.env.REACT_APP_API_URL || 
                    (window.location.hostname === 'localhost' ? 'http://localhost:5002/api' : '/_/backend/api');

export default API_BASE_URL;
