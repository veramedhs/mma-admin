import { useState } from 'react';
import toast from 'react-hot-toast';
import useDoctorStore from '../stores/useNewDoctorStore';

const AddDoctorProfile = () => {
  const { createDoctorProfile, loading } = useDoctorStore();

  const [formData, setFormData] = useState({
    fullName: '',
    designation: '',
    specialization: '',
    workExperience: '',
    workHistory: '',
    education: '',
    memberships: '',
    awards: '',
    specialtyInterests: '',
    researchPaper: '',
  });

  const [profileImg, setProfileImg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfileImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileImg) {
      toast.error('Profile image is required.');
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    data.append('profileImg', profileImg);

    try {
      // Store already handles toast.loading/success/error via toast.promise
      await createDoctorProfile(data);

      // Reset form on success
      setFormData({
        fullName: '',
        designation: '',
        specialization: '',
        workExperience: '',
        workHistory: '',
        education: '',
        memberships: '',
        awards: '',
        specialtyInterests: '',
        researchPaper: '',
      });
      setProfileImg(null);
      e.target.reset();
    } catch {
        new Error('Something went wrong');
    }
  };

  const inputStyle =
    'w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelStyle = 'block mb-1 font-medium text-gray-700';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Create New Doctor Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className={labelStyle}>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder='Dr. John Doe'
            value={formData.fullName}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        {/* Profile Image */}
        <div>
          <label htmlFor="profileImg" className={labelStyle}>Profile Image</label>
          <input
            type="file"
            name="profileImg"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>

        {/* Designation & Specialization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="designation" className={labelStyle}>Designation</label>
            <input
              type="text"
              placeholder='Designation'
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="specialization" className={labelStyle}>Specialization</label>
            <input
              type="text"
              name="specialization"
              placeholder='Specialization'
              value={formData.specialization}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </div>

        {/* Work Experience */}
        <div>
          <label htmlFor="workExperience" className={labelStyle}>Work Experience (in years)</label>
          <input
            type="number"
            placeholder='Work Experience in numbers'
            name="workExperience"
            value={formData.workExperience}
            onChange={handleChange}
            className={inputStyle}
            min="0"
          />
        </div>

        {/* Array Fields (PIPE-separated) */}
        <div>
          <label htmlFor="workHistory" className={labelStyle}>Work History (use | to separate)</label>
          <textarea
            name="workHistory"
            value={formData.workHistory}
            onChange={handleChange}
            className={inputStyle}
            placeholder="AIIMS Delhi | Fortis Hospital"
          />
        </div>

        <div>
          <label htmlFor="education" className={labelStyle}>Education (use | to separate)</label>
          <textarea
            name="education"
            value={formData.education}
            onChange={handleChange}
            className={inputStyle}
            placeholder="MBBS - AIIMS | MD - Cardiology | PGI Chandigarh"
          />
        </div>

        <div>
          <label htmlFor="memberships" className={labelStyle}>Memberships (use | to separate)</label>
          <textarea
            name="memberships"
            value={formData.memberships}
            onChange={handleChange}
            className={inputStyle}
            placeholder="Indian Medical Association | Cardiology Society of India"
          />
        </div>

        <div>
          <label htmlFor="awards" className={labelStyle}>Awards (use | to separate)</label>
          <textarea
            name="awards"
            value={formData.awards}
            onChange={handleChange}
            className={inputStyle}
            placeholder="Best Doctor Award 2020 | Research Excellence 2022"
          />
        </div>

        <div>
          <label htmlFor="specialtyInterests" className={labelStyle}>Specialty Interests (use | to separate)</label>
          <textarea
            name="specialtyInterests"
            value={formData.specialtyInterests}
            onChange={handleChange}
            className={inputStyle}
            placeholder="Heart Transplant | Preventive Cardiology"
          />
        </div>

        <div>
          <label htmlFor="researchPaper" className={labelStyle}>Research Papers (use | to separate)</label>
          <textarea
            name="researchPaper"
            value={formData.researchPaper}
            onChange={handleChange}
            className={inputStyle}
            placeholder="Indian Heart Journal 2021 | Journal of Cardiology 2019"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default AddDoctorProfile;
