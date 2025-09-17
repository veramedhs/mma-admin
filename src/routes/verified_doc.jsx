import React, { useState, useMemo, useEffect } from "react";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import useDoctorsListStore from "../stores/useDoctorsListStore"; // Adjust the import path

const DEFAULT_AVATAR = "https://i.pravatar.cc/150";

const Verified_doc = () => {
    // ✅ Get all state and actions from our new store
    const {
        doctors,
        loading,
        error,
        totalDoctors,
        fetchDoctors,
        deleteDoctor,
        toggleDoctorStatus
    } = useDoctorsListStore();

    const navigate = useNavigate();

    // Local state for UI controls (search, filter, sort, pagination)
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch doctors when the component first loads
    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    // ✅ Memoized function to process and prepare doctors for display
    const processedDoctors = useMemo(() => {
        // First, map the complex API data to a simpler structure for the table
        const mappableDoctors = doctors.map(doc => ({
            _id: doc._id,
            name: `${doc.user?.firstName || ''} ${doc.user?.lastName || ''}`.trim(),
            email: doc.user?.email || 'N/A', // Use optional chaining and defaults
            phone: doc.user?.phone || 'N/A',
            specialization: doc.specialization || 'N/A',
            isVerified: doc.isVerified,
            profilePicture: doc.profilePicture
        }));

        // Now, filter based on search and status
        let filteredDoctors = mappableDoctors.filter((doctor) => {
            const searchTermLower = searchTerm.toLowerCase();
            const matchesSearch =
                doctor.name.toLowerCase().includes(searchTermLower) ||
                doctor.specialization.toLowerCase().includes(searchTermLower);

            if (statusFilter === "all") return matchesSearch;
            if (statusFilter === "verified") return matchesSearch && doctor.isVerified;
            return matchesSearch && !doctor.isVerified;
        });

        // Finally, sort the results
        if (sortConfig.key) {
            filteredDoctors.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return filteredDoctors;
    }, [doctors, searchTerm, statusFilter, sortConfig]);

    const requestSort = (key) => {
        let direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({ key, direction });
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = processedDoctors.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(processedDoctors.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
    };

    // Prepare data for CSV export
    const csvData = useMemo(() => processedDoctors.map(d => ({ ...d, status: d.isVerified ? 'Verified' : 'Not Verified' })), [processedDoctors]);
    const csvHeaders = [
        { label: "ID", key: "_id" }, { label: "Name", key: "name" }, { label: "Email", key: "email" },
        { label: "Phone", key: "phone" }, { label: "Specialization", key: "specialization" }, { label: "Status", key: "status" }
    ];

    if (loading) return <div className="p-6 text-center text-lg">Loading Doctors...</div>;
    if (error) return <div className="p-6 text-center text-red-500"><p>Error: {error}</p></div>;

    return (
        <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-4">
                <h2 className="text-2xl md:text-3xl font-bold">Doctors Management</h2>
                <div className="text-sm font-medium">{`Showing ${indexOfFirstItem + 1}-${indexOfFirstItem + currentItems.length} of ${processedDoctors.length}`}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-l-4 border-blue-500">
                    <h3>Total Registered</h3>
                    <p className="text-2xl font-bold">{totalDoctors}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-l-4 border-green-500">
                    <h3>Verified</h3>
                    <p className="text-2xl font-bold">{doctors.filter(d => d.isVerified).length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-l-4 border-red-500">
                    <h3>Not Verified</h3>
                    <p className="text-2xl font-bold">{doctors.filter(d => !d.isVerified).length}</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <input type="text" placeholder="Search..." className="p-2 border rounded-md w-full sm:w-64"
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                    <select className="p-2 border rounded-md w-full sm:w-auto"
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                        <option value="all">All Statuses</option>
                        <option value="verified">Verified</option>
                        <option value="not-verified">Not Verified</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <CSVLink data={csvData} headers={csvHeaders} filename="doctors.csv" className="w-1/2 lg:w-auto text-center px-4 py-2 rounded-md font-semibold bg-blue-600 text-white">Export CSV</CSVLink>
                    <button onClick={() => navigate('/admin/doctors/create')} className="w-1/2 lg:w-auto px-4 py-2 rounded-md font-semibold bg-green-600 text-white">Add New</button>
                </div>
            </div>

            <div className="overflow-x-auto shadow-lg rounded-xl">
                <table className="w-full border-collapse bg-white dark:bg-gray-800">
                    <thead className="bg-blue-600 text-white text-left text-xs">
                        <tr>
                            <th className="p-3">Photo</th>
                            <th className="p-3 cursor-pointer" onClick={() => requestSort('name')}>Name {getSortIndicator('name')}</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Specialization</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((doctor) => (
                            <tr key={doctor._id} className="border-b hover:bg-gray-100">
                                <td className="p-3"><img src={doctor.profilePicture || DEFAULT_AVATAR} alt={doctor.name} className="h-10 w-10 rounded-full object-cover" /></td>
                                <td className="p-3">{doctor.name}</td>
                                <td className="p-3">{doctor.email}</td>
                                <td className="p-3">{doctor.specialization}</td>
                                <td className="p-3">
                                    <button onClick={() => toggleDoctorStatus(doctor._id, doctor.isVerified)}
                                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${doctor.isVerified ? 'bg-green-500' : 'bg-gray-300'}`}>
                                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${doctor.isVerified ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </td>
                                <td className="p-3">
                                    <button onClick={() => deleteDoctor(doctor._id)} className="px-3 py-1 rounded-md text-xs font-semibold bg-red-500 text-white">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && ( <div className="flex justify-center mt-6">{/* Pagination UI */}</div> )}
        </div>
    );
};

export default Verified_doc;