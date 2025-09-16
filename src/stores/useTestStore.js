// src/stores/useTestStore.js
import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const useTestStore = create((set) => ({
  // Initial state for the "Add Test" form
  formData: {
    testName: '',
    category: '',
    description: '',
    price: '',
    cptCode: '',
    sampleType: '',
    turnaroundTime: '',
    prerequisites: '', // e.g., "Fasting for 8 hours required"
  },
  loading: false,
  error: null,

  // Action to update any field in the form data
  setFormData: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  // Action to reset the form to its initial state
  resetForm: () =>
    set({
      formData: {
        testName: '',
        category: '',
        description: '',
        price: '',
        cptCode: '',
        sampleType: '',
        turnaroundTime: '',
        prerequisites: '',
      },
    }),

  // Async action to create a new test via an API call
  createTest: async (formData) => {
    set({ loading: true, error: null });
    try {
      // NOTE: Replace '/api/admin/tests' with your actual API endpoint
      const response = await axios.post('/api/admin/tests', formData);

      set({ loading: false });
      toast.success('Test created successfully!');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create test.';
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw err;
    }
  },
}));

export default useTestStore; 