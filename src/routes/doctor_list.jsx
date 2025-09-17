import React, { useEffect } from "react";
import useDoctorsListStore from "../stores/useDoctorsListStore"; // Import the Zustand store
import DoctorCard from "../components/Doctocard";

// A Skeleton component for a better loading UI
const DoctorCardSkeleton = () => (
  <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl shadow-lg bg-slate-100 dark:bg-slate-800 animate-pulse">
    <div className="w-28 h-28 rounded-full bg-slate-300 dark:bg-slate-700 flex-shrink-0"></div>
    <div className="flex-1 space-y-3 text-center md:text-left w-full">
      <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
      <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
      <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
    </div>
    <div className="flex flex-col items-center md:items-end gap-3 w-24">
        <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
    </div>
  </div>
);


const DoctorList = () => {
  // ✅ Get all state and actions directly from the Zustand store
  const { doctors, loading, error, fetchDoctors, deleteDoctor } = useDoctorsListStore();

  // Fetch doctors when the component first mounts. The store handles the logic.
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // --- Event Handlers ---
  const handleEdit = (doctor) => {
    // Navigate to an edit page or open a modal
    console.log("Editing doctor:", doctor);
    // Example: navigate(`/admin/doctors/edit/${doctor._id}`);
  };

  // The deleteDoctor function is passed directly from the store
  const handleDelete = deleteDoctor;


  // --- Conditional Rendering ---
  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-800 dark:text-slate-200">Our Doctors</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Render skeleton loaders based on a default number */}
          {[...Array(4)].map((_, i) => <DoctorCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-center text-red-500">Error: {error}</p>;
  }

  if (!doctors || doctors.length === 0) {
    return <p className="p-4 text-center text-gray-500">No doctors available at the moment.</p>;
  }


  return (
    <div className="container mx-auto p-4 lg:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-800 dark:text-slate-200">Meet Our Specialists</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {doctors.map((doc) => {
                // ✅ Data Transformation: Map API data to DoctorCard props
                const transformedDoctor = {
                    _id: doc._id,
                    name: `Dr. ${doc.user?.firstName || ''} ${doc.user?.lastName || ''}`.trim(),
                    specialization: doc.specialization || 'General Physician',
                    experience: `${doc.yearsOfExperience || 'N/A'} years of experience`,
                    degrees: Array.isArray(doc.qualifications) && doc.qualifications.length > 0
                        ? doc.qualifications.join(', ')
                        : 'MBBS',
                    location: `${doc.clinicAddress?.city || 'Unknown'}, ${doc.clinicAddress?.state || 'N/A'}`,
                    clinic: doc.clinicAddress?.street || 'Main Clinic',
                    price: doc.consultationFee || 'N/A',
                    availability: 'Available Today', // Placeholder
                    image: doc.profilePicture,
                    successRate: '98%', // Placeholder
                };

                return (
                    <DoctorCard
                        key={doc._id}
                        doctor={transformedDoctor}
                        onEdit={() => handleEdit(transformedDoctor)}
                        onDelete={() => handleDelete(transformedDoctor._id)}
                    />
                );
            })}
        </div>
    </div>
  );
};

export default DoctorList;