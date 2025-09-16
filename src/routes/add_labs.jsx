// src/pages/Add_labs.js
import React from 'react';
import { Toaster } from 'react-hot-toast';
import useLabStore from '@/stores/useLabStore'; // Absolute import

const Add_labs = () => {
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
      resetForm();
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  const inputClass = "input input-bordered w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50";

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="text-3xl font-bold mb-6 text-center">Add New Lab</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">

        {/* Basic Lab Information */}
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <legend className="text-xl font-semibold mb-2">Basic Information</legend>

          <input
            type="text"
            name="labName"
            value={formData.labName}
            onChange={handleChange}
            placeholder="Lab Name"
            className={inputClass}
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Contact Email"
            className={inputClass}
            required
          />

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Contact Phone"
            className={inputClass}
            required
          />

          <input
            type="text"
            name="accreditation"
            value={formData.accreditation}
            onChange={handleChange}
            placeholder="Accreditation (e.g., ISO 15189)"
            className={inputClass}
          />
        </fieldset>

        {/* Lab Address */}
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <legend className="text-xl font-semibold mb-2">Lab Address</legend>

          <input
            type="text"
            name="street"
            value={formData.address.street}
            onChange={handleAddressChange}
            placeholder="Street Address"
            className={inputClass}
          />

          <input
            type="text"
            name="city"
            value={formData.address.city}
            onChange={handleAddressChange}
            placeholder="City"
            className={inputClass}
          />

          <input
            type="text"
            name="state"
            value={formData.address.state}
            onChange={handleAddressChange}
            placeholder="State / Province"
            className={inputClass}
          />

          <input
            type="text"
            name="postalCode"
            value={formData.address.postalCode}
            onChange={handleAddressChange}
            placeholder="Postal Code"
            className={inputClass}
          />
        </fieldset>

        {/* Services and Operations */}
        <fieldset className="space-y-4">
          <legend className="text-xl font-semibold mb-2">Services & Operations</legend>

          <textarea
            name="servicesOffered"
            value={formData.servicesOffered}
            onChange={handleChange}
            placeholder="Services Offered (e.g., Blood Tests, PCR, X-Ray)"
            className={`${inputClass} h-24 resize-none`}
          />

          <select
            name="operatingHours"
            value={formData.operatingHours}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select Operating Hours</option>
            <option value="Mon-Fri: 8 AM - 5 PM">Mon-Fri: 8 AM - 5 PM</option>
            <option value="Mon-Sat: 8 AM - 6 PM">Mon-Sat: 8 AM - 6 PM</option>
            <option value="24/7">24/7</option>
            <option value="Mon-Sun: 9 AM - 9 PM">Mon-Sun: 9 AM - 9 PM</option>
          </select>
        </fieldset>

        {/* Lab Logo Upload */}
        <fieldset>
          <label className="block mb-2 text-lg font-medium">Lab Logo</label>
          <input
            type="file"
            name="labLogo"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full max-w-xs bg-white dark:bg-slate-700"
            accept="image/*"
          />
        </fieldset>

        <button
          type="submit"
          className="btn btn-primary w-full text-white"
          disabled={loading}
        >
          {loading ? 'Adding Lab...' : 'Add Lab'}
        </button>
      </form>
    </div>
  );
};

export default Add_labs;
