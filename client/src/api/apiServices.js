import API_ENDPOINTS from "./apiEndpoints";

// Helper function to handle the response
const handleResponse = async (response) => {
  const jsonResponse = await response.json();

  if (!response.ok) {
    const error = new Error(jsonResponse.message || "Something went wrong");
    error.status = response.status;
    throw error;
  }

  return jsonResponse;
};

// Generic function to perform fetch requests
// Update apiRequest function
const apiRequest = async (
  url,
  method,
  token,
  body = null,
  isFormData = false
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const jsonResponse = await handleResponse(response);

  // Handle 403 error and refresh token if necessary
  if (response.status === 403) {
    throw new Error("Token expired");
  }

  return jsonResponse;
};

// Fetch user profile
const fetchUserProfile = async (token) => {
  // console.log({ token });
  return apiRequest(API_ENDPOINTS.USERS.PROFILE, "GET", token);
};

// Complete user profile
const completeProfile = async (token, profileData) => {
  const body = { ...profileData, isProfileComplete: true };
  return apiRequest(API_ENDPOINTS.USERS.UPDATE_PROFILE, "PUT", token, body);
};

// Update profile picture
const updateProfilePicture = async (token, formData) => {
  // No need for 'Content-Type' here as we are sending FormData
  return apiRequest(
    API_ENDPOINTS.USERS.UPDATE_PROFILE_PIC,
    "PUT",
    token,
    formData,
    true
  );
};

// Refresh access token
const refreshAccessToken = async (refreshToken) => {
  const body = { refreshToken };
  const response = await apiRequest(
    API_ENDPOINTS.AUTH.REFRESH_TOKEN,
    "POST",
    null,
    body
  );
  // console.log(response);
  return response; // Expect { accessToken, refreshToken }
};

const uploadResource = async (token, formData) => {
  return apiRequest(
    API_ENDPOINTS.RESOURCES.UPLOAD,
    "POST",
    token,
    formData,
    true
  );
};

const fetchUserResources = async (token) => {
  return apiRequest(API_ENDPOINTS.RESOURCES.MY_RESOURCES, "GET", token);
};

const fetchAllTags = async (token) => {
  return apiRequest(API_ENDPOINTS.TAGS.BROWSE, "GET", token);
};

export {
  fetchUserProfile,
  completeProfile,
  updateProfilePicture,
  refreshAccessToken,
  uploadResource,
  fetchUserResources,
  fetchAllTags,
};
