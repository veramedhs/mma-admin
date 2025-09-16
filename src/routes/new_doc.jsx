// src/pages/New_doctors.js
import React from 'react';
import { Toaster } from 'react-hot-toast';
import useDoctorStore from '../stores/useDoctorStore'; // Assuming your store path is correct

const New_doctors = () => {
  const { formData, loading, setFormData, setClinicAddress, setProfilePicture, createDoctor, resetForm } = useDoctorStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setClinicAddress(name, value);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDoctor(formData);
      resetForm();
    } catch (error) {
      // Error toast is already handled in the store
      console.error('Submission failed', error);
    }
  };

  // Common class for input fields for consistency
  const inputClass = "block w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 dark:text-slate-50 transition-colors";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Add New Doctor</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <fieldset>
            <legend className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
              Personal Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">First Name</label>
                <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g., John" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Last Name</label>
                <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g., Doe" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" className={inputClass} />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Phone Number</label>
                <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Password (Optional)</label>
                <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to auto-generate" className={inputClass} />
              </div>
            </div>
          </fieldset>

          {/* Professional Information */}
          <fieldset>
            <legend className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
              Professional Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization (e.g., Cardiology)" className={inputClass} />
              <input type="text" name="qualifications" value={formData.qualifications} onChange={handleChange} placeholder="Qualifications (comma-separated)" className={inputClass} />
              <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="License Number" className={inputClass} />
              <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} placeholder="Years of Experience" className={inputClass} />
              <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} placeholder="Consultation Fee ($)" className={inputClass} />
              <input type="text" name="languagesSpoken" value={formData.languagesSpoken} onChange={handleChange} placeholder="Languages (comma-separated)" className={inputClass} />
            </div>
          </fieldset>

          {/* Clinic Address */}
          <fieldset>
            <legend className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
              Clinic Address
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="street" value={formData.clinicAddress.street} onChange={handleAddressChange} placeholder="Street" className={inputClass} />
              <input type="text" name="city" value={formData.clinicAddress.city} onChange={handleAddressChange} placeholder="City" className={inputClass} />
              <input type="text" name="state" value={formData.clinicAddress.state} onChange={handleAddressChange} placeholder="State" className={inputClass} />
              <input type="text" name="postalCode" value={formData.clinicAddress.postalCode} onChange={handleAddressChange} placeholder="Postal Code" className={inputClass} />
            </div>
          </fieldset>
          
          {/* Bio and Profile Picture */}
          <fieldset>
             <legend className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
              Profile Details
            </legend>
            <div className="space-y-6">
               <div>
                 <label htmlFor="bio" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Biography</label>
                 <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="A short bio about the doctor..." className={`${inputClass} min-h-[100px]`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Profile Picture</label>
                <input
                  type="file"
                  name="profilePicture"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/40 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/60 transition-colors"
                />
              </div>
            </div>
          </fieldset>
          
          <div className="flex justify-end pt-4">
            <button type="submit" className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={loading}>
              {loading ? 'Creating Doctor...' : 'Create Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default New_doctors;