// import { useState } from "react";
// import axios from "axios";
// import Tesseract from "tesseract.js";
// import { FiUpload } from "react-icons/fi";

// const JobForm = ({ setJobData, setLoading, setError }) => {
//   const [url, setUrl] = useState("");
//   const [jobPost, setJobPost] = useState("");
//   const [platform, setPlatform] = useState("");
//   const [extractingText, setExtractingText] = useState(false);
//   const [hasLogo, setHasLogo] = useState(false);
//   const [experience, setExperience] = useState("");
//   const [education, setEducation] = useState("");
//   const [employment, setEmployment] = useState("");
//   const [hasQuestion, setHasQuestion] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       // const response = await axios.post("https://job-validator-2.onrender.com//api/analyze2", {
//       const response = await axios.post("http://localhost:5000//api/analyze2", {
//         url: url || null,
//         job_post: jobPost || null,
//         platform: platform || null,
//         has_logo: hasLogo,
//         experience: experience || null,
//         education: education || null,
//         employment: employment || null,
//         hasQuestion,
//       });

//       setJobData(response.data);
//     } catch (error) {
//       setError(
//         error.response?.data?.error ||
//           "An error occurred while analyzing the job posting"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setExtractingText(true);
//     try {
//       const {
//         data: { text },
//       } = await Tesseract.recognize(file, "eng", {
//         logger: (m) => console.log(m),
//       });
//       setJobPost(text);
//     } catch (error) {
//       console.error("OCR Error:", error);
//       setError("Failed to extract text from image");
//     } finally {
//       setExtractingText(false);
//     }
//   };

//   const experience_order = [
//     "Not Provided", "Not Applicable", "Internship (0-1)", "Entry level (0-2)",
//     "Associate (1-3)", "Mid-Senior level (4-7)", "Director (8-12)", "Executive (12+)"
//   ];

//   const education_order = [
//     "Not Provided", "Unspecified", "Some High School Coursework", "High School or equivalent",
//     "Vocational - HS Diploma", "Some College Coursework Completed", "Certification", "Vocational",
//     "Vocational - Degree", "Associate Degree", "Bachelor's Degree", "Master's Degree", "Doctorate", "Professional"
//   ];

//   const employment_order = [
//     "Not Provided", "Other", "Temporary", "Contract", "Part-time", "Full-time"
//   ];

//   return (
//     <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl">
//       <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
//         <div className="mb-6">
//           <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
//             Job Analysis Form
//           </h2>
//           <p className="text-gray-600 text-sm sm:text-base">
//             Upload or paste job details for comprehensive analysis
//           </p>
//         </div>
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* URL Input */}
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               Job URL
//             </label>
//             <input
//               type="text"
//               placeholder="Paste job URL here"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               className="w-full px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 text-sm sm:text-base"
//             />
//           </div>

//           {/* Image Upload */}
//           <div className="space-y-3">
//             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
//               <label className="block text-sm font-semibold text-gray-700">
//                 Upload Job Image
//               </label>
//               <div className="flex items-center gap-3">
//                 <label 
//                   htmlFor="imageUpload" 
//                   className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md"
//                 >
//                   <FiUpload size={16} className="mr-2" />
//                   Upload Image
//                 </label>
//                 <input
//                   id="imageUpload"
//                   type="file"
//                   accept="image/jpeg, image/png"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                 />
//               </div>
//             </div>
//             {extractingText && (
//               <div className="flex items-center gap-2 text-blue-600 text-sm p-3 bg-blue-50 rounded-lg">
//                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
//                 <span>Extracting text from image...</span>
//               </div>
//             )}
//           </div>

//           {/* Job Description */}
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               Job Description
//             </label>
//             <textarea
//               placeholder="Paste job post content here..."
//               value={jobPost}
//               onChange={(e) => setJobPost(e.target.value)}
//               rows={6}
//               className="w-full px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 resize-vertical text-sm sm:text-base"
//             />
//           </div>

//           {/* Company Logo Toggle */}
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
//             <div className="text-gray-800 font-medium text-sm sm:text-base">
//               Company Logo Present?
//             </div>
//             <div
//               onClick={() => setHasLogo(!hasLogo)}
//               className={`relative inline-flex w-12 h-6 rounded-full cursor-pointer transition-all duration-300 ${
//                 hasLogo ? 'bg-green-500' : 'bg-gray-400'
//               } hover:shadow-lg transform hover:scale-105`}
//             >
//               <div
//                 className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
//                   hasLogo ? 'translate-x-6' : 'translate-x-0.5'
//                 }`}
//               />
//             </div>
//           </div>

//           {/* Platform Selection */}
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               Select Job Platform
//             </label>
//             <select
//               value={platform}
//               onChange={(e) => setPlatform(e.target.value)}
//               className="w-full px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 text-sm sm:text-base"
//             >
//               <option value="">-- Choose a Platform --</option>
//               <option value="LinkedIn">LinkedIn</option>
//               <option value="Naukri">Naukri</option>
//               <option value="Internshala">Internshala</option>
//               <option value="Unstop">Unstop</option>
//               <option value="Others">Others</option>
//             </select>
//           </div>

//           {/* Experience Level */}
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               Experience Level
//             </label>
//             <select
//               value={experience}
//               onChange={(e) => setExperience(e.target.value)}
//               className="w-full px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 text-sm sm:text-base"
//             >
//               <option value="">-- Select Experience --</option>
//               {experience_order.map((level, idx) => (
//                 <option key={idx} value={level}>{level}</option>
//               ))}
//             </select>
//           </div>

//           {/* Education Level */}
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               Education Level
//             </label>
//             <select
//               value={education}
//               onChange={(e) => setEducation(e.target.value)}
//               className="w-full px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 text-sm sm:text-base"
//             >
//               <option value="">-- Select Education --</option>
//               {education_order.map((level, idx) => (
//                 <option key={idx} value={level}>{level}</option>
//               ))}
//             </select>
//           </div>

//           {/* Employment Type */}
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               Employment Type
//             </label>
//             <select
//               value={employment}
//               onChange={(e) => setEmployment(e.target.value)}
//               className="w-full px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 text-sm sm:text-base"
//             >
//               <option value="">-- Select Employment --</option>
//               {employment_order.map((type, idx) => (
//                 <option key={idx} value={type}>{type}</option>
//               ))}
//             </select>
//           </div>

//           {/* Has Question */}
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               Are there questions in job post?
//             </label>
//             <select
//               value={hasQuestion}
//               onChange={(e) => setHasQuestion(e.target.value === "true")}
//               className="w-full px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 text-sm sm:text-base"
//             >
//               <option value="true">Yes</option>
//               <option value="false">No</option>
//             </select>
//           </div>

//           {/* Submit Button */}
//           <button 
//             type="submit" 
//             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 sm:py-4 sm:px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 text-base sm:text-lg"
//           >
//             Analyze Job Posting
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default JobForm;


















































import { useState } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";
import { FiUpload } from "react-icons/fi";

const JobForm = ({ setJobData, setLoading, setError }) => {
  const [url, setUrl] = useState("");
  const [jobPost, setJobPost] = useState("");
  const [platform, setPlatform] = useState("");
  const [extractingText, setExtractingText] = useState(false);
  const [hasLogo, setHasLogo] = useState(false);
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [employment, setEmployment] = useState("");
  const [hasQuestion, setHasQuestion] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     // const response = await axios.post("https://job-validator-2.onrender.com//api/analyze2", {
  //     const response = await axios.post("http://localhost:5000//api/analyze2", {
  //       url: url || null,
  //       job_post: jobPost || null,
  //       platform: platform || null,
  //       has_logo: hasLogo,
  //       experience: experience || null,
  //       education: education || null,
  //       employment: employment || null,
  //       hasQuestion,
  //     });

  //     setJobData(response.data);
  //   } catch (error) {
  //     setError(
  //       error.response?.data?.error ||
  //         "An error occurred while analyzing the job posting"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };




  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  try {
    // First call to Flask backend for analysis
    const response = await axios.post("http://localhost:5000/api/analyze2", {
      url: url || null,
      job_post: jobPost || null,
      platform: platform || null,
      has_logo: hasLogo,
      experience: experience || null,
      education: education || null,
      employment: employment || null,
      hasQuestion,
    });

    // Then send to your Node.js backend for storage
    await axios.post("http://localhost:5003/api/analyze-job", {
      url: url || null,
      jobPost: jobPost || null,
      platform: platform || null,
      hasLogo: hasLogo,
      experience: experience || null,
      education: education || null,
      employment: employment || null,
      hasQuestion,
      fraudulent: response.data.fraudulent === "Yes" // Assuming Flask returns this
    }, {
      withCredentials: true
    });

    setJobData(response.data);
  } catch (error) {
    setError(
      error.response?.data?.error ||
        "An error occurred while analyzing the job posting"
    );
  } finally {
    setLoading(false);
  }
};

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExtractingText(true);
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m),
      });
      setJobPost(text);
    } catch (error) {
      console.error("OCR Error:", error);
      setError("Failed to extract text from image");
    } finally {
      setExtractingText(false);
    }
  };

  const experience_order = [
    "Not Provided", "Not Applicable", "Internship (0-1)", "Entry level (0-2)",
    "Associate (1-3)", "Mid-Senior level (4-7)", "Director (8-12)", "Executive (12+)"
  ];

  const education_order = [
    "Not Provided", "Unspecified", "Some High School Coursework", "High School or equivalent",
    "Vocational - HS Diploma", "Some College Coursework Completed", "Certification", "Vocational",
    "Vocational - Degree", "Associate Degree", "Bachelor's Degree", "Master's Degree", "Doctorate", "Professional"
  ];

  const employment_order = [
    "Not Provided", "Other", "Temporary", "Contract", "Part-time", "Full-time"
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl">
      <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            Job Analysis Form
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Upload or paste job details for comprehensive analysis
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Job URL
            </label>
            <input
              type="text"
              placeholder="Paste job URL here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 text-sm sm:text-base"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <label className="block text-sm font-semibold text-gray-700">
                Upload Job Image
              </label>
              <div className="flex items-center gap-3">
                <label 
                  htmlFor="imageUpload" 
                  className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md"
                >
                  <FiUpload size={16} className="mr-2" />
                  Upload Image
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
            {extractingText && (
              <div className="flex items-center gap-2 text-blue-600 text-sm p-3 bg-blue-50 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span>Extracting text from image...</span>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Job Description
            </label>
            <textarea
              placeholder="Paste job post content here..."
              value={jobPost}
              onChange={(e) => setJobPost(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 resize-vertical text-sm sm:text-base"
            />
          </div>

          {/* Company Logo Toggle */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-gray-800 font-medium text-sm sm:text-base">
              Company Logo Present?
            </div>
            <div
              onClick={() => setHasLogo(!hasLogo)}
              className={`relative inline-flex w-12 h-6 rounded-full cursor-pointer transition-all duration-300 ${
                hasLogo ? 'bg-green-500' : 'bg-gray-400'
              } hover:shadow-lg transform hover:scale-105`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                  hasLogo ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Select Job Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 text-sm sm:text-base"
            >
              <option value="">-- Choose a Platform --</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Naukri">Naukri</option>
              <option value="Internshala">Internshala</option>
              <option value="Unstop">Unstop</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Experience Level
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 text-sm sm:text-base"
            >
              <option value="">-- Select Experience --</option>
              {experience_order.map((level, idx) => (
                <option key={idx} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Education Level */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Education Level
            </label>
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 text-sm sm:text-base"
            >
              <option value="">-- Select Education --</option>
              {education_order.map((level, idx) => (
                <option key={idx} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Employment Type */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Employment Type
            </label>
            <select
              value={employment}
              onChange={(e) => setEmployment(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 text-sm sm:text-base"
            >
              <option value="">-- Select Employment --</option>
              {employment_order.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Has Question */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Are there questions in job post?
            </label>
            <select
              value={hasQuestion}
              onChange={(e) => setHasQuestion(e.target.value === "true")}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 text-sm sm:text-base"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 sm:py-4 sm:px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 text-base sm:text-lg"
          >
            Analyze Job Posting
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
