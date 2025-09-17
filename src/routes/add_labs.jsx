import { Toaster } from 'react-hot-toast';
import useLabStore from '@/stores/useLabStore';

const Add_labs = () => {
  const { formData, loading, setFormData, setAddress, setLabLogo, createLab, resetForm } = useLabStore();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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

  const inputClass = "block w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 dark:text-slate-50 transition-colors";
  const labelClass = "block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1";
  const legendClass = "text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">
          Add New Laboratory
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ... (Basic Information fieldset remains the same) ... */}
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
                {/* ✅ IMPROVEMENT: Added 'required' for consistency */}
                <input id="postalCode" type="text" name="postalCode" value={formData.address.postalCode} onChange={handleAddressChange} placeholder="90210" className={inputClass} required />
              </div>
            </div>
          </fieldset>
          
          {/* ... (Other fieldsets remain the same) ... */}
           <fieldset>
            <legend className={legendClass}>Services & Operations</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="servicesOffered" className={labelClass}>Services Offered</label>
                <textarea id="servicesOffered" name="servicesOffered" value={formData.servicesOffered} onChange={handleChange} placeholder="e.g., Blood Tests, PCR, X-Ray" className={`${inputClass} min-h-[100px]`} />
              </div>
              <div>
                <label htmlFor="operatingHours" className={labelClass}>Operating Hours</label>
                <select id="operatingHours" name="operatingHours" value={formData.operatingHours} onChange={handleChange} className={inputClass} required>
                  <option value="" disabled>Select an option</option>
                  <option value="Mon-Fri: 8 AM - 5 PM">Mon-Fri: 8 AM - 5 PM</option>
                  <option value="Mon-Sat: 8 AM - 6 PM">Mon-Sat: 8 AM - 6 PM</option>
                  <option value="24/7">24/7</option>
                  <option value="Mon-Sun: 9 AM - 9 PM">Mon-Sun: 9 AM - 9 PM</option>
                </select>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend className={legendClass}>Admin Controls</legend>
            <div className="relative flex items-start">
              <div className="flex h-6 items-center">
                <input
                  id="isVerified"
                  name="isVerified"
                  type="checkbox"
                  checked={!!formData.isVerified}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label htmlFor="isVerified" className="font-medium text-slate-700 dark:text-slate-200">
                  Mark as Verified
                </label>
              </div>
            </div>
          </fieldset>
           <fieldset>
            <legend className={legendClass}>Assets</legend>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
               <div className="flex-grow">
                 <label htmlFor="labLogo" className={labelClass}>Lab Logo</label>
                 <input id="labLogo" type="file" name="labLogo" onChange={handleFileChange} className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/40 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/60 transition-colors" accept="image/*" />
               </div>
              {formData.labLogo && (
                <div className="mt-4 sm:mt-0 flex-shrink-0">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-blue-500">
                    <img
                      src={URL.createObjectURL(formData.labLogo)}
                      alt="Logo Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </fieldset>
          <div className="flex justify-end pt-4">
            <button type="submit" className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={loading}>
              {loading ? 'Adding Lab...' : 'Add Lab'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_labs;