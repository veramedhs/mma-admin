import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, Trash2, Edit, X, Check, Loader2 } from 'lucide-react';
import useSpecializationStore from '../stores/useSpecializationStore';

const Add_specialization = () => {
  // Get state and actions from the Zustand store
  const {
    specializations,
    loading,
    fetchSpecializations,
    createSpecialization,
    updateSpecialization,
    deleteSpecialization,
  } = useSpecializationStore();

  const [newName, setNewName] = useState('');
  const [editingSpec, setEditingSpec] = useState({ id: null, name: '' });

  // Fetch data when the component mounts
  useEffect(() => {
    fetchSpecializations();
  }, [fetchSpecializations]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      return toast.error('Specialization name cannot be empty.');
    }
    try {
      await createSpecialization(newName);
      setNewName(''); // Clear input on success
    } catch (error) {
      // Error is already handled by toast in the store
      console.error(error);
    }
  };
  
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingSpec.name.trim()) {
      return toast.error('Specialization name cannot be empty.');
    }
    try {
      await updateSpecialization(editingSpec.id, editingSpec.name);
      setEditingSpec({ id: null, name: '' }); // Exit editing mode on success
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (spec) => {
    setEditingSpec({ id: spec._id, name: spec.name });
  };

  const handleCancelEdit = () => {
    setEditingSpec({ id: null, name: '' });
  };

  // Shared Tailwind CSS classes for consistent styling
  const inputClass = "block w-full px-4 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-50 transition-colors";
  const buttonClass = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50";
  const iconButtonClass = "p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">
            Manage Specializations
          </h1>

          {/* --- Add New Specialization Form --- */}
          <form onSubmit={handleAddSubmit} className="flex gap-4 mb-8">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Cardiology"
              className={inputClass}
              disabled={loading}
            />
            <button type="submit" className={buttonClass} disabled={loading}>
              {loading && !editingSpec.id ? <Loader2 className="animate-spin mr-2" size={20} /> : <Plus size={20} className="mr-2" />}
              Add
            </button>
          </form>

          {/* --- List of Specializations --- */}
          <div className="space-y-3">
            {specializations.map((spec) => (
              <div key={spec._id} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                {editingSpec.id === spec._id ? (
                  // --- Editing View ---
                  <form onSubmit={handleUpdateSubmit} className="flex-grow flex items-center gap-2">
                    <input
                      type="text"
                      value={editingSpec.name}
                      onChange={(e) => setEditingSpec({ ...editingSpec, name: e.target.value })}
                      className={`${inputClass} py-1`}
                      autoFocus
                    />
                    <button type="submit" className={`${iconButtonClass} text-green-500`} disabled={loading}>
                      <Check size={20} />
                    </button>
                    <button type="button" onClick={handleCancelEdit} className={`${iconButtonClass} text-slate-500`} disabled={loading}>
                      <X size={20} />
                    </button>
                  </form>
                ) : (
                  // --- Default View ---
                  <>
                    <p className="text-slate-800 dark:text-slate-200">{spec.name}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditClick(spec)} className={`${iconButtonClass} text-blue-500`} disabled={loading}>
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteSpecialization(spec._id)} className={`${iconButtonClass} text-red-500`} disabled={loading}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {loading && specializations.length === 0 && <p className="text-center text-slate-500">Loading...</p>}
            {!loading && specializations.length === 0 && <p className="text-center text-slate-500">No specializations found. Add one to get started.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add_specialization;