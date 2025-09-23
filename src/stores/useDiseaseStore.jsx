import { create } from 'zustand';
import toast from 'react-hot-toast';
import { apiClient } from '../api/apiClient';

const useDiseaseStore = create((set) => ({
    diseases: [],
    loading: false,
    error: null,

    // ACTION: Fetch all diseases
    fetchDiseases: async () => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get('/api/diseases');
            set({ diseases: response.data, loading: false });
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to fetch diseases.';
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
        }
    },

    // ACTION: Create a new disease
    createDisease: async (name) => {
        set({ loading: true });
        try {
            const response = await apiClient.post('/api/diseases', { name });
            const newDisease = response.data.disease;

            // Add the new item to state and re-sort alphabetically
            set((state) => ({
                diseases: [...state.diseases, newDisease].sort((a, b) => a.name.localeCompare(b.name)),
                loading: false,
            }));
            toast.success(response.data.message || 'Disease created successfully!');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to create disease.';
            set({ loading: false, error: errorMessage });
            toast.error(errorMessage);
            throw new Error(errorMessage); // Re-throw error to be caught in the component
        }
    },

    // ACTION: Update an existing disease
    updateDisease: async (id, name) => {
        set({ loading: true });
        try {
            const response = await apiClient.patch(`/api/diseases/${id}`, { name });
            const updatedDisease = response.data.disease;

            // Find and update the item in the state
            set((state) => ({
                diseases: state.diseases.map((d) => (d._id === id ? updatedDisease : d)),
                loading: false,
            }));
            toast.success(response.data.message || 'Disease updated!');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to update disease.';
            set({ loading: false, error: errorMessage });
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    },

    // ACTION: Delete a disease
    deleteDisease: async (id) => {
        // We can show a confirmation toast here
        toast(
            (t) => (
                <div className="flex flex-col gap-2">
                    <p>Are you sure you want to delete this?</p>
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                            onClick={() => {
                                set({ loading: true });
                                apiClient.delete(`/diseases/${id}`)
                                    .then(response => {
                                        set((state) => ({
                                            diseases: state.diseases.filter((d) => d._id !== id),
                                            loading: false,
                                        }));
                                        toast.success(response.data.message || 'Disease deleted!');
                                    })
                                    .catch(error => {
                                        const errorMessage = error.response?.data?.error || 'Failed to delete disease.';
                                        set({ loading: false });
                                        toast.error(errorMessage);
                                    });
                                toast.dismiss(t.id);
                            }}
                        >
                            Delete
                        </button>
                        <button
                            className="px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded-md text-sm"
                            onClick={() => toast.dismiss(t.id)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
            { duration: 6000 }
        );
    },
}));

export default useDiseaseStore;