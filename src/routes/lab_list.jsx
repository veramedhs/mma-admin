// src/pages/Lab_list.js
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom for navigation
// import useLabListStore from '@/stores/useLabListStore'; // Store is not used in this version
import { PlusCircle, Edit, Trash2, AlertCircle } from 'lucide-react';

// --- DUMMY DATA ---
// A realistic array of lab objects to simulate a real API response.
const dummyLabs = [
  {
    _id: 'lab_001 ',
    labName: 'Apex Diagnostics',
    email: 'contact@apexdiag.com',
    phone: '(555) 123-4567',
    address: { city: 'San Francisco', state: 'CA' },
    isVerified: true,
    accreditation: 'CLIA, ISO 15189',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/2853/2853243.png', // Example logo
  },
  {
    _id: 'lab_002',
    labName: 'BioGenetics Inc.',
    email: 'support@biogenetics.io',
    phone: '(555) 234-5678',
    address: { city: 'Boston', state: 'MA' },
    isVerified: true,
    accreditation: 'CAP Certified',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/2279/2279015.png', // Example logo
  },
  {
    _id: 'lab_003',
    labName: 'Pathology Solutions',
    email: 'results@pathsol.net',
    phone: '(555) 345-6789',
    address: { city: 'Houston', state: 'TX' },
    isVerified: false,
    accreditation: null,
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/9373/9373307.png', // Example logo
  },
  {
    _id: 'lab_004',
    labName: 'Wellness Labs',
    email: 'info@wellnesslabs.com',
    phone: '(555) 456-7890',
    address: { city: 'Miami', state: 'FL' },
    isVerified: true,
    accreditation: 'CLIA Certified',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/1158/1158488.png', // Example logo
  },
  {
    _id: 'lab_005',
    labName: 'Metro Health Services',
    email: 'scheduling@metrohealth.org',
    phone: '(555) 567-8901',
    address: { city: 'Chicago', state: 'IL' },
    isVerified: false,
    accreditation: 'Pending Review',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/7555/7555776.png', // Example logo
  },
];


// A simple spinner component for loading states
const Spinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Lab_list = () => {
  // --- LOCAL STATE MANAGEMENT ---
  // Replaces the Zustand store with local state for this component.
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- SIMULATED DATA FETCH ---
  // This useEffect simulates fetching data when the component mounts.
  const fetchLabs = () => {
    setLoading(true);
    setError(null);
    // Simulate a network delay of 1 second.
    setTimeout(() => {
      setLabs(dummyLabs);
      setLoading(false);
      // To test the error state, uncomment the following lines:
      // setError("Could not connect to the server.");
      // setLoading(false);
    }, 1000);
  };

  // Run the simulated fetch when the component mounts.
  useEffect(() => {
    fetchLabs();
  }, []);

  // --- LOCAL DELETE HANDLER ---
  // Updates the local state instead of calling a store action.
  const handleDelete = (labId, labName) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-y-2">
          <p>
            Are you sure you want to delete <strong>{labName}</strong>?
          </p>
          <div className="flex gap-x-2">
            <button
              onClick={() => {
                // Filter the labs array to remove the deleted lab.
                setLabs((currentLabs) => currentLabs.filter((lab) => lab._id !== labId));
                toast.dismiss(t.id);
                toast.success(`${labName} has been deleted.`);
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold py-1 px-3 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return (
        <div className="text-center p-10 text-red-500">
          <AlertCircle className="mx-auto h-12 w-12" />
          <p className="mt-4 text-lg">An error occurred: {error}</p>
          <button onClick={fetchLabs} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Retry
          </button>
        </div>
      );
    }

    if (labs.length === 0) {
      return (
        <div className="text-center p-10">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No Labs Found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Get started by adding a new laboratory.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Lab Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Contact</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {labs.map((lab) => (
              <tr key={lab._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full object-contain" src={lab.logoUrl} alt={`${lab.labName} Logo`} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-50">{lab.labName}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{lab.accreditation || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900 dark:text-slate-50">{lab.email}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{lab.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                  {lab.address ? `${lab.address.city}, ${lab.address.state}` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lab.isVerified ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>
                    {lab.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-x-4">
                    <Link to={`/admin/labs/edit/${lab._id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDelete(lab._id, lab.labName)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-7xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Laboratory List</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage all registered laboratories.</p>
            </div>
            {/* --- THIS IS THE ONLY CHANGE --- */}
            <Link to="/labs" className="mt-4 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800">
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Lab
            </Link>
          </div>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default Lab_list;