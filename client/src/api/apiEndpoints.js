// File that has all the API endpoints
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const API_ENDPOINTS = {
  AUTH: {
    GOOGLE: `${BASE_URL}/auth/google`,
    GOOGLE_CALLBACK: `${BASE_URL}/auth/google/callback`,
    // LOGIN: `${BASE_URL}/auth/login`,
    // REGISTER: `${BASE_URL}/auth/register`,
    COMPLETE_PROFILE: `${BASE_URL}/auth/register/complete-profile`,
    REFRESH_TOKEN: `${BASE_URL}/auth/refresh-token`,
  },
  USERS: {
    PROFILE: `${BASE_URL}/v2/users/profile`,
    UPDATE_PROFILE: `${BASE_URL}/v2/users/profile/update`,
    UPDATE_PROFILE_PIC: `${BASE_URL}/v2/users/profile/updatepic`,

    // Admin
    USERS: `${BASE_URL}/v2/users`,
    USER: (id) => `${BASE_URL}/v2/users/${id}`,
  },
  RESOURCES: {
    MY_RESOURCES: `${BASE_URL}/v2/resources/my-resources`,
    BROWSE: `${BASE_URL}/v2/resources/browse`,
    UPLOAD: `${BASE_URL}/v2/resources/upload`,
    UPDATE: (id) => `${BASE_URL}/v2/resources/update/${id}`,
    DELETE: (id) => `${BASE_URL}/v2/resources/delete/${id}`,
    SEARCH: `${BASE_URL}/v2/resources/search`,
    UPDATE_ACCESS: (id) => `${BASE_URL}/v2/resources/update-access/${id}`,
    LIKE: (id) => `${BASE_URL}/v2/resources/like/${id}`,
    VIEW: (id) => `${BASE_URL}/v2/resources/view/${id}`,
    // Admin
    RESOURCES: `${BASE_URL}/v2/resources`,
    RESOURCE: (id) => `${BASE_URL}/v2/resources/${id}`,
  },
  TAGS: {
    BROWSE: `${BASE_URL}/v2/tags/browse`,
    CREATE: `${BASE_URL}/v2/tags/create`,
    ASSIGN: (type, id) => `${BASE_URL}/v2/tags/assign/${type}/${id}`,
    REMOVE: (type, id) => `${BASE_URL}/v2/tags/remove/${type}/${id}`,

    // Admin
    TAG: (id) => `${BASE_URL}/v2/tags/${id}`,
  },
  COMMENTS: {
    ADD: (id) => `${BASE_URL}/v2/comments/${id}`,
    DISPLAY: (id) => `${BASE_URL}/v2/comments/${id}`,
    DELETE: (id) => `${BASE_URL}/v2/comments/delete/${id}`,
  },
};

export default API_ENDPOINTS;
