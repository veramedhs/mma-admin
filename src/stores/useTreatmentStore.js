import { create } from 'zustand';
import toast from 'react-hot-toast';
import { apiClient } from '../api/apiClient';

// Helper function to convert comma-separated strings to a clean array
const stringToArray = (str) => {
  if (!str || typeof str !== 'string') return [];
  return str.split(',').map(item => item.trim()).filter(Boolean); // Trim whitespace and remove empty items
};

const initialState = {
  parentDisease: '',
  name: '',
  summary: '',
  price: 0,
  currency: 'USD',
  discountPercent: 0,
  heroImage: '',
  precautions: '', // Handled as comma-separated string in UI
  tests: '',       // Handled as comma-separated string in UI
  symptoms: '',    // Handled as comma-separated string in UI
  tags: '',        // Handled as comma-separated string in UI
  published: false,
};

const useTreatmentStore = create((set, get) => ({
  formData: initialState,
  loading: false,
  error: null,

  // ACTION: Update a field in the form data
  setFormData: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    }));
  },

  // ACTION: Reset the form to its initial state
  resetForm: () => {
    set({ formData: initialState });
  },

  // ACTION: Create a new treatment
  createTreatment: async () => {
    const formData = get().formData;
    set({ loading: true });

    // 1. Validate required fields
    if (!formData.parentDisease || !formData.name || formData.price === undefined) {
      const errorMsg = 'Parent Disease, Name, and Price are required.';
      toast.error(errorMsg);
      set({ loading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
    
    // 2. Prepare the payload for the API
    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPercent: Number(formData.discountPercent),
      precautions: stringToArray(formData.precautions),
      tests: stringToArray(formData.tests),
      symptoms: stringToArray(formData.symptoms),
      tags: stringToArray(formData.tags),
    };

    // 3. Make the API call
    try {
      const response = await apiClient.post('/api/treatments', payload);
      toast.success(response.data.message || 'Treatment created successfully!');
      set({ loading: false });
      get().resetForm(); // Reset the form on success
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create treatment.';
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw new Error(errorMessage); // Re-throw to be caught in the component if needed
    }
  },
}));

export default useTreatmentStore;