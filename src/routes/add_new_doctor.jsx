import  { useState } from 'react';
import toast from 'react-hot-toast';
import useDoctorStore from '../stores/useNewDoctorStore';

const AddDoctorProfile = () => {
  // Zustand स्टोर से एक्शन और लोडिंग स्टेट प्राप्त करें
  const { createDoctorProfile, loading } = useDoctorStore();

  // फॉर्म के इनपुट के लिए स्टेट
  const [formData, setFormData] = useState({
    fullName: '',
    designation: '',
    specialization: '',
    workExperience: '',
    workHistory: '', // इन्हें कॉमा-सेपरेटेड स्ट्रिंग के रूप में लिया जाएगा
    education: '',
    memberships: '',
    awards: '',
    specialtyInterests: '',
    researchPaper: '',
  });

  // फाइल इनपुट के लिए स्टेट
  const [profileImg, setProfileImg] = useState(null);

  // टेक्स्ट इनपुट में बदलाव को हैंडल करें
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // फाइल इनपुट में बदलाव को हैंडल करें
  const handleFileChange = (e) => {
    setProfileImg(e.target.files[0]);
  };

  // फॉर्म सबमिशन को हैंडल करें
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileImg) {
      toast.error('Profile image is required.');
      return;
    }

    // FormData ऑब्जेक्ट बनाएं क्योंकि हम फाइल अपलोड कर रहे हैं
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    data.append('profileImg', profileImg); // multer में दिए गए नाम से मेल खाना चाहिए

    // टोस्ट के साथ Zustand एक्शन को कॉल करें
    await toast.promise(
      createDoctorProfile(data),
      {
        loading: 'Creating profile...',
        success: (res) => {
          // फॉर्म को रीसेट करें
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
          e.target.reset(); // फाइल इनपुट को रीसेट करने के लिए
          return res.message || 'Profile created successfully!';
        },
        error: (err) => err.message || 'Failed to create profile.',
      }
    );
  };

  // स्टाइल के लिए कुछ बेसिक Tailwind CSS क्लासेस
  const inputStyle = "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelStyle = "block mb-1 font-medium text-gray-700";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Create New Doctor Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className={labelStyle}>Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={inputStyle} required />
        </div>

        {/* Profile Image */}
        <div>
          <label htmlFor="profileImg" className={labelStyle}>Profile Image</label>
          <input type="file" name="profileImg" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
        </div>

        {/* Designation & Specialization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="designation" className={labelStyle}>Designation</label>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange} className={inputStyle} />
          </div>
          <div>
            <label htmlFor="specialization" className={labelStyle}>Specialization</label>
            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className={inputStyle} />
          </div>
        </div>

        {/* Work Experience */}
        <div>
          <label htmlFor="workExperience" className={labelStyle}>Work Experience (in years)</label>
          <input type="number" name="workExperience" value={formData.workExperience} onChange={handleChange} className={inputStyle} min="0" />
        </div>

        {/* Array Fields (comma-separated) */}
        <div>
          <label htmlFor="workHistory" className={labelStyle}>Work History (comma-separated)</label>
          <textarea name="workHistory" value={formData.workHistory} onChange={handleChange} className={inputStyle} placeholder="Hospital A, Clinic B, ..."></textarea>
        </div>
        <div>
          <label htmlFor="education" className={labelStyle}>Education (comma-separated)</label>
          <textarea name="education" value={formData.education} onChange={handleChange} className={inputStyle} placeholder="MBBS, MD, ..."></textarea>
        </div>
        <div>
          <label htmlFor="memberships" className={labelStyle}>Memberships (comma-separated)</label>
          <textarea name="memberships" value={formData.memberships} onChange={handleChange} className={inputStyle}></textarea>
        </div>
        <div>
          <label htmlFor="awards" className={labelStyle}>Awards (comma-separated)</label>
          <textarea name="awards" value={formData.awards} onChange={handleChange} className={inputStyle}></textarea>
        </div>
        <div>
          <label htmlFor="specialtyInterests" className={labelStyle}>Specialty Interests (comma-separated)</label>
          <textarea name="specialtyInterests" value={formData.specialtyInterests} onChange={handleChange} className={inputStyle}></textarea>
        </div>
        <div>
          <label htmlFor="researchPaper" className={labelStyle}>Research Papers (comma-separated)</label>
          <textarea name="researchPaper" value={formData.researchPaper} onChange={handleChange} className={inputStyle}></textarea>
        </div>

        {/* Submit Button */}
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