
import React from "react"; // Removed useEffect as it's no longer needed here
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { PlusCircle, Edit, Trash2 } from "lucide-react"; // Removed AlertCircle
import useLabStore from "../stores/useLabStore";
import { useEffect } from "react";


const Lab_list = () => {
    // ✅ Destructuring is simplified: The component no longer needs loading, error, or the fetch function.
    const { labList, deleteLab,fetchLabList } = useLabStore();

    // ✅ The useEffect hook that fetched data has been removed.

    useEffect(() => {
        fetchLabList();
    }, [fetchLabList]);

    // ✅ The handleDelete function remains unchanged and will work perfectly.
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
                                toast.dismiss(t.id);
                                deleteLab(labId).catch((err) => {
                                    console.error("Deletion failed:", err);
                                });
                            }}
                            className="w-full rounded bg-red-500 px-3 py-1 text-sm font-bold text-white hover:bg-red-600"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full rounded bg-slate-200 px-3 py-1 text-sm font-bold text-slate-800 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
            { duration: 6000 },
        );
    };

    const renderContent = () => {
        // ✅ Simplified render logic: No longer shows loading or error states.
        // It only checks if the list is empty or not.
        if (labList.length === 0) {
            return (
                <div className="p-10 text-center">
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No Labs Found</h3>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Add a laboratory to get started.</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                        {/* Table headers remain the same */}
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">Lab Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">Contact</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">Location</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">Status</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
                        {labList.map((lab) => (
                            <tr key={lab._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full object-cover" src={lab.labLogo} alt={`${lab.labName} Logo`} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-slate-900 dark:text-slate-50">{lab.labName}</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">{lab.accreditation || "N/A"}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm text-slate-900 dark:text-slate-50">{lab.email}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">{lab.phone}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                    {lab.address ? `${lab.address.city}, ${lab.address.state}` : "N/A"}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${lab.isVerified ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"}`}>
                                        {lab.isVerified ? "Verified" : "Pending"}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-x-4">
                                        <Link to={`/admin/labs/edit/${lab._id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        <button onClick={() => handleDelete(lab._id, lab.labName)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                            <Trash2 className="h-5 w-5" />
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
        <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-900 sm:p-6 lg:p-8">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-xl bg-white shadow-lg dark:bg-slate-800">
                <div className="border-b border-slate-200 p-6 dark:border-slate-700">
                    <div className="flex flex-col items-center justify-between sm:flex-row">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Laboratory List</h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage all registered laboratories.</p>
                        </div>
                        <Link to="/admin/labs/add" className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 sm:mt-0 sm:w-auto">
                            <PlusCircle className="mr-2 h-5 w-5" />
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