import { create } from 'zustand';
import { apiClient } from '../api/apiClient';
import toast from 'react-hot-toast';

const useDoctorStore = create((set) => ({
    loading: false,
    error: null,

    createDoctorProfile: async (formData) => {
        set({ loading: true, error: null });
        try {
            const promise = apiClient.post("/api/new-doctors", formData);

            const response = await toast.promise(promise, {
                loading: "Creating doctor profile...",
                success: (res) => res.data?.message || "Doctor profile created successfully!",
                error: (err) =>
                    err.response?.data?.message || "An unexpected error occurred.",
            });

            set({ loading: false });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An unexpected error occurred.";
            set({ loading: false, error: errorMessage });
            throw new Error(errorMessage);
        }
    },
}));

export default useDoctorStore;
