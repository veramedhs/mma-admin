const doctors = [
  {
    id: 1,
    name: "Dr. Sharma",
    specialization: "Cardiologist",
    experience: "10 yrs",
    degrees: "MBBS, MD",
    location: "Delhi",
    clinic: "City Clinic",
    price: 500,
    availability: "9 AM - 5 PM",
    successRate: "95%"
  }
];

const DoctorList = () => {
  return (
    <div>
      {doctors.map((doc) => (
        <DoctorCard key={doc.id} doctor={doc} />
      ))}
    </div>
  );
};

export default DoctorList;