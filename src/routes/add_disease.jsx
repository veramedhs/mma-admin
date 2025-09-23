import  { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, Trash2, Edit, X, Check, Loader2 } from 'lucide-react';
import useDiseaseStore from '../stores/useDiseaseStore';

const Add_disease = () => {
  // Get all state and actions from our Zustand store
  const {
    diseases,
    loading,
    fetchDiseases,
    createDisease,
    updateDisease,
    deleteDisease,
  } = useDiseaseStore();

  const [newName, setNewName] = useState('');
  const [editingDisease, setEditingDisease] = useState({ id: null, name: '' });

  // Fetch initial data when the component mounts
  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      return toast.error('Disease name cannot be empty.');
    }
    try {
      await createDisease(newName);
      setNewName(''); // Clear input only on successful submission
    } catch (error) {
      // Error is already displayed by a toast in the store
      console.error("Failed to add disease:", error);
    }
  };
  
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingDisease.name.trim()) {
      return toast.error('Disease name cannot be empty.');
    }
    try {
      await updateDisease(editingDisease.id, editingDisease.name);
      setEditingDisease({ id: null, name: '' }); // Exit editing mode on success
    } catch (error) {
      console.error("Failed to update disease:", error);
    }
  };

  // Set the component to "edit mode" for a specific item
  const handleEditClick = (disease) => {
    setEditingDisease({ id: disease._id, name: disease.name });
  };

  // Cancel editing and return to normal view
  const handleCancelEdit = () => {
    setEditingDisease({ id: null, name: '' });
  };

  // Reusable Tailwind CSS classes for consistent styling
  const inputClass = "block w-full px-4 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-50 transition-colors";
  const buttonClass = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const iconButtonClass = "p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">
            Manage Diseases
          </h1>

          {/* --- Form to Add a New Disease --- */}
          <form onSubmit={handleAddSubmit} className="flex gap-4 mb-8">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Cardiology"
              className={inputClass}
              disabled={loading}
            />
            <button type="submit" className={buttonClass} disabled={loading && !editingDisease.id}>
              {loading && !editingDisease.id ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
              <span className="ml-2 hidden sm:block">Add New</span>
            </button>
          </form>

          {/* --- List of Existing Diseases --- */}
          <div className="space-y-3">
            {diseases.map((disease) => (
              <div key={disease._id} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg transition-colors">
                {editingDisease.id === disease._id ? (
                  // --- Inline Editing View ---
                  <form onSubmit={handleUpdateSubmit} className="flex-grow flex items-center gap-2">
                    <input
                      type="text"
                      value={editingDisease.name}
                      onChange={(e) => setEditingDisease({ ...editingDisease, name: e.target.value })}
                      className={`${inputClass} py-1`}
                      autoFocus
                    />
                    <button type="submit" className={`${iconButtonClass} text-green-500`} disabled={loading}>
                      {loading ? <Loader2 className="animate-spin" size={20}/> : <Check size={20} />}
                    </button>
                    <button type="button" onClick={handleCancelEdit} className={`${iconButtonClass} text-slate-500`} disabled={loading}>
                      <X size={20} />
                    </button>
                  </form>
                ) : (
                  // --- Default Display View ---
                  <>
                    <p className="text-slate-800 dark:text-slate-200">{disease.name}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditClick(disease)} className={`${iconButtonClass} text-blue-500`} disabled={loading}>
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteDisease(disease._id)} className={`${iconButtonClass} text-red-500`} disabled={loading}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {/* --- Loading and Empty States --- */}
            {loading && diseases.length === 0 && <p className="text-center text-slate-500 dark:text-slate-400">Loading diseases...</p>}
            {!loading && diseases.length === 0 && <p className="text-center text-slate-500 dark:text-slate-400">No diseases found. Add one to get started.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add_disease;