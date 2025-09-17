import {create} from 'zustand';
import { apiClient } from '../api/apiClient'; // Assuming you use a central apiClient
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
    operatingHours: '',
    accreditation: '',
    labLogo: null, // To hold the file object
    isVerified: false, // Added for admin control
  },
  loading: false,
  error: null,

  // Action to update form data (handles text, number, and checkbox inputs)
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
      formData: { ...state.formData, [field]: value },
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
        isVerified: false, // Reset the verification status
      },
      loading: false,
      error: null,
    }),

  // Async action to create a new lab via API call
  createLab: async (formData) => {
    set({ loading: true, error: null });
    try {
      const postData = new FormData();

      // Append all fields. Send boolean as string 'true'/'false'.
      postData.append('labName', formData.labName);
      postData.append('email', formData.email);
      postData.append('phone', formData.phone);
      postData.append('address', JSON.stringify(formData.address));
      postData.append('servicesOffered', formData.servicesOffered);
      postData.append('operatingHours', formData.operatingHours);
      postData.append('accreditation', formData.accreditation);
      postData.append('isVerified', formData.isVerified ? 'true' : 'false');

      // Append the file only if it exists
      if (formData.labLogo) {
        postData.append('labLogo', formData.labLogo);
      }

      // Use your actual API endpoint
      const response = await apiClient.post('/api/admin/labs/create', postData, {
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