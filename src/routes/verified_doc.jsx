import React, { useState, useMemo, useEffect } from "react";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import useDoctorsListStore from "../stores/useDoctorsListStore";
// --- Import icons from lucide-react ---
import { UserPlus, Download, Trash2, AlertTriangle, ArrowUpDown } from 'lucide-react';

const DEFAULT_AVATAR = "https://i.pravatar.cc/150";

const Verified_doc = () => {
    const {
        doctors, loading, error, totalDoctors,
        fetchDoctors, deleteDoctor, toggleDoctorStatus
    } = useDoctorsListStore();

    const navigate = useNavigate();

    // Local state for UI controls
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    // Memoized processing of doctors for display
    const processedDoctors = useMemo(() => {
        const mappableDoctors = doctors.map(doc => ({
            _id: doc._id,
            name: `${doc.user?.firstName || ''} ${doc.user?.lastName || ''}`.trim(),
            email: doc.user?.email || 'N/A',
            phone: doc.user?.phone || 'N/A',
            specialization: doc.specialization || 'N/A',
            isVerified: doc.isVerified,
            profilePicture: doc.profilePicture
        }));

        let filteredDoctors = mappableDoctors.filter((doctor) => {
            const searchTermLower = searchTerm.toLowerCase();
            const matchesSearch =
                doctor.name.toLowerCase().includes(searchTermLower) ||
                doctor.specialization.toLowerCase().includes(searchTermLower);

            if (statusFilter === "all") return matchesSearch;
            if (statusFilter === "verified") return matchesSearch && doctor.isVerified;
            return matchesSearch && !doctor.isVerified;
        });

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
    const totalPages = Math.ceil(processedDoctors.length / itemsPerPage);
    const currentItems = processedDoctors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // CSV Data Preparation
    const csvData = useMemo(() => processedDoctors.map(d => ({ ...d, status: d.isVerified ? 'Verified' : 'Not Verified' })), [processedDoctors]);
    const csvHeaders = [{ label: "ID", key: "_id" }, { label: "Name", key: "name" }, { label: "Email", key: "email" }, { label: "Phone", key: "phone" }, { label: "Specialization", key: "specialization" }, { label: "Status", key: "status" }];

    // --- Conditional Renders for Loading and Error States ---
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                    <strong className="font-bold mr-2">Error:</strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100">
            {/* --- Header --- */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold">Doctors Management</h2>
                <p className="text-slate-500 dark:text-slate-400">Manage, verify, and view all registered doctors.</p>
            </div>

            {/* --- Stats Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Registered</h3>
                    <p className="text-3xl font-bold mt-1">{totalDoctors}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Verified Doctors</h3>
                    <p className="text-3xl font-bold mt-1">{doctors.filter(d => d.isVerified).length}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-l-4 border-red-500">
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Verification</h3>
                    <p className="text-3xl font-bold mt-1">{doctors.filter(d => !d.isVerified).length}</p>
                </div>
            </div>

            {/* --- Toolbar --- */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <input type="text" placeholder="Search by name or specialization..."
                        className="w-full lg:w-64 px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                    <select className="w-full sm:w-auto px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                        <option value="all">All Statuses</option>
                        <option value="verified">Verified</option>
                        <option value="not-verified">Not Verified</option>
                    </select>
                </div>
                <div className="flex gap-2 w-full lg:w-auto">
                    <CSVLink data={csvData} headers={csvHeaders} filename="doctors_export.csv"
                        className="flex-grow lg:flex-grow-0 inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-700 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors">
                        <Download size={16} /> Export
                    </CSVLink>
                    <button onClick={() => navigate('/admin/doctors/create')}
                        className="flex-grow lg:flex-grow-0 inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                        <UserPlus size={16} /> Add New
                    </button>
                </div>
            </div>

            {/* --- Doctors Table --- */}
            <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-md rounded-xl">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Doctor</th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('specialization')}>
                                <div className="flex items-center gap-1">Specialization <ArrowUpDown size={14} /></div>
                            </th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? currentItems.map((doctor) => (
                            <tr key={doctor._id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-4">
                                        <img className="w-12 h-12 rounded-full object-cover" src={doctor.profilePicture || DEFAULT_AVATAR} alt={`${doctor.name} avatar`} />
                                        <div>
                                            <div className="font-semibold text-slate-900 dark:text-white">{doctor.name}</div>
                                            <div className="text-slate-500 dark:text-slate-400">{doctor.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{doctor.specialization}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={doctor.isVerified} onChange={() => toggleDoctorStatus(doctor._id)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                        <span className={`font-semibold text-xs ${doctor.isVerified ? 'text-green-500' : 'text-slate-500'}`}>
                                            {doctor.isVerified ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => deleteDoctor(doctor._id)}
                                        className="p-2 text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center py-10 text-slate-500">No doctors found matching your criteria.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- Pagination --- */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6">
                    <div className="flex items-center space-x-2">
                         <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                            Previous
                        </button>
                        <div className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300">
                           Page {currentPage} of {totalPages}
                        </div>
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Verified_doc;