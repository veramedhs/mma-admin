import { create } from 'zustand';
import toast from 'react-hot-toast';
import { apiClient } from '../api/apiClient'; // Ensure this path is correct for your project

// Helper: normalize values that may be arrays or comma-separated strings into arrays
const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    // If looks like JSON array, try parse it (useful if UI passed JSON)
    const trimmed = value.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch (e) {
        // fallback to splitting by comma
      }
    }
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

const initialState = {
  parentDisease: '',
  name: '',
  summary: '',
  price: '', // keep string for controlled input
  currency: 'USD',
  discountPercent: '', // string for controlled input
  // We'll keep heroImage as either a string URL (existing) or a File object from <input type="file" />
  heroImage: '', // frontend will set File on this field when uploading a new image
  precautions: '', // UI can provide comma-separated string or array
  tests: '',
  symptoms: '',
  tags: '',
  published: false,
};

const useTreatmentStore = create((set, get) => ({
  formData: initialState,
  loading: false,
  error: null,

  // Update a field. If field is 'heroImage' and value is File, store as-is.
  setFormData: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    }));
  },

  resetForm: () => {
    set({ formData: initialState, error: null });
  },

  // Create treatment using multipart/form-data to include the file as 'featuredImage'
  createTreatment: async () => {
    const data = get().formData;
    set({ loading: true, error: null });

    // Basic validation
    if (!data.parentDisease || !data.name || !data.price) {
      const errorMsg = 'Parent Disease, Name, and Price are required.';
      toast.error(errorMsg);
      set({ loading: false, error: errorMsg });
      throw new Error(errorMsg);
    }

    // Validate that a File is present for upload (or if heroImage is a string path for edit flows you might allow it)
    // Here we require an uploaded file as per server requirement
    if (!data.heroImage || !(data.heroImage instanceof File)) {
      const errorMsg = 'A hero image (featuredImage) file is required.';
      toast.error(errorMsg);
      set({ loading: false, error: errorMsg });
      throw new Error(errorMsg);
    }

    try {
      // Build FormData for multipart upload
      const formData = new FormData();

      // Text fields - server expects string values (it will JSON.parse arrays on its own)
      formData.append('parentDisease', data.parentDisease);
      formData.append('name', data.name);
      if (data.summary) formData.append('summary', data.summary);

      // Send price and discount as strings (server will parse them)
      formData.append('price', String(data.price));
      formData.append('currency', data.currency || 'USD');
      formData.append('discountPercent', String(data.discountPercent || ''));

      // Arrays: convert to arrays then stringify to JSON so server can JSON.parse them
      const precautionsArr = toArray(data.precautions);
      const testsArr = toArray(data.tests);
      const symptomsArr = toArray(data.symptoms);
      const tagsArr = toArray(data.tags);

      formData.append('precautions', JSON.stringify(precautionsArr));
      formData.append('tests', JSON.stringify(testsArr));
      formData.append('symptoms', JSON.stringify(symptomsArr));
      formData.append('tags', JSON.stringify(tagsArr));

      // Published should be string "true" or "false"
      formData.append('published', data.published ? 'true' : 'false');

      // Attach file as 'featuredImage' to match multer.single('featuredImage')
      formData.append('featuredImage', data.heroImage);

      // Note: Do NOT set Content-Type header here — let the browser set multipart boundary automatically.
      const response = await apiClient.post('/api/treatments', formData, {
        // If your apiClient is axios and has default headers, ensure it does not override Content-Type.
        // For example: headers: { 'Content-Type': 'multipart/form-data' } is unnecessary and can break boundary.
      });

      toast.success(response.data?.message || 'Treatment created successfully!');
      set({ loading: false });
      get().resetForm();
      return response.data;
    } catch (err) {
      // get readable error
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create treatment.';
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw err;
    }
  },
}));

export default useTreatmentStore;
