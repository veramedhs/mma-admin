import React from 'react';
import { Toaster } from 'react-hot-toast';
import useLabStore from '@/stores/useLabStore'; // Absolute import

const Add_labs = () => {
  const { formData, loading, setFormData, setAddress, setLabLogo, createLab, resetForm } = useLabStore();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Use 'checked' for checkboxes, otherwise use 'value'
    const val = type === 'checkbox' ? checked : value;
    setFormData(name, val);
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

  // Common CSS classes for consistency
  const inputClass = "input input-bordered w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50";
  const labelClass = "block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1";
  const legendClass = "text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200";

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100 text-center">
          Add New Laboratory
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Lab Information */}
          <fieldset>
            <legend className={legendClass}>Basic Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="labName" className={labelClass}>Lab Name</label>
                <input id="labName" type="text" name="labName" value={formData.labName} onChange={handleChange} placeholder="e.g., MedTest Diagnostics" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Contact Email</label>
                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="contact@medtest.com" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>Contact Phone</label>
                <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="accreditation" className={labelClass}>Accreditation</label>
                <input id="accreditation" type="text" name="accreditation" value={formData.accreditation} onChange={handleChange} placeholder="e.g., ISO 15189" className={inputClass} />
              </div>
            </div>
          </fieldset>

          {/* Lab Address */}
          <fieldset>
            <legend className={legendClass}>Lab Address</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="street" className={labelClass}>Street Address</label>
                <input id="street" type="text" name="street" value={formData.address.street} onChange={handleAddressChange} placeholder="123 Health Ave" className={inputClass} />
              </div>
              <div>
                <label htmlFor="city" className={labelClass}>City</label>
                <input id="city" type="text" name="city" value={formData.address.city} onChange={handleAddressChange} placeholder="Wellville" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="state" className={labelClass}>State / Province</label>
                <input id="state" type="text" name="state" value={formData.address.state} onChange={handleAddressChange} placeholder="California" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="postalCode" className={labelClass}>Postal Code</label>
                <input id="postalCode" type="text" name="postalCode" value={formData.address.postalCode} onChange={handleAddressChange} placeholder="90210" className={inputClass} />
              </div>
            </div>
          </fieldset>

          {/* Services and Operations */}
          <fieldset>
            <legend className={legendClass}>Services & Operations</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="servicesOffered" className={labelClass}>Services Offered (comma-separated)</label>
                <textarea id="servicesOffered" name="servicesOffered" value={formData.servicesOffered} onChange={handleChange} placeholder="e.g., Blood Tests, PCR, X-Ray" className={`${inputClass} min-h-[100px] resize-y`} />
              </div>
              <div>
                <label htmlFor="operatingHours" className={labelClass}>Operating Hours</label>
                <select id="operatingHours" name="operatingHours" value={formData.operatingHours} onChange={handleChange} className={`${inputClass} appearance-none`} required>
                  <option value="" disabled>Select Operating Hours</option>
                  <option value="Mon-Fri: 8 AM - 5 PM">Mon-Fri: 8 AM - 5 PM</option>
                  <option value="Mon-Sat: 8 AM - 6 PM">Mon-Sat: 8 AM - 6 PM</option>
                  <option value="24/7">24/7</option>
                  <option value="Mon-Sun: 9 AM - 9 PM">Mon-Sun: 9 AM - 9 PM</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Lab Logo Upload */}
          <fieldset>
            <legend className={legendClass}>Lab Logo</legend>
            <div className="flex items-center gap-6">
              <input id="labLogo" type="file" name="labLogo" onChange={handleFileChange} className="file-input file-input-bordered w-full max-w-xs bg-white dark:bg-slate-700" accept="image/*" />
              {/* Image Preview */}
              {formData.labLogo && (
                <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-blue-500">
                  <img
                    src={URL.createObjectURL(formData.labLogo)}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </fieldset>
          
           {/* Admin Controls */}
           <fieldset>
            <legend className={legendClass}>Admin Controls</legend>
             <div className="flex items-center">
                <input
                  id="isVerified"
                  name="isVerified"
                  type="checkbox"
                  checked={formData.isVerified}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isVerified" className="ml-3 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Mark as Verified
                </label>
              </div>
          </fieldset>

          <div className="flex justify-end pt-4">
            <button type="submit" className="btn btn-primary w-full sm:w-auto text-white" disabled={loading}>
              {loading ? 'Adding Lab...' : 'Add Lab'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_labs;