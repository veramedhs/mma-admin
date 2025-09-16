// src/stores/useLabStore.js
import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const useLabStore = create((set) => ({
  // Initial state for the lab form
  formData: {
    labName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
    },
    servicesOffered: '', // Will be sent as a comma-separated string
    operatingHours: '', // e.g., "Mon-Fri 9:00 AM - 5:00 PM"
    accreditation: '',
    labLogo: null, // To hold the file object
  },
  loading: false,
  error: null,

  // Action to update form data
  setFormData: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  // Action to update the nested address object
  setAddress: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        address: { ...state.formData.address, [field]: value },
      },
    })),

  // Action to handle the logo file input
  setLabLogo: (file) =>
    set((state) => ({
      formData: { ...state.formData, labLogo: file },
    })),

  // Action to reset the form to its initial state
  resetForm: () =>
    set({
      formData: {
        labName: '',
        email: '',
        phone: '',
        address: { street: '', city: '', state: '', postalCode: '' },
        servicesOffered: '',
        operatingHours: '',
        accreditation: '',
        labLogo: null,
      },
    }),

  // Async action to create a new lab via API call
  createLab: async (formData) => {
    set({ loading: true, error: null });
    try {
      const postData = new FormData();

      // Append all form fields to the FormData object
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        if (key === 'labLogo' && value) {
          postData.append('labLogo', value); // Append the file
        } else if (typeof value === 'object' && value !== null) {
          postData.append(key, JSON.stringify(value)); // Stringify the address object
        } else if (value) {
          postData.append(key, value);
        }
      });

      // NOTE: Replace with your actual API endpoint for creating a lab
      const response = await axios.post('/api/admin/labs', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set({ loading: false });
      toast.success('Lab created successfully!');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create lab.';
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw err;
    }
  },
}));

export default useLabStore;