// DoctorCard.jsx
import React, { useContext } from "react";
import { ThemeProviderContext } from "@/contexts/theme-context";
import { MapPin, Stethoscope, Award, Clock, Trash2, Edit } from "lucide-react";

const DoctorCard = ({ doctor, onEdit, onDelete }) => {
  const { theme } = useContext(ThemeProviderContext);

  if (!doctor) {
    return (
      <div className="p-4 text-red-500 border border-red-200 rounded-lg">
        Doctor data not available
      </div>
    );
  }

  // Theme styles
  const cardClasses =
    theme === "dark"
      ? "bg-gray-900 text-gray-100 border-gray-700"
      : "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900 border-blue-200";

  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl shadow-lg hover:shadow-blue-200 transition-all duration-300 border ${cardClasses}`}
    >
      {/* Doctor Image */}
      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-400 shadow-md flex-shrink-0">
        <img
          src={doctor.image || `https://via.placeholder.com/150`}
          alt={doctor.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Doctor Info */}
      <div className="flex-1 space-y-2 text-center md:text-left">
        <h2 className="text-xl font-bold tracking-wide text-blue-800">
          {doctor.name}
        </h2>
        <p className="flex items-center justify-center md:justify-start text-sm font-medium text-blue-700">
          <Stethoscope className="w-4 h-4 mr-2 text-blue-500" />{" "}
          {doctor.specialization}
        </p>
        <p className="flex items-center justify-center md:justify-start text-sm text-blue-600">
          <Award className="w-4 h-4 mr-2 text-blue-400" /> {doctor.experience} •{" "}
          {doctor.degrees}
        </p>
        <p className="flex items-center justify-center md:justify-start text-sm text-blue-600">
          <MapPin className="w-4 h-4 mr-2 text-blue-400" /> {doctor.location} —{" "}
          {doctor.clinic}
        </p>
        {doctor.successRate && (
          <p className="text-blue-700 text-sm font-medium">
            👍 {doctor.successRate} Success Rate
          </p>
        )}
      </div>

      {/* Action Section */}
      <div className="flex flex-col items-center md:items-end gap-3">
        <p className="text-lg font-bold text-blue-800">₹{doctor.price}</p>

        {/* Availability */}
        <span className="flex items-center text-xs text-blue-600">
          <Clock className="w-3 h-3 mr-1 text-blue-400" /> {doctor.availability}
        </span>

        {/* Edit and Delete Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onEdit && onEdit(doctor)}
            className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm shadow"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => onDelete && onDelete(doctor._id || doctor.id)}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm shadow"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
