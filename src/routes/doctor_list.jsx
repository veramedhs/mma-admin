// src/routes/doctor_list.jsx
import React, { useEffect, useState } from "react";
import DoctorCard from "../components/Doctocard";

const Doctor_list = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://192.168.1.4:5000/api/doctors");
        if (!res.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await res.json();
        console.log("API Response:", data);

        // ✅ Fix: agar doctors ek array hai toh direct use karo,
        // agar object ke andar doctors field hai toh usko use karo
        if (Array.isArray(data)) {
          setDoctors(data);
        } else if (Array.isArray(data.doctors)) {
          setDoctors(data.doctors);
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <p className="p-4 text-blue-500">Loading doctors...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">Error: {error}</p>;
  }

  if (!doctors || doctors.length === 0) {
    return <p className="text-gray-500 p-4">No doctors available.</p>;
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doc) => (
        <DoctorCard key={doc._id || doc.id} doctor={doc} />
      ))}
    </div>
  );
};

export default Doctor_list;
