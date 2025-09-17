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

    // --- ACTION: Fetch all doctors from the API ---
    fetchDoctors: async () => {
        set({ loading: true, error: null });
        try {
            // Your API endpoint for fetching doctors
            const response = await apiClient.get("/api/doctors");

            // Based on your JSON, the array is inside the 'doctors' property
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
            // Assumes a standard REST API endpoint for deletion
            await apiClient.delete(`/api/admin/doctors/${doctorId}`);
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
    toggleDoctorStatus: async (doctorId, currentStatus) => {
        try {
            // Assumes an endpoint to patch the verification status
            const response = await apiClient.patch(`/api/admin/doctors/${doctorId}/verify`, {
                isVerified: !currentStatus,
            });

            // Update the state with the modified doctor data from the server
            set((state) => ({
                doctors: state.doctors.map((doc) =>
                    doc._id === doctorId ? response.data.doctor : doc
                ),
            }));
            toast.success(`Doctor status updated successfully.`);
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to update status.";
            toast.error(errorMessage);
        }
    },
}));

export default useDoctorsListStore;