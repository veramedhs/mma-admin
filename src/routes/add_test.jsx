// src/routes/dashboard/add_test.jsx

import React from "react";
import { Toaster } from "react-hot-toast";
import useTestStore from "@/stores/useTestStore";  // ✅ Absolute import

const Add_Test = () => {
  const { formData, loading, setFormData, createTest, resetForm } = useTestStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTest(formData);
      resetForm();
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  const inputClass = "block w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 dark:text-slate-50 transition-colors";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Add New Lab Test</h1>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Lab Name Dropdown */}
          <fieldset>
            <legend className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Lab Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="labName" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Lab Name</label>
                <select
                  id="labName"
                  name="labName"
                  value={formData.labName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select Lab</option>
                  <option value="Central Diagnostic Lab">Central Diagnostic Lab</option>
                  <option value="Advanced Pathology Center">Advanced Pathology Center</option>
                  <option value="HealthPlus Lab Services">HealthPlus Lab Services</option>
                  <option value="Prime Medical Labs">Prime Medical Labs</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Test Details */}
          <fieldset>
            <legend className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Test Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="testName" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Test Name</label>
                <input
                  id="testName"
                  type="text"
                  name="testName"
                  value={formData.testName}
                  onChange={handleChange}
                  placeholder="e.g., Complete Blood Count (CBC)"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Category</label>
                <input
                  id="category"
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Hematology"
                  className={inputClass}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Briefly describe the test..."
                  className={`${inputClass} min-h-[100px]`}
                />
              </div>
            </div>
          </fieldset>

          {/* Pricing and Codes */}
          <fieldset>
            <legend className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Pricing & Codes</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Price ($)</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g., 25.50"
                  className={inputClass}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label htmlFor="cptCode" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">CPT Code (Optional)</label>
                <input
                  id="cptCode"
                  type="text"
                  name="cptCode"
                  value={formData.cptCode}
                  onChange={handleChange}
                  placeholder="e.g., 85027"
                  className={inputClass}
                />
              </div>
            </div>
          </fieldset>

          {/* Technical Information */}
          <fieldset>
            <legend className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Technical Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sampleType" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Sample Type</label>
                <input
                  id="sampleType"
                  type="text"
                  name="sampleType"
                  value={formData.sampleType}
                  onChange={handleChange}
                  placeholder="e.g., Whole Blood"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="turnaroundTime" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Turnaround Time</label>
                <input
                  id="turnaroundTime"
                  type="text"
                  name="turnaroundTime"
                  value={formData.turnaroundTime}
                  onChange={handleChange}
                  placeholder="e.g., 24-48 hours"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="prerequisites" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Prerequisites (Optional)</label>
                <textarea
                  id="prerequisites"
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleChange}
                  placeholder="e.g., Patient must be fasting for at least 8 hours."
                  className={`${inputClass} min-h-[80px]`}
                />
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={loading}
            >
              {loading ? 'Adding Test....' : 'Add Test'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Add_Test;
