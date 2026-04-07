// Backend URL configuration
// In production (Vercel), we'll use the relative path /api if both are on same domain, 
// or an environment variable if they are separate.
const API_BASE_URL = process.env.REACT_APP_API_URL || 
                    (window.location.hostname === 'localhost' ? 'http://localhost:5002/api' : '/api');

export default API_BASE_URL;
