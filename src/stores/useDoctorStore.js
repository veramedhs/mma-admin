import { create } from "zustand";
import toast from "react-hot-toast";
import { apiClient } from "../api/apiClient";

// Helper to convert comma-separated string to a clean array
const stringToArray = (str) => {
    if (Array.isArray(str)) return str; // Already an array
    if (typeof str === 'string' && str.trim() !== '') {
        return str.split(',').map(item => item.trim()).filter(Boolean); // Split, trim, and remove empty entries
    }
    return []; // Default to empty array
};

const useDoctorStore = create((set) => ({
    formData: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        specialization: "",
        qualifications: "", // Will be a comma-separated string in the form
        licenseNumber: "",
        yearsOfExperience: "",
        bio: "",
        consultationFee: "",
        languagesSpoken: "", // Will be a comma-separated string in the form
        clinicAddress: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
        },
        profilePicture: null, // Can be File or URL string
        isVerified: false, // Added for admin control
    },
    loading: false,
    error: null,

    // Update form data (handles text, number, and checkbox inputs)
    setFormData: (field, value) =>
        set((state) => ({
            formData: { ...state.formData, [field]: value },
        })),

    // Handle clinic address changes (nested)
    setClinicAddress: (field, value) =>
        set((state) => ({
            formData: {
                ...state.formData,
                clinicAddress: { ...state.formData.clinicAddress, [field]: value },
            },
        })),

    // Handle file input
    setProfilePicture: (file) =>
        set((state) => ({
            formData: { ...state.formData, profilePicture: file },
        })),

    // Reset form
    resetForm: () =>
        set({
            formData: {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                password: "",
                specialization: "",
                qualifications: "",
                licenseNumber: "",
                yearsOfExperience: "",
                bio: "",
                consultationFee: "",
                languagesSpoken: "",
                clinicAddress: {
                    street: "",
                    city: "",
                    state: "",
                    postalCode: "",
                },
                profilePicture: null,
                isVerified: false,
            },
            loading: false,
            error: null,
        }),

    // Create doctor action
    createDoctor: async (formData) => {
        set({ loading: true, error: null });
        try {
            // --- Prepare Data for Submission ---
            const processedData = {
                ...formData,
                qualifications: stringToArray(formData.qualifications),
                languagesSpoken: stringToArray(formData.languagesSpoken),
                yearsOfExperience: formData.yearsOfExperience ? Number(formData.yearsOfExperience) : 0,
                consultationFee: formData.consultationFee ? Number(formData.consultationFee) : 0,
            };

            const hasFile = processedData.profilePicture instanceof File;
            let response;

            if (hasFile) {
                // Build FormData for multipart upload
                const postData = new FormData();

                // Append all fields
                postData.append("firstName", processedData.firstName);
                postData.append("lastName", processedData.lastName);
                postData.append("email", processedData.email);
                postData.append("phone", processedData.phone);
                postData.append("password", processedData.password);
                postData.append("specialization", processedData.specialization);
                postData.append("licenseNumber", processedData.licenseNumber);
                postData.append("yearsOfExperience", processedData.yearsOfExperience.toString());
                postData.append("bio", processedData.bio);
                postData.append("consultationFee", processedData.consultationFee.toString());
                postData.append("isVerified", processedData.isVerified ? "true" : "false");

                // Append arrays and objects as JSON strings
                postData.append("qualifications", JSON.stringify(processedData.qualifications));
                postData.append("languagesSpoken", JSON.stringify(processedData.languagesSpoken));
                postData.append("clinicAddress", JSON.stringify(processedData.clinicAddress));

                // IMPORTANT: Append the file under the name 'doctordp' as expected by the backend
                postData.append("doctordp", processedData.profilePicture);

                response = await apiClient.post("/api/admin/doctors/create", postData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

            } else {
                // Send a regular JSON payload
                response = await apiClient.post("/api/admin/doctors/create", processedData);
            }

            set({ loading: false });
            toast.success("Doctor created successfully!");
            return response.data;

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || "Failed to create doctor.";
            set({ loading: false, error: errorMessage });
            toast.error(errorMessage);
            throw err;
        }
    },
}));

export default useDoctorStore;