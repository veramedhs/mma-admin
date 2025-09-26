import { create } from 'zustand';
import { apiClient } from '../api/apiClient';

const useDoctorStore = create((set) => ({
  loading: false,
  error: null,

  createDoctorProfile: async (formData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post("/api/new-doctors", formData);

      set({ loading: false });
      return response.data; 
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));

export default useDoctorStore;