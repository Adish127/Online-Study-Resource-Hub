import API_ENDPOINTS from "./apiEndpoints";

// All the API services
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

// Fetch user profile
const fetchUserProfile = async (token) => {
  try {
    const response = await fetch(API_ENDPOINTS.USERS.PROFILE, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const profileData = await response.json();
      return profileData;
    } else {
      throw new Error("Failed to fetch user profile");
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};

// Complete profile
const completeProfile = async (token, profileData) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.COMPLETE_PROFILE, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    return response;
  } catch (error) {
    console.error("Failed to complete profile:", error);
    throw error;
  }
};

export { fetchUserProfile, completeProfile };
