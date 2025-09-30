import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import useTreatmentStore from '../stores/useTreatmentStore';
import useDiseaseStore from '../stores/useDiseaseStore';

const TreatmentUpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    formData,
    loading,
    error,
    setFormData,
    fetchTreatmentById,
    updateTreatment,
    resetForm,
  } = useTreatmentStore();

  const { diseases, fetchDiseases, loading: diseasesLoading } = useDiseaseStore();
  const [imagePreview, setImagePreview] = useState('');

  // ✅ FIX 1: Define the server's base URL to correctly construct image paths.
  const serverBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchDiseases();
    
    // Fetch treatment data and correctly set the initial image preview
    fetchTreatmentById(id).then((treatment) => {
      if (treatment && treatment.heroImage) {
        // Construct the full, absolute URL for the existing image
        const imagePath = treatment.heroImage.replace(/\\/g, '/');
        const fullImageUrl = imagePath.startsWith('http') ? imagePath : `${serverBaseUrl}/${imagePath}`;
        setImagePreview(fullImageUrl);
      }
    });

    // Cleanup form state on unmount
    return () => resetForm();
  }, [id, fetchTreatmentById, fetchDiseases, resetForm, serverBaseUrl]); // Added serverBaseUrl to dependency array

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData(name, file);
        // Create a temporary local URL for the new image preview
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData(name, type === 'checkbox' ? checked : value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTreatment(id, formData);
    } catch (err) {
      // The store already shows an error toast.
      console.error("Update failed:", err);
    }
  };

  // --- Reusable Tailwind CSS classes (Unchanged) ---
  const inputClass = "block w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 dark:text-slate-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed";
  const labelClass = "block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1";
  const legendClass = "text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4";

  // --- Loading and Error States (Unchanged) ---
  if (loading && !formData.name) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>;
  }
  
  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  // --- JSX Form (Unchanged, as it's already well-structured) ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">
          Edit Treatment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- Core Information --- */}
          <fieldset>
            <legend className={legendClass}>Core Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="parentDisease" className={labelClass}>Parent Disease (Required)</label>
                <select id="parentDisease" name="parentDisease" value={formData.parentDisease} onChange={handleChange} className={inputClass} disabled={diseasesLoading || loading} required>
                  <option value="" disabled>{diseasesLoading ? 'Loading diseases...' : 'Select a parent disease'}</option>
                  {diseases.map((disease) => (
                    <option key={disease._id} value={disease._id}>{disease.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="name" className={labelClass}>Treatment Name (Required)</label>
                <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} disabled={loading} required />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="summary" className={labelClass}>Summary / Description</label>
                <textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} className={`${inputClass} min-h-[100px]`} disabled={loading} />
              </div>
            </div>
          </fieldset>
          
          {/* --- Pricing Information --- */}
          <fieldset>
            {/* ... (Pricing fields are correct) ... */}
             <legend className={legendClass}>Pricing</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               <div>
                <label htmlFor="minPrice" className={labelClass}>Minimum Price (Required)</label>
                <input id="minPrice" type="number" name="minPrice" value={formData.minPrice} onChange={handleChange} className={inputClass} required min="0" disabled={loading} />
              </div>
              <div>
                <label htmlFor="maxPrice" className={labelClass}>Maximum Price</label>
                <input id="maxPrice" type="number" name="maxPrice" value={formData.maxPrice} onChange={handleChange} className={inputClass} min="0" disabled={loading} />
              </div>
              <div>
                <label htmlFor="price" className={labelClass}>Display Price (Required)</label>
                <input id="price" type="number" name="price" value={formData.price} onChange={handleChange} className={inputClass} required min="0" disabled={loading} />
              </div>
              <div>
                <label htmlFor="currency" className={labelClass}>Currency</label>
                <input id="currency" type="text" name="currency" value={formData.currency} onChange={handleChange} className={inputClass} disabled={loading} />
              </div>
              <div>
                <label htmlFor="discountPercent" className={labelClass}>Discount (%)</label>
                <input id="discountPercent" type="number" name="discountPercent" value={formData.discountPercent} onChange={handleChange} className={inputClass} min="0" max="100" disabled={loading} />
              </div>
            </div>
          </fieldset>
          
          {/* --- Details (Comma-Separated) --- */}
          <fieldset>
            {/* ... (Details fields are correct) ... */}
            <legend className={legendClass}>Treatment Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="symptoms" className={labelClass}>Symptoms Addressed (comma-separated)</label>
                <input id="symptoms" type="text" name="symptoms" value={formData.symptoms} onChange={handleChange} className={inputClass} disabled={loading} />
              </div>
              <div>
                <label htmlFor="tests" className={labelClass}>Required Tests (comma-separated)</label>
                <input id="tests" type="text" name="tests" value={formData.tests} onChange={handleChange} className={inputClass} disabled={loading} />
              </div>
              <div>
                <label htmlFor="precautions" className={labelClass}>Precautions (comma-separated)</label>
                <input id="precautions" type="text" name="precautions" value={formData.precautions} onChange={handleChange} className={inputClass} disabled={loading} />
              </div>
              <div>
                <label htmlFor="tags" className={labelClass}>Search Tags (comma-separated)</label>
                <input id="tags" type="text" name="tags" value={formData.tags} onChange={handleChange} className={inputClass} disabled={loading} />
              </div>
            </div>
          </fieldset>

          {/* --- Media and Status --- */}
          <fieldset>
            {/* ... (Media and Status fields are correct) ... */}
            <legend className={legendClass}>Media & Status</legend>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Hero Image</label>
                <div className="flex items-center gap-x-4">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="size-20 rounded-lg object-cover" />
                  ) : (
                    <div className="flex size-20 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 dark:bg-slate-700">No Image</div>
                  )}
                  <input id="heroImage" type="file" name="heroImage" onChange={handleChange} className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/70`} disabled={loading} accept="image/*" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Upload a new file to replace the existing image.</p>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input id="published" name="published" type="checkbox" checked={formData.published} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-blue-600 focus:ring-blue-500" disabled={loading} />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="published" className="font-medium text-slate-700 dark:text-slate-200">Mark as Published</label>
                </div>
              </div>
            </div>
          </fieldset>

          {/* --- Submission Buttons --- */}
          <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-4 pt-4">
            <button type="button" onClick={() => navigate('/admin/treatments')} className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none" disabled={loading}>
              {loading && <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />}
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TreatmentUpdatePage;