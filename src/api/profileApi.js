import httpClient from "../config/http/httpClient";
import { useAuthStore } from "../config/store/authStore";

export const getProfile = async () => {
  try {
    const { data } = await httpClient.get("/profile");

    if (data.success && data.user) {
      useAuthStore.getState().setUser(data.user);
    }

    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const formData = new FormData();

    if (profileData.name) {
      formData.append("name", profileData.name);
    }

    if (profileData.pic) {
      formData.append("pic", profileData.pic);
    }

    const { data } = await httpClient.put("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (data.success && data.user) {
      useAuthStore.getState().setUser(data.user);
    }

    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const updatePassword = async (passwordData) => {
  try {
    const { data } = await httpClient.put("/profile/password", passwordData);
    return data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append("pic", file);

    const { data } = await httpClient.put("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (data.success && data.user) {
      useAuthStore.getState().setUser(data.user);
    }

    return data;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

export const validateProfilePicture = (file) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  const maxSize = 5 * 1024 * 1024;

  if (!file) {
    throw new Error("No file selected");
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only image files (JPEG, PNG, GIF, WEBP) are allowed");
  }

  if (file.size > maxSize) {
    throw new Error("File size must be less than 5MB");
  }

  return true;
};