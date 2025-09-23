// DoctorCard.jsx
import React from "react";
import { MapPin, Stethoscope, Award, Trash2, Edit, ShieldCheck } from "lucide-react";

const DoctorCard = ({ doctor, onDelete }) => {
  if (!doctor) {
    return (
      <div className="p-4 text-red-500 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg">
        Doctor data not available.
      </div>
    );
  }

  // ✅ Consistent styling using the slate color palette
  const cardClasses = "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  const headingClasses = "text-slate-800 dark:text-slate-100";
  const secondaryTextClasses = "text-slate-500 dark:text-slate-400";
  const iconColor = "text-blue-500"; // Using accent color for icons

  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border ${cardClasses}`}
    >
      {/* Doctor Image */}
      <div className="relative flex-shrink-0">
        <img
          src={doctor.image || `https://via.placeholder.com/150`}
          alt={doctor.name}
          className="w-28 h-28 rounded-full object-cover ring-4 ring-slate-200 dark:ring-slate-700"
        />
        {/* ✅ NEW: Verification Badge */}
        {doctor.isVerified && (
           <div className="absolute bottom-0 right-0 flex items-center bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
             <ShieldCheck className="w-3.5 h-3.5 mr-1" />
             Verified
           </div>
        )}
      </div>

      {/* Doctor Info */}
      <div className="flex-1 space-y-2 text-center md:text-left">
        <h2 className={`text-2xl font-bold tracking-wide ${headingClasses}`}>
          {doctor.name}
        </h2>
        <p className={`flex items-center justify-center md:justify-start font-medium`}>
          <Stethoscope className={`w-4 h-4 mr-2 ${iconColor}`} />
          {doctor.specialization}
        </p>
        <p className={`flex items-center justify-center md:justify-start text-sm ${secondaryTextClasses}`}>
          <Award className={`w-4 h-4 mr-2 ${iconColor}`} /> {doctor.experience} years •{" "}
          {doctor.degrees}
        </p>
        <p className={`flex items-center justify-center md:justify-start text-sm ${secondaryTextClasses}`}>
          <MapPin className={`w-4 h-4 mr-2 ${iconColor}`} /> {doctor.location}
        </p>
      </div>

      {/* Action Section */}
      <div className="flex flex-col items-center md:items-end gap-3 border-t border-slate-200 dark:border-slate-700 md:border-none pt-4 md:pt-0 w-full md:w-auto">
        <p className={`text-2xl font-bold ${headingClasses}`}>
          ₹{doctor.price.toLocaleString()}
          <span className={`text-sm font-normal ${secondaryTextClasses}`}> / consultation</span>
        </p>

        {/* Edit and Delete Buttons */}
        <div className="flex gap-2 mt-2">
          
          <button
            onClick={() => onDelete && onDelete(doctor._id)}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;