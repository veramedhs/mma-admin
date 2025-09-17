import { create } from "zustand";
import toast from "react-hot-toast";
import { apiClient } from "../api/apiClient";

const useTestStore = create((set) => ({
    // Initial state for the "Add Test" form
    formData: {
        labName: "", // ✅ Added to store the selected lab name
        testName: "",
        category: "",
        description: "",
        price: "",
        cptCode: "",
        sampleType: "",
        turnaroundTime: "",
        prerequisites: "", // e.g., "Fasting for 8 hours required"
    },
    labNames: [],   // State to store lab names
    loading: false,
    error: null,

    // Action to update any field in the form data
    setFormData: (field, value) =>
        set((state) => ({
            formData: { ...state.formData, [field]: value },
        })),

    // Action to reset the form to its initial state
    resetForm: () =>
        set({
            formData: {
                labName: "", // ✅ Also added here to ensure the form clears properly
                testName: "",
                category: "",
                description: "",
                price: "",
                cptCode: "",
                sampleType: "",
                turnaroundTime: "",
                prerequisites: "",
            },
        }),

    // Async action to create a new test
    createTest: async (formData) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.post("/api/admin/tests/create", formData);

            console.log("API Response:", response.data);

            set({ loading: false });
            toast.success("Test created successfully!");
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to create test.";
            set({ loading: false, error: errorMessage });
            toast.error(errorMessage);
            throw err;
        }
    },

    // Async action to fetch lab names
    fetchLabNames: async () => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get("/api/admin/labs/names");
            
            // This correctly handles the array structure you provided
            const labNamesData = Array.isArray(response.data) ? response.data : [];

            set({ labNames: labNamesData, loading: false });
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch lab names.";
            set({ loading: false, error: errorMessage });
            toast.error(errorMessage);
        }
    },
}));

export default useTestStore;