import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTreatmentStore from '../stores/useTreatmentStore'; // Adjust path if needed
import { PencilLine, Trash, PlusCircle } from 'lucide-react';

// Helper function to format the price range
const formatPriceRange = (min, max, currency) => {
  const formatter = (price) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(price);

  if (!min && !max) return 'N/A';
  if (max && min !== max) {
    return `${formatter(min)} - ${formatter(max)}`;
  }
  return formatter(min);
};

const Treatment_list = () => {
  const navigate = useNavigate();
  
  const {
    treatments,
    loading,
    error,
    fetchTreatments,
    deleteTreatment,
  } = useTreatmentStore();

  // Fetch treatments when the component mounts
  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  // Handle Delete button click
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteTreatment(id);
    }
  };

  // Navigate to the edit page
  const handleEdit = (id) => {
    navigate(`/treatments/edit/${id}`);
  };
  
  // Navigate to the create page
  const handleCreate = () => {
    navigate('/treatments/create');
  };

  if (loading && treatments.length === 0) {
    return <div className="p-4 text-center text-slate-600 dark:text-slate-400">Loading treatments...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h1 className="title">Treatments Management</h1>
        <button 
          onClick={handleCreate} 
          className="flex items-center gap-x-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <PlusCircle size={20} />
          Create New
        </button>
      </div>
      
      <div className="card">
        <div className="card-header">
          <p className="card-title">All Treatments ({treatments.length})</p>
        </div>
        <div className="card-body p-0">
          <div className="relative h-[600px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            {treatments.length === 0 && !loading ? (
              <p className="p-4 text-center text-slate-500 dark:text-slate-400">No treatments found. Click 'Create New' to add one.</p>
            ) : (
              <table className="table">
                <thead className="table-header">
                  <tr className="table-row">
                    <th className="table-head">Image</th>
                    <th className="table-head">Name</th>
                    <th className="table-head">Parent Disease</th>
                    <th className="table-head">Price Range</th> {/* <-- Updated Column */}
                    <th className="table-head">Status</th>
                    <th className="table-head">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {treatments.map((treatment) => (
                    <tr key={treatment._id} className="table-row">
                      <td className="table-cell">
                        <img
                          src={treatment.heroImage || 'https://via.placeholder.com/150?text=No+Image'}
                          alt={treatment.name}
                          className="size-14 flex-shrink-0 rounded-lg object-cover"
                        />
                      </td>
                      <td className="table-cell font-medium text-slate-900 dark:text-slate-50">{treatment.name}</td>
                      <td className="table-cell">{treatment.parentDisease?.name || 'N/A'}</td>
                      <td className="table-cell font-medium text-slate-800 dark:text-slate-200">
                        {formatPriceRange(treatment.minPrice, treatment.maxPrice, treatment.currency)}
                      </td>
                      <td className="table-cell">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            treatment.published 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {treatment.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-x-4">
                          <button onClick={() => handleEdit(treatment._id)} className="text-blue-500 transition-colors hover:text-blue-700 dark:text-blue-600 dark:hover:text-blue-400">
                            <PencilLine size={20} />
                          </button>
                          <button onClick={() => handleDelete(treatment._id, treatment.name)} className="text-red-500 transition-colors hover:text-red-700 dark:hover:text-red-400">
                            <Trash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Treatment_list;
