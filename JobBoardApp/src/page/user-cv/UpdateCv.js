import React, { useState, useEffect } from "react";
import axiosRequest from '../../configs/axiosConfig';
 // Assuming axiosRequest.js is in the same directory

const UpdateCv = ({ cvId }) => {
  const [cvData, setCVData] = useState({
    cvTitle: "",
    userDetails: [],
    userEducations: [],
    userExperiences: [],
    userSkills: [],
    userProjects: [],
    userLanguages: []
  });

  useEffect(() => {
    // Fetch current CV data
    const fetchCVData = async () => {
      try {
        const response = await axiosRequest.get(`/usercv/${cvId}`);
        setCVData(response);
      } catch (error) {
        console.error("Error fetching CV data:", error);
      }
    };

    fetchCVData();
  }, [cvId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCVData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axiosRequest.put(`/api/user-cvs/${cvId}`, cvData);
//       alert("CV updated successfully!");
//       // Optionally redirect or perform other actions after successful update
//     } catch (error) {
//       console.error("Error updating CV:", error);
//       alert("Failed to update CV. Please try again.");
//     }
//   };

  return (
    <div>
      <h2>Update CV</h2>
      <form onSubmit={handleSubmit}>
        <label>
          CV Title:
          <input
            type="text"
            name="cvTitle"
            value={cvData.cvTitle}
            onChange={handleChange}
          />
        </label>
        {/* Add other fields for userDetails, userEducations, etc. */}
        <button type="submit">Update CV</button>
      </form>
    </div>
  );
};

export default UpdateCv;
