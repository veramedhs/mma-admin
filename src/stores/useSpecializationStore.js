import { create } from 'zustand';
import toast from 'react-hot-toast';
import { apiClient } from '../api/apiClient';

const useSpecializationStore = create((set, get) => ({
  specializations: [],
  loading: false,
  error: null,

  // ✅ FETCH all specializations
  fetchSpecializations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/api/specializations');
      set({ specializations: response.data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch specializations.';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  // ✅ CREATE a new specialization
  createSpecialization: async (name) => {
    set({ loading: true });
    try {
      const response = await apiClient.post('/api/specializations', { name });
      const newSpecialization = response.data.specialization;

      // Add the new item to the state without re-fetching
      set((state) => ({
        specializations: [...state.specializations, newSpecialization].sort((a, b) => a.name.localeCompare(b.name)),
        loading: false,
      }));
      toast.success(response.data.message || 'Specialization created successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create specialization.';
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw new Error(errorMessage); // Throw error to handle in component
    }
  },

  // ✅ UPDATE a specialization
  updateSpecialization: async (id, name) => {
    set({ loading: true });
    try {
      const response = await apiClient.patch(`/api/specializations/${id}`, { name });
      const updatedSpecialization = response.data.specialization;

      // Update the item in the state
      set((state) => ({
        specializations: state.specializations.map((spec) =>
          spec._id === id ? updatedSpecialization : spec
        ),
        loading: false,
      }));
      toast.success(response.data.message || 'Specialization updated!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update specialization.';
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // ✅ DELETE a specialization
  deleteSpecialization: async (id) => {
    set({ loading: true });
    try {
      const response = await apiClient.delete(`/api/specializations/${id}`);
      
      // Remove the item from the state
      set((state) => ({
        specializations: state.specializations.filter((spec) => spec._id !== id),
        loading: false,
      }));
      toast.success(response.data.message || 'Specialization deleted!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete specialization.';
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
    }
  },
}));

export default useSpecializationStore;