import React, { useState, useMemo } from "react";
import { CSVLink } from "react-csv";
import { useNavigate, useLocation } from "react-router-dom";

// ✅ Initial dummy doctors data
const initialDoctors = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91 9876543210",
    specialization: "Cardiologist",
    verified: true,
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 9123456780",
    specialization: "Dermatologist",
    verified: false,
  },
  {
    id: 3,
    name: "Dr. Anil Mehta",
    email: "anil.mehta@example.com",
    phone: "+91 9988776655",
    specialization: "Orthopedic",
    verified: true,
  },
  {
    id: 4,
    name: "Dr. Sneha Verma",
    email: "sneha.verma@example.com",
    phone: "+91 9876123450",
    specialization: "Pediatrician",
    verified: false,
  },
  {
    id: 5,
    name: "Dr. Vikram Singh",
    email: "vikram.singh@example.com",
    phone: "+91 9112233445",
    specialization: "Neurologist",
    verified: true,
  },
  {
    id: 6,
    name: "Dr. Anjali Gupta",
    email: "anjali.gupta@example.com",
    phone: "+91 9556677889",
    specialization: "Cardiologist",
    verified: false,
  },
];

const Verified_doc = () => {
  // All state and logic remains the same
  const [doctors, setDoctors] = useState(initialDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const location = useLocation();
  const isModalOpen = location.pathname === '/new-doctors';
  const [newDoctor, setNewDoctor] = useState({ name: "", email: "", phone: "", specialization: "", verified: false });

  const handleDelete = (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
    }
  };
  
  const handleStatusToggle = (doctorId) => {
    setDoctors(doctors.map(doctor => 
      doctor.id === doctorId 
        ? { ...doctor, verified: !doctor.verified } 
        : doctor
    ));
  };
  
  const handleAddNewDoctor = (e) => {
    e.preventDefault();
    const newId = doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1;
    setDoctors([...doctors, { ...newDoctor, id: newId }]);
    setNewDoctor({ name: "", email: "", phone: "", specialization: "", verified: false });
    navigate(-1);
  };

  const handleNewDoctorChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDoctor(prevState => ({ ...prevState, [name]: type === 'checkbox' ? checked : value }));
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const processedDoctors = useMemo(() => {
    let filteredDoctors = doctors.filter((doctor) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTermLower) ||
        doctor.specialization.toLowerCase().includes(searchTermLower);

      if (statusFilter === "all") {
        return matchesSearch;
      } else if (statusFilter === "verified") {
        return matchesSearch && doctor.verified;
      } else {
        return matchesSearch && !doctor.verified;
      }
    });

    if (sortConfig.key !== null) {
      filteredDoctors.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredDoctors;
  }, [doctors, searchTerm, statusFilter, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedDoctors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedDoctors.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const getSortIndicator = (key) => {
      if (sortConfig.key !== key) return null;
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
  }
  
  const csvHeaders = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Specialization", key: "specialization" },
    { label: "Status", key: "verified" }
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
          Doctors Management
        </h2>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1 sm:mt-0">
            {processedDoctors.length > 0 
              ? `Showing ${indexOfFirstItem + 1}-${indexOfFirstItem + currentItems.length} of ${processedDoctors.length}` 
              : "No doctors found"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-l-4 border-blue-500">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">Total Registered</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{doctors.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-l-4 border-green-500">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">Verified</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{doctors.filter(d => d.verified).length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-l-4 border-red-500">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">Not Verified</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{doctors.filter(d => !d.verified).length}</p>
          </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full sm:w-64 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <select
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full sm:w-auto bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="not-verified">Not Verified</option>
            </select>
        </div>
        
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <CSVLink
            data={processedDoctors}
            headers={csvHeaders}
            filename={"doctors-list.csv"}
            className="w-1/2 lg:w-auto text-center px-4 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Export CSV
          </CSVLink>
          <button 
            onClick={() => navigate('/new-doctors')}
            className="w-1/2 lg:w-auto px-4 py-2 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 transition"
          >
            Add New
          </button>
        </div>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="w-full border-collapse bg-white dark:bg-gray-800">
            <thead className="bg-blue-600 text-white text-left text-xs">
                <tr>
                    <th className="p-2 md:p-3">ID</th>
                    <th className="p-2 md:p-3 cursor-pointer" onClick={() => requestSort('name')}>Name {getSortIndicator('name')}</th>
                    <th className="p-2 md:p-3">Email</th>
                    <th className="p-2 md:p-3">Phone</th>
                    <th className="p-2 md:p-3 cursor-pointer" onClick={() => requestSort('specialization')}>Specialization {getSortIndicator('specialization')}</th>
                    <th className="p-2 md:p-3">Status</th>
                    <th className="p-2 md:p-3">Actions</th>
                </tr>
            </thead>
            <tbody className="text-xs md:text-sm">
                {currentItems.length > 0 ? (
                currentItems.map((doctor) => (
                <tr key={doctor.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <td className="p-2 md:p-3 font-medium text-gray-700 dark:text-gray-300">{doctor.id}</td>
                    <td className="p-2 md:p-3 text-gray-800 dark:text-gray-200">{doctor.name}</td>
                    <td className="p-2 md:p-3 text-gray-600 dark:text-gray-400">{doctor.email}</td>
                    <td className="p-2 md:p-3 text-gray-600 dark:text-gray-400">{doctor.phone}</td>
                    <td className="p-2 md:p-3 text-gray-800 dark:text-gray-200">{doctor.specialization}</td>
                    <td className="p-2 md:p-3">
                        <div className="flex items-center">
                            <button onClick={() => handleStatusToggle(doctor.id)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${doctor.verified ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${doctor.verified ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            <span className={`hidden lg:inline ml-3 text-xs font-semibold ${doctor.verified ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                {doctor.verified ? 'Verified' : 'Not Verified'}
                            </span>
                        </div>
                    </td>
                    <td className="p-2 md:p-3">
                        <button onClick={() => handleDelete(doctor.id)} className="px-3 py-1 rounded-md text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition">
                            Delete
                        </button>
                    </td>
                </tr>
                ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center p-6 text-gray-500 dark:text-gray-400">
                            No doctors found matching your criteria.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 sm:px-4 sm:py-2 mx-1 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 disabled:opacity-50"
            >
                Prev
            </button>
            <div className="hidden sm:flex">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 sm:px-4 sm:py-2 mx-1 rounded-md ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200'}`}
                  >
                      {number}
                  </button>
              ))}
            </div>
             <div className="sm:hidden text-sm text-gray-700 dark:text-gray-300 mx-2">
              Page {currentPage} of {totalPages}
            </div>
            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 sm:px-4 sm:py-2 mx-1 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 disabled:opacity-50"
            >
                Next
            </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Doctor</h3>
                <form onSubmit={handleAddNewDoctor}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <input type="text" name="name" value={newDoctor.name} onChange={handleNewDoctorChange} className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" name="email" value={newDoctor.email} onChange={handleNewDoctorChange} className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                        <input type="tel" name="phone" value={newDoctor.phone} onChange={handleNewDoctorChange} className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Specialization</label>
                        <input type="text" name="specialization" value={newDoctor.specialization} onChange={handleNewDoctorChange} className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" required />
                    </div>
                    <div className="flex items-center mb-6">
                        <input type="checkbox" name="verified" checked={newDoctor.verified} onChange={handleNewDoctorChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Verified</label>
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 mr-2">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white">Add Doctor</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Verified_doc;