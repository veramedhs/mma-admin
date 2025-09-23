import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import useDiseaseStore from '../stores/useDiseaseStore';
import useTreatmentStore from '../stores/useTreatmentStore';

const Add_treatment = () => {
  // State and actions from the Treatment store
  const { formData, loading, setFormData, createTreatment } = useTreatmentStore();

  // State and actions from the Disease store to populate the dropdown
  const { diseases, fetchDiseases, loading: diseasesLoading } = useDiseaseStore();

  // Fetch the list of diseases when the component first loads
  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(name, val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTreatment();
      // The form is reset inside the store on success
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  // Reusable Tailwind CSS classes for consistent styling
  const inputClass = "block w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 dark:text-slate-50 transition-colors";
  const labelClass = "block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1";
  const legendClass = "text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">
          Add New Treatment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- Core Information --- */}
          <fieldset>
            <legend className={legendClass}>Core Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="parentDisease" className={labelClass}>Parent Disease (Required)</label>
                <select
                  id="parentDisease"
                  name="parentDisease"
                  value={formData.parentDisease}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={diseasesLoading}
                  required
                >
                  <option value="" disabled>
                    {diseasesLoading ? 'Loading diseases...' : 'Select a parent disease'}
                  </option>
                  {diseases.map((disease) => (
                    <option key={disease._id} value={disease._id}>
                      {disease.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="name" className={labelClass}>Treatment Name (Required)</label>
                <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Total Knee Replacement" className={inputClass} required />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="summary" className={labelClass}>Summary / Description</label>
                <textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} placeholder="A brief description of the treatment..." className={`${inputClass} min-h-[100px]`} />
              </div>
            </div>
          </fieldset>

          {/* --- Pricing Information --- */}
          <fieldset>
            <legend className={legendClass}>Pricing</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="price" className={labelClass}>Price (Required)</label>
                <input id="price" type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g., 22000" className={inputClass} required min="0" />
              </div>
              <div>
                <label htmlFor="currency" className={labelClass}>Currency</label>
                <input id="currency" type="text" name="currency" value={formData.currency} onChange={handleChange} placeholder="e.g., USD" className={inputClass} />
              </div>
              <div>
                <label htmlFor="discountPercent" className={labelClass}>Discount (%)</label>
                <input id="discountPercent" type="number" name="discountPercent" value={formData.discountPercent} onChange={handleChange} placeholder="e.g., 10" className={inputClass} min="0" max="100" />
              </div>
            </div>
          </fieldset>

          {/* --- Details (Comma-Separated) --- */}
          <fieldset>
            <legend className={legendClass}>Treatment Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="symptoms" className={labelClass}>Symptoms Addressed (comma-separated)</label>
                <input id="symptoms" type="text" name="symptoms" value={formData.symptoms} onChange={handleChange} placeholder="e.g., Severe pain, Stiffness" className={inputClass} />
              </div>
              <div>
                <label htmlFor="tests" className={labelClass}>Required Tests (comma-separated)</label>
                <input id="tests" type="text" name="tests" value={formData.tests} onChange={handleChange} placeholder="e.g., X-ray, MRI Scan" className={inputClass} />
              </div>
              <div>
                <label htmlFor="precautions" className={labelClass}>Precautions (comma-separated)</label>
                <input id="precautions" type="text" name="precautions" value={formData.precautions} onChange={handleChange} placeholder="e.g., Physical therapy, Use walkers" className={inputClass} />
              </div>
              <div>
                <label htmlFor="tags" className={labelClass}>Search Tags (comma-separated)</label>
                <input id="tags" type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g., knee surgery, arthritis" className={inputClass} />
              </div>
            </div>
          </fieldset>

           {/* --- Media and Status --- */}
           <fieldset>
            <legend className={legendClass}>Media & Status</legend>
             <div className="space-y-6">
               <div>
                 <label htmlFor="heroImage" className={labelClass}>Hero Image URL</label>
                 <input id="heroImage" type="text" name="heroImage" value={formData.heroImage} onChange={handleChange} placeholder="https://example.com/image.jpg" className={inputClass} />
               </div>
               <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input id="published" name="published" type="checkbox" checked={formData.published} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-blue-600 focus:ring-blue-500"/>
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="published" className="font-medium text-slate-700 dark:text-slate-200">Mark as Published</label>
                    <p className="text-slate-500 dark:text-slate-400">Make this treatment visible to the public.</p>
                  </div>
                </div>
             </div>
           </fieldset>

          {/* --- Submission Button --- */}
          <div className="flex justify-end pt-4">
            <button type="submit" className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={loading}>
              {loading && <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />}
              {loading ? 'Adding Treatment...' : 'Add Treatment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_treatment;