import { create } from 'zustand';
import toast from 'react-hot-toast';
import { apiClient } from '../api/apiClient'; // Ensure this path is correct for your project

// Helper: normalize values that may be arrays or comma-separated strings into arrays
const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

const initialState = {
  parentDisease: '',
  name: '',
  summary: '',
  price: '',
  minPrice: '',
  maxPrice: '',
  currency: 'USD',
  discountPercent: '',
  heroImage: '',
  precautions: '',
  tests: '',
  symptoms: '',
  tags: '',
  published: false,
};

const useTreatmentStore = create((set, get) => ({
  formData: initialState,
  treatments: [],
  loading: false,
  error: null,

  setFormData: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    }));
  },

  resetForm: () => {
    set({ formData: initialState, error: null });
  },

  fetchTreatments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/api/treatments/admin/treatments');
      set({ treatments: response.data.data || [], loading: false });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch treatments.';
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw err;
    }
  },

  // ✅ FETCHTREATMENTBYID (FIXED)
  fetchTreatmentById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/treatments/${id}`);
      const treatment = response.data.data;

      if (treatment) {
        set({
          formData: {
            // Correctly handles the populated parentDisease object
            parentDisease: treatment.parentDisease?._id || '',
            name: treatment.name || '',
            summary: treatment.summary || '',
            price: treatment.price || '',
            minPrice: treatment.minPrice || '',
            maxPrice: treatment.maxPrice || '',
            currency: treatment.currency || 'USD',
            discountPercent: treatment.discountPercent || '',
            heroImage: treatment.heroImage || '',
            // ✅ FIX: Convert arrays from the backend into comma-separated strings for form inputs
            precautions: (treatment.precautions || []).join(', '),
            tests: (treatment.tests || []).join(', '),
            symptoms: (treatment.symptoms || []).join(', '),
            tags: (treatment.tags || []).join(', '),
            published: treatment.published || false,
          },
          loading: false,
        });
      }
      return treatment;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch treatment details.';
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw err;
    }
  },

  createTreatment: async () => {
    const data = get().formData;
    set({ loading: true, error: null });

    if (!data.parentDisease || !data.name || !data.price || !data.minPrice) {
      const errorMsg = 'Parent Disease, Name, Price, and Min Price are required.';
      toast.error(errorMsg);
      set({ loading: false, error: errorMsg });
      throw new Error(errorMsg);
    }

    if (!data.heroImage || !(data.heroImage instanceof File)) {
      const errorMsg = 'A hero image (featuredImage) file is required for creation.';
      toast.error(errorMsg);
      set({ loading: false, error: errorMsg });
      throw new Error(errorMsg);
    }

    try {
      const formData = new FormData();
      formData.append('parentDisease', data.parentDisease);
      formData.append('name', data.name);
      if (data.summary) formData.append('summary', data.summary);

      formData.append('price', String(data.price));
      formData.append('minPrice', String(data.minPrice));
      formData.append('maxPrice', String(data.maxPrice || ''));

      formData.append('currency', data.currency || 'USD');
      formData.append('discountPercent', String(data.discountPercent || ''));
      formData.append('precautions', JSON.stringify(toArray(data.precautions)));
      formData.append('tests', JSON.stringify(toArray(data.tests)));
      formData.append('symptoms', JSON.stringify(toArray(data.symptoms)));
      formData.append('tags', JSON.stringify(toArray(data.tags)));
      formData.append('published', data.published ? 'true' : 'false');
      formData.append('featuredImage', data.heroImage);

      const response = await apiClient.post('/api/treatments', formData);

      toast.success(response.data?.message || 'Treatment created successfully!');
      set((state) => ({
        treatments: [...state.treatments, response.data.data],
        loading: false,
      }));
      get().resetForm();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to create treatment.';
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw err;
    }
  },

  updateTreatment: async (id, formDataFromComponent) => {
    set({ loading: true, error: null });

    const hasNewImageFile = formDataFromComponent.heroImage instanceof File;
    let payload;
    let config = {};

    if (hasNewImageFile) {
      // --- Case 1: Sending FormData because a new file is present ---
      payload = new FormData();
      config = { headers: { 'Content-Type': 'multipart/form-data' } };

      Object.keys(formDataFromComponent).forEach(key => {
        const value = formDataFromComponent[key];
        
        if (key === 'heroImage') {
          // The backend expects the file under the 'featuredImage' key
          payload.append('featuredImage', value);
        } else if (value !== null && value !== undefined) {
          // For ALL other fields (including arrays-as-strings like 'precautions'),
          // send them as plain strings. The backend is designed to parse them.
          // e.g., 'precautions' will be sent as "Symptom 1, Symptom 2"
          payload.append(key, String(value));
        }
      });

    } else {
      // --- Case 2: Sending JSON because there's no new file ---
      config = { headers: { 'Content-Type': 'application/json' } };
      
      // Create a clean data object for the JSON payload
      const jsonData = { ...formDataFromComponent };

      // The backend expects a real array for array-like fields when receiving JSON.
      // The `toArray` helper converts "item1, item2" into `['item1', 'item2']`.
      ['precautions', 'tests', 'symptoms', 'tags'].forEach(field => {
        if (typeof jsonData[field] === 'string') {
          jsonData[field] = toArray(jsonData[field]);
        }
      });
      
      // The 'heroImage' field might contain the old image URL string, which is fine to send.
      // If it's null or undefined from the form, it won't be included.
      
      payload = jsonData;
    }

    try {
      const response = await apiClient.patch(`/api/treatments/${id}`, payload, config);
      toast.success(response.data?.message || 'Treatment updated successfully!');

      set((state) => ({
        treatments: state.treatments.map((t) => (t._id === id ? response.data.data : t)),
        loading: false,
      }));
      get().resetForm();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update treatment.';
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw err;
    }
  },


  deleteTreatment: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.delete(`/api/treatments/${id}`);
      toast.success(response.data?.message || 'Treatment deleted successfully!');
      set((state) => ({
        treatments: state.treatments.filter((t) => t._id !== id),
        loading: false,
      }));
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete treatment.';
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw err;
    }
  },
}));

export default useTreatmentStore;