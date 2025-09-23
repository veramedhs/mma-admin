import { create } from "zustand";
import toast from "react-hot-toast";
// Make sure you have an apiClient configured, like Axios
import { apiClient } from "../api/apiClient";

const useDoctorsListStore = create((set) => ({
    doctors: [],
    loading: true,
    error: null,
    totalPages: 1,
    currentPage: 1,
    totalDoctors: 0,

    // --- ACTION: Fetch all doctors from the admin API endpoint ---
    fetchDoctors: async () => {
        set({ loading: true, error: null });
        try {
            // Using the conventional admin endpoint for fetching all doctors
            const response = await apiClient.get("/api/doctors");
            console.log("API fetch doctors Response:", response);

            if (response.data && Array.isArray(response.data.doctors)) {
                set({
                    doctors: response.data.doctors,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage,
                    totalDoctors: response.data.totalDoctors,
                    loading: false,
                });
            } else {
                throw new Error("Invalid data format received from the API.");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || "Failed to fetch doctors.";
            set({ loading: false, error: errorMessage, doctors: [] });
            toast.error(errorMessage);
        }
    },

    // --- ACTION: Delete a doctor by their ID ---
    deleteDoctor: async (doctorId) => {
        if (!window.confirm("Are you sure you want to delete this doctor?")) {
            return;
        }
        try {
            // CORRECTED: Used backticks (`) for the template literal
            await apiClient.delete(`/api/admin/doctors/${doctorId}`);
            
            // Optimistically update the UI by removing the deleted doctor
            set((state) => ({
                doctors: state.doctors.filter((doc) => doc._id !== doctorId),
                totalDoctors: state.totalDoctors - 1,
            }));
            toast.success("Doctor deleted successfully!");
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to delete doctor.";
            toast.error(errorMessage);
        }
    },

    // --- ACTION: Toggle the verification status of a doctor ---
    toggleDoctorStatus: async (doctorId) => {
        try {
            // CORRECTED: Updated endpoint to '/toggle-verify' and used backticks (`)
            // A "toggle" endpoint usually doesn't require a body, the backend handles the state flip.
            const response = await apiClient.patch(`/api/admin/doctors/${doctorId}/toggle-verify`);
            console.log("API Response:", response);

            // Update the state with the modified doctor data returned from the server
            set((state) => ({
                doctors: state.doctors.map((doc) =>
                    doc._id === doctorId ? response.data.doctor : doc
                ),
            }));
            toast.success("Doctor status updated successfully.");
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to update status.";
            toast.error(errorMessage);
        }
    },
}));

export default useDoctorsListStore;