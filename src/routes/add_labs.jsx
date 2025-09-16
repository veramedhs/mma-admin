// src/pages/Add_labs.js
import React from 'react';
import { Toaster } from 'react-hot-toast';
import useLabStore from '../stores/useLabStore';

const Add_labs = () => {
  // Destructure state and actions from the Zustand store
  const { formData, loading, setFormData, setAddress, setLabLogo, createLab, resetForm } = useLabStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(name, value);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      setLabLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLab(formData);
      resetForm(); // Clear the form on success
    } catch (error) {
      console.error('Submission failed:', error);
      // The error toast is already handled by the store
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Toaster component to display notifications */}
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-2xl font-bold mb-4">Add New Lab</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Basic Lab Information */}
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <legend className="text-lg font-semibold mb-2">Basic Information</legend>
          <input
            type="text"
            name="labName"
            value={formData.labName}
            onChange={handleChange}
            placeholder="Lab Name"
            className="input input-bordered w-full"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Contact Email"
            className="input input-bordered w-full"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Contact Phone"
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            name="accreditation"
            value={formData.accreditation}
            onChange={handleChange}
            placeholder="Accreditation (e.g., ISO 15189)"
            className="input input-bordered w-full"
          />
        </fieldset>

        {/* Lab Address */}
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <legend className="text-lg font-semibold mb-2">Lab Address</legend>
          <input
            type="text"
            name="street"
            value={formData.address.street}
            onChange={handleAddressChange}
            placeholder="Street Address"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="city"
            value={formData.address.city}
            onChange={handleAddressChange}
            placeholder="City"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="state"
            value={formData.address.state}
            onChange={handleAddressChange}
            placeholder="State / Province"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="postalCode"
            value={formData.address.postalCode}
            onChange={handleAddressChange}
            placeholder="Postal Code"
            className="input input-bordered w-full"
          />
        </fieldset>

        {/* Services and Operations */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold mb-2">Services & Operations</legend>
          <textarea
            name="servicesOffered"
            value={formData.servicesOffered}
            onChange={handleChange}
            placeholder="Services Offered (e.g., Blood Tests, PCR, X-Ray)"
            className="textarea textarea-bordered w-full"
            rows={3}
          />
          <input
            type="text"
            name="operatingHours"
            value={formData.operatingHours}
            onChange={handleChange}
            placeholder="Operating Hours (e.g., Mon-Sat: 8 AM - 6 PM)"
            className="input input-bordered w-full"
          />
        </fieldset>

        {/* File Upload */}
        <fieldset>
          <label className="label">
            <span className="label-text">Lab Logo</span>
          </label>
          <input
            type="file"
            name="labLogo"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full max-w-xs"
            accept="image/*"
          />
        </fieldset>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding Lab...' : 'Add Lab'}
        </button>
      </form>
    </div>
  );
};

export default Add_labs;