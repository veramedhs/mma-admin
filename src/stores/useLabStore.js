import { create } from "zustand";
import { apiClient } from "../api/apiClient"; // Assuming you use a central apiClient
import toast from "react-hot-toast";

const useLabStore = create((set) => ({
    // Initial state for the lab form
    formData: {
        labName: "",
        email: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
        },
        servicesOffered: "",
        operatingHours: "",
        accreditation: "",
        labLogo: null,
        isVerified: false,
    },
    loading: false,
    error: null,
    labList: [],

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

    // ✅ FIXED: Removed the incorrect, duplicated function
    setLabLogo: (file) =>
        set((state) => ({
            formData: { ...state.formData, labLogo: file },
        })),

    // Action to reset the form
    resetForm: () =>
        set({
            formData: {
                labName: "",
                email: "",
                phone: "",
                address: { street: "", city: "", state: "", postalCode: "" },
                servicesOffered: "",
                operatingHours: "",
                accreditation: "",
                labLogo: null,
                isVerified: false,
            },
            loading: false,
            error: null,
        }),

    // Async action to create a new lab
    createLab: async (formData) => {
        set({ loading: true, error: null });
        try {
            const postData = new FormData();

            postData.append("labName", formData.labName);
            postData.append("email", formData.email);
            postData.append("phone", formData.phone);
            postData.append("address", JSON.stringify(formData.address));
            postData.append("servicesOffered", formData.servicesOffered);
            postData.append("operatingHours", formData.operatingHours);
            postData.append("accreditation", formData.accreditation);
            postData.append("isVerified", formData.isVerified ? "true" : "false");

            if (formData.labLogo) {
                postData.append("labLogo", formData.labLogo);
            }

            const response = await apiClient.post("/api/admin/labs/create", postData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            set({ loading: false });
            toast.success("Lab created successfully!");
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to create lab.";
            set({ loading: false, error: errorMessage });
            toast.error(errorMessage);
            throw err;
        }
    },

    // Async action to fetch lab list data
    fetchLabList: async () => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get("/api/admin/labs");
            const labsData = Array.isArray(response.data) ? response.data : [];
            set({ labList: labsData, loading: false });
            return labsData;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch labs.";
            set({ loading: false, error: errorMessage });
            toast.error(errorMessage);
            throw err;
        }
    },

    // ✅ ADDED: Async action to delete a lab by its ID
    deleteLab: async (labId) => {
        try {
            // Makes a DELETE request to your specified endpoint, e.g., /api/admin/labs/60d21b4667d0d8992e610c85
            await apiClient.delete(`/api/admin/labs/${labId}`);
            set((state) => ({
                labList: state.labList.filter((lab) => lab._id !== labId),
            }));

            toast.success("Lab deleted successfully!");
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Could not delete the lab.";
            toast.error(errorMessage);
            throw err;
        }
    },
}));

export default useLabStore;