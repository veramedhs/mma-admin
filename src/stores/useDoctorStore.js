// src/stores/useDoctorStore.js
import {create} from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const useDoctorStore = create((set) => ({
  formData: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
    qualifications: "",
    licenseNumber: "",
    yearsOfExperience: "",
    bio: "",
    consultationFee: "",
    languagesSpoken: "",
    clinicAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
    },
    profilePicture: null,
  },
  loading: false,
  error: null,

  // Update form data
  setFormData: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  // Handle clinic address changes
  setClinicAddress: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        clinicAddress: { ...state.formData.clinicAddress, [field]: value },
      },
    })),

  // Handle file input
  setProfilePicture: (file) =>
    set((state) => ({
      formData: { ...state.formData, profilePicture: file },
    })),

  // Reset form
  resetForm: () =>
    set({
      formData: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        specialization: "",
        qualifications: "",
        licenseNumber: "",
        yearsOfExperience: "",
        bio: "",
        consultationFee: "",
        languagesSpoken: "",
        clinicAddress: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
        },
        profilePicture: null,
      },
    }),

  // Create doctor action
  createDoctor: async (formData) => {
    set({ loading: true, error: null });
    try {
      const postData = new FormData();

      // Append all form fields to FormData
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        if (key === "profilePicture" && value) {
          postData.append("profilePicture", value);
        } else if (typeof value === "object" && value !== null) {
          postData.append(key, JSON.stringify(value));
        } else {
          postData.append(key, value);
        }
      });

      const response = await axios.post("/api/admin/doctors", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ loading: false });
      toast.success("Doctor created successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to create doctor.";
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw err;
    }
  },
}));

export default useDoctorStore;