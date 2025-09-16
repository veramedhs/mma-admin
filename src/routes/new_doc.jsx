// src/pages/New_doctors.js
import React from "react";
import { Toaster, toast } from "react-hot-toast";
import useDoctorStore from "../stores/useDoctorStore";

const New_doctors = () => {
  const {
    formData,
    loading,
    setFormData,
    setClinicAddress,
    setProfilePicture,
    createDoctor,
    resetForm,
  } = useDoctorStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setClinicAddress(name, value);
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDoctor(formData);
      resetForm();
    } catch (error) {
      // Error toast is already handled in the store
      console.error("Submission failed", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-2xl font-bold mb-4">Add New Doctor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="input input-bordered w-full"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input input-bordered w-full"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="input input-bordered w-full"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password (optional)"
            className="input input-bordered w-full"
          />
        </div>

        {/* Professional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="Specialization"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            placeholder="Qualifications (comma-separated)"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            placeholder="License Number"
            className="input input-bordered w-full"
          />
          <input
            type="number"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            placeholder="Years of Experience"
            className="input input-bordered w-full"
          />
          <input
            type="number"
            name="consultationFee"
            value={formData.consultationFee}
            onChange={handleChange}
            placeholder="Consultation Fee"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="languagesSpoken"
            value={formData.languagesSpoken}
            onChange={handleChange}
            placeholder="Languages (comma-separated)"
            className="input input-bordered w-full"
          />
        </div>

        {/* Clinic Address */}
        <div>
          <h2 className="text-lg font-semibold mt-4">Clinic Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <input
              type="text"
              name="street"
              value={formData.clinicAddress.street}
              onChange={handleAddressChange}
              placeholder="Street"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="city"
              value={formData.clinicAddress.city}
              onChange={handleAddressChange}
              placeholder="City"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="state"
              value={formData.clinicAddress.state}
              onChange={handleAddressChange}
              placeholder="State"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="postalCode"
              value={formData.clinicAddress.postalCode}
              onChange={handleAddressChange}
              placeholder="Postal Code"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Bio and Profile Picture */}
        <div>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Biography"
            className="textarea textarea-bordered w-full"
          />
          <div className="form-control w-full max-w-xs mt-4">
            <label className="label">
              <span className="label-text">Profile Picture</span>
            </label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Doctor"}
        </button>
      </form>
    </div>
  );
};

export default New_doctors;