import React, { useEffect } from "react";
import useDoctorsListStore from "../stores/useDoctorsListStore"; // Import the Zustand store
import DoctorCard from "../components/Doctocard";
import { ShieldCheck } from 'lucide-react'; // Import an icon for the skeleton

// ✅ Skeleton component updated to match the new card theme
const DoctorCardSkeleton = () => (
  <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl shadow-lg bg-white dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-700">
    <div className="w-28 h-28 rounded-full bg-slate-300 dark:bg-slate-700 flex-shrink-0"></div>
    <div className="flex-1 space-y-3 text-center md:text-left w-full">
      <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mx-auto md:mx-0"></div>
      <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2 mx-auto md:mx-0"></div>
      <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
      <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-2/3 mx-auto md:mx-0"></div>
    </div>
    <div className="flex flex-col items-center md:items-end gap-3 w-32">
        <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-1/2 mt-2"></div>
    </div>
  </div>
);


const DoctorList = () => {
  const { doctors, loading, error, fetchDoctors, deleteDoctor } = useDoctorsListStore();

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);



  const handleDelete = deleteDoctor;

  if (loading) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
        <div className="container mx-auto p-4 lg:p-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-slate-800 dark:text-slate-100">Meet Our Specialists</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => <DoctorCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-center text-red-500">Error: {error}</p>;
  }

  if (!doctors || doctors.length === 0) {
    return <p className="p-4 text-center text-slate-500 dark:text-slate-400">No doctors available at the moment.</p>;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="container mx-auto p-4 lg:p-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-slate-800 dark:text-slate-100">Meet Our Specialists</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {doctors.map((doc) => {
                  // ✅ Data Transformation: Correctly map API data to DoctorCard props
                  const transformedDoctor = {
                      _id: doc._id,
                      name: `Dr. ${doc.user?.firstName || ''} ${doc.user?.lastName || ''}`.trim(),
                      specialization: doc.specialization || 'General Physician',
                      experience: doc.yearsOfExperience,
                      // ✅ IMPROVEMENT: Correctly map the qualifications array of objects
                      degrees: Array.isArray(doc.qualifications) && doc.qualifications.length > 0
                          ? doc.qualifications.map(q => q.degree).join(', ')
                          : 'MBBS',
                      location: `${doc.clinicAddress?.city || 'Unknown City'}, ${doc.clinicAddress?.state || 'N/A'}`,
                      clinic: doc.clinicAddress?.street || 'Main Clinic',
                      price: doc.consultationFee || 0,
                      image: doc.profilePicture,
                      isVerified: doc.isVerified, // ✅ Pass verification status
                  };

                  return (
                      <DoctorCard
                          key={doc._id}
                          doctor={transformedDoctor}
                          onDelete={() => handleDelete(transformedDoctor._id)}
                      />
                  );
              })}
          </div>
      </div>
    </div>
  );
};

export default DoctorList;