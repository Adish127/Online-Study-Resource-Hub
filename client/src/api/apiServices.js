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

    // console.log(response);
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
    const response = await fetch(API_ENDPOINTS.USERS.UPDATE_PROFILE, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Set Content-Type header
      },
      body: JSON.stringify({ ...profileData, isProfileComplete: true }), // Stringify the JSON body
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // return await response.json(); // Return the parsed JSON response
  } catch (error) {
    console.error("Failed to complete profile:", error);
    throw error;
  }
};

// Profile picture
const updateProfilePicture = async (token, formData) => {
  try {
    const response = await fetch(API_ENDPOINTS.USERS.UPDATE_PROFILE_PIC, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // Send the raw file data
    });

    return await response.json();
  } catch (error) {
    console.error("Failed to update profile picture:", error);
    throw error;
  }
};

export { fetchUserProfile, completeProfile, updateProfilePicture };
