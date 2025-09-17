import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

// Helper function to simulate a network delay (optional)
// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const useLabListStore = create((set, get) => ({
  labs: [],
  loading: true,
  error: null,

  // Action to fetch all labs from the API
  fetchLabs: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate delay if needed
      // await sleep(1000);

      const response = await axios.get('/api/admin/labs');

      // Ensure labs is always an array
      const labsData = Array.isArray(response.data) ? response.data : [];
      
      set({ labs: labsData, loading: false });
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch labs.';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  // Action to delete a lab
  deleteLab: async (labId) => {
    const originalLabs = get().labs;
    
    // Optimistic update
    set((state) => ({
      labs: state.labs.filter((lab) => lab._id !== labId),
    }));

    try {
      await axios.delete(`/api/admin/labs/${labId}`);
      toast.success('Lab deleted successfully.');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete lab.';
      toast.error(errorMessage);

      // Revert back to original labs on failure
      set({ labs: originalLabs });
    }
  },
}));

export default useLabListStore;
