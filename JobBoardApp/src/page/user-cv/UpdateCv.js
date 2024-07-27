
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosRequest from '../../configs/axiosConfig';
import '../../assets/css/update-cv.css';
import { useSelector } from 'react-redux';

const UpdateCV = ({userId, cvId, onClose}) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [cv, setCv] = useState(null);
  const [currentSection, setCurrentSection] = useState('cvTitle');
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCvData = async () => {
      try {
        const response = await axiosRequest.get(`/usercv/view-cv/${cvId}`);
        const formattedResponse = {
          ...response,
          userDetails: response.userDetails.map(detail => ({
            ...detail,
            dob: detail.dob ? new Date(detail.dob).toISOString().split('T')[0] : ''
          }))
        };
        setCv(formattedResponse);
      } catch (error) {
        console.error('No Cv to update please create a cv to implement this action', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCvData();
  }, [cvId]);

  const goBack = () => {
    const sections = ['cvTitle', 'userDetails', 'education', 'experiences', 'languages', 'projects', 'skills'];
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1]);
    }
  };

  const handleInputChange = (e, index, field, section) => {
    const { value } = e.target;
    setCv(prevCv => ({
      ...prevCv,
      [section]: prevCv[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setCv(prevCv => ({
          ...prevCv,
          userDetails: [{
            ...prevCv.userDetails[0],
            profileImage: file,
            profileImageBase64: reader.result.split(',')[1]
          }]
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUserChoice = (choice) => {
    setShowModal(false);
    if (choice === 'template') {
      navigate('/list-template'); // Adjust this path as needed
    }
  };
  const CustomModal = ({ show, onClose, onStay, onTemplate }) => {
    const [countdown, setCountdown] = useState(10);
  
    useEffect(() => {
      if (show) {
        const timer = setInterval(() => {
          setCountdown((prevCount) => {
            if (prevCount === 1) {
              clearInterval(timer);
              onClose();
            }
            return prevCount - 1;
          });
        }, 1000);  // Change this to 1000        
  
        return () => clearInterval(timer);
      }
    }, [show, onClose]);
  
    if (!show) return null;
  
    return (
      <div className="custom-modal">
        <div className="modal-content">
          <h2>CV Updated Successfully!</h2>
          <p>Choose "View Templates" to choose cv template and print it to pdf? or stay in this page</p>
          <div className="modal-buttons">
            <button onClick={onStay}>Stay here</button>
            <button onClick={onTemplate}>View Templates</button>
          </div>
          <div className="countdown">
            Closing in <i className='text-danger'>{countdown}</i> seconds
          </div>
        </div>
      </div>
    );
  };
  
  
  const addNewEntry = (section) => {
    setCv(prevCv => ({
      ...prevCv,
      [section]: [...prevCv[section], {}]
    }));
  };

  const removeEntry = (index, section) => {
    setCv(prevCv => ({
      ...prevCv,
      [section]: prevCv[section].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = new FormData();
      params.append('cvId', cv.cvId);
      params.append('cvTitle', cv.cvTitle);

      // User Details
      cv.userDetails.forEach((detail, index) => {
        const prefix = `userDetails[${index}]`;
        Object.keys(detail).forEach(key => {
          if (key === 'profileImage' && detail[key] instanceof File) {
            params.append('profileImage', detail[key]);
          } else if (key === 'dob') {
            params.append('dob', detail[key]);
          } else if (key === 'profileImageBase64' && !params.has('profileImage')) {
            const byteCharacters = atob(detail[key]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            params.append('profileImage', blob, 'profile.jpg');
          } else {
            params.append(`${prefix}.${key}`, detail[key]);
          }
        });
      });

      // Education
      cv.userEducations.forEach((education, index) => {
        const prefix = `userEducations[${index}]`;
        Object.keys(education).forEach(key => {
          params.append(`${prefix}.${key}`, education[key]);
        });
      });

      // Experiences
      cv.userExperiences.forEach((experience, index) => {
        const prefix = `userExperiences[${index}]`;
        Object.keys(experience).forEach(key => {
          params.append(`${prefix}.${key}`, experience[key]);
        });
      });

      // Languages
      cv.userLanguages.forEach((language, index) => {
        const prefix = `userLanguages[${index}]`;
        Object.keys(language).forEach(key => {
          params.append(`${prefix}.${key}`, language[key]);
        });
      });

      // Projects
      cv.userProjects.forEach((project, index) => {
        const prefix = `userProjects[${index}]`;
        Object.keys(project).forEach(key => {
          params.append(`${prefix}.${key}`, project[key]);
        });
      });

      // Skills
      cv.userSkills.forEach((skill, index) => {
        const prefix = `userSkills[${index}]`;
        Object.keys(skill).forEach(key => {
          params.append(`${prefix}.${key}`, skill[key]);
        });
      });

      const response = await axiosRequest.put(`/usercv/update-cv/${cvId}`, params, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('CV updated successfully!');
      setErrorMessage('');
      setShowModal(true);
      
      // setTimeout(() => {
      //   setShowModal(false);
      // }, 10000);
    } catch (error) {
      setErrorMessage('CV update failed!');
      setSuccessMessage('');

    }
  };


  const renderCvTitle = () => (
    <>
      <h2 className="cv-section-title">CV Title</h2>
      <div className="cv-entry">
        <input
          type="text"
          value={cv.cvTitle}
          onChange={(e) => setCv({ ...cv, cvTitle: e.target.value })}
          placeholder="CV Title"
          className="cv-input"
        />
      </div>
      <button type="button" onClick={() => setCurrentSection('userDetails')} className="cv-continue-btn">Continue</button>
    </>
  );

  const renderUserDetails = () => (
    <>
      <h2 className="cv-section-title">User Details</h2>
      <div className="cv-entry">
        <input
          type="text"
          value={cv.userDetails[0]?.fullName || ''}
          onChange={(e) => handleInputChange(e, 0, 'fullName', 'userDetails')}
          placeholder="Full Name"
          className="cv-input"
        />
        <input
          type="text"
          value={cv.userDetails[0]?.address || ''}
          onChange={(e) => handleInputChange(e, 0, 'address', 'userDetails')}
          placeholder="Address"
          className="cv-input"
        />
        <input
          type="date"
          value={cv.userDetails[0]?.dob || ''}
          onChange={(e) => handleInputChange(e, 0, 'dob', 'userDetails')}
          className="cv-input"
        />
        <input
          type="email"
          value={cv.userDetails[0]?.email || ''}
          onChange={(e) => handleInputChange(e, 0, 'email', 'userDetails')}
          placeholder="Email"
          className="cv-input"
        />
        <input
          type="tel"
          value={cv.userDetails[0]?.phone || ''}
          onChange={(e) => handleInputChange(e, 0, 'phone', 'userDetails')}
          placeholder="Phone"
          className="cv-input"
        />
        <textarea
          rows="5" cols="55"
          value={cv.userDetails[0]?.summary || ''}
          onChange={(e) => handleInputChange(e, 0, 'summary', 'userDetails')}
          placeholder="Summary"
          className="cv-input"
        />
        <div className="cv-image-preview">
          {imagePreview ? (
            <img src={imagePreview} alt="Profile Preview" className="cv-preview-image" width={300} height={200} />
          ) : cv.userDetails[0]?.profileImageBase64 ? (
            <img src={`data:image/jpeg;base64,${cv.userDetails[0].profileImageBase64}`} alt="Current Profile" className="cv-preview-image" width={300} height={300} />
          ) : (
            <p>No image uploaded</p>
          )}
        </div>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="cv-file-input"
        />

      </div>
      <div className="cv-button-group">
        <button type="button" onClick={goBack} className="cv-back-btn">Back</button>
        <button type="button" onClick={() => setCurrentSection('education')} className="cv-continue-btn">Continue</button>
      </div>
    </>
  );

  const renderEducation = () => (
    <>
      <h2 className="cv-section-title">Education</h2>
      {cv.userEducations.map((education, index) => (
        <div key={index} className="cv-entry">
          <input
            type="text"
            value={education.institution || ''}
            onChange={(e) => handleInputChange(e, index, 'institution', 'userEducations')}
            placeholder="Institution"
            className="cv-input"
          />
          <input
            type="text"
            value={education.degree || ''}
            onChange={(e) => handleInputChange(e, index, 'degree', 'userEducations')}
            placeholder="Degree"
            className="cv-input"
          />
          <textarea
            rows="5" cols="55"
            value={education.description || ''}
            onChange={(e) => handleInputChange(e, index, 'description', 'userEducations')}
            placeholder="Description"
            className="cv-input"
          />
          <input
            type="date"
            value={education.startDate || ''}
            onChange={(e) => handleInputChange(e, index, 'startDate', 'userEducations')}
            className="cv-input"
          />
          <input
            type="date"
            value={education.endDate || ''}
            onChange={(e) => handleInputChange(e, index, 'endDate', 'userEducations')}
            className="cv-input"
          />
          <button type="button" onClick={() => removeEntry(index, 'userEducations')} className="cv-remove-btn">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => addNewEntry('userEducations')} className="cv-add-btn">
        Add More Education
      </button>
      <div className="cv-button-group">
        <button type="button" onClick={goBack} className="cv-back-btn">Back</button>
        <button type="button" onClick={() => setCurrentSection('experiences')} className="cv-continue-btn">Continue</button>
      </div>
    </>
  );

  const renderExperiences = () => (
    <>
      <h2 className="cv-section-title">Experiences</h2>
      {cv.userExperiences.map((experience, index) => (
        <div key={index} className="cv-entry">
          <input
            type="text"
            value={experience.jobTitle || ''}
            onChange={(e) => handleInputChange(e, index, 'jobTitle', 'userExperiences')}
            placeholder="Job Title"
            className="cv-input"
          />
          <input
            type="text"
            value={experience.company || ''}
            onChange={(e) => handleInputChange(e, index, 'company', 'userExperiences')}
            placeholder="Company"
            className="cv-input"
          />
          <textarea
            rows="5" cols="55"
            value={experience.description || ''}
            onChange={(e) => handleInputChange(e, index, 'description', 'userExperiences')}
            placeholder="Description"
            className="cv-input"
          />
          <input
            type="date"
            value={experience.startDate || ''}
            onChange={(e) => handleInputChange(e, index, 'startDate', 'userExperiences')}
            className="cv-input"
          />
          <input
            type="date"
            value={experience.endDate || ''}
            onChange={(e) => handleInputChange(e, index, 'endDate', 'userExperiences')}
            className="cv-input"
          />
          <button type="button" onClick={() => removeEntry(index, 'userExperiences')} className="cv-remove-btn">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => addNewEntry('userExperiences')} className="cv-add-btn">
        Add More Experience
      </button>
      <div className="cv-button-group">
        <button type="button" onClick={goBack} className="cv-back-btn">Back</button>
        <button type="button" onClick={() => setCurrentSection('languages')} className="cv-continue-btn">Continue</button>
      </div>
    </>
  );

  const renderLanguages = () => (
    <>
      <h2 className="cv-section-title">Languages</h2>
      {cv.userLanguages.map((language, index) => (
        <div key={index} className="cv-entry">
          <input
            type="text"
            value={language.languageName || ''}
            onChange={(e) => handleInputChange(e, index, 'languageName', 'userLanguages')}
            placeholder="Language Name"
            className="cv-input"
          />
          <input
            type="text"
            value={language.proficiency || ''}
            onChange={(e) => handleInputChange(e, index, 'proficiency', 'userLanguages')}
            placeholder="Proficiency"
            className="cv-input"
          />
          <button type="button" onClick={() => removeEntry(index, 'userLanguages')} className="cv-remove-btn">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => addNewEntry('userLanguages')} className="cv-add-btn">
        Add More Language
      </button>
      <div className="cv-button-group">
        <button type="button" onClick={goBack} className="cv-back-btn">Back</button>
        <button type="button" onClick={() => setCurrentSection('projects')} className="cv-continue-btn">Continue</button>
      </div>
    </>
  );

  const renderProjects = () => (
    <>
      <h2 className="cv-section-title">Projects</h2>
      {cv.userProjects.map((project, index) => (
        <div key={index} className="cv-entry">
          <input
            type="text"
            value={project.projectName || ''}
            onChange={(e) => handleInputChange(e, index, 'projectName', 'userProjects')}
            placeholder="Project Name"
            className="cv-input"
          />
          <textarea
            rows="5" cols="55"
            value={project.description || ''}
            onChange={(e) => handleInputChange(e, index, 'description', 'userProjects')}
            placeholder="Description"
            className="cv-input"
          />
          <input
            type="date"
            value={project.startDate || ''}
            onChange={(e) => handleInputChange(e, index, 'startDate', 'userProjects')}
            className="cv-input"
          />
          <input
            type="date"
            value={project.endDate || ''}
            onChange={(e) => handleInputChange(e, index, 'endDate', 'userProjects')}
            className="cv-input"
          />
          <button type="button" onClick={() => removeEntry(index, 'userProjects')} className="cv-remove-btn">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => addNewEntry('userProjects')} className="cv-add-btn">
        Add More Project
      </button>
      <div className="cv-button-group">
        <button type="button" onClick={goBack} className="cv-back-btn">Back</button>
        <button type="button" onClick={() => setCurrentSection('skills')} className="cv-continue-btn">Continue</button>
      </div>
    </>
  );

  const renderSkills = () => (
    <>
      <h2 className="cv-section-title">Skills</h2>
      {cv.userSkills.map((skill, index) => (
        <div key={index} className="cv-entry">
          <input
            type="text"
            value={skill.skillName || ''}
            onChange={(e) => handleInputChange(e, index, 'skillName', 'userSkills')}
            placeholder="Skill Name"
            className="cv-input"
          />
          <input
            type="text"
            value={skill.proficiency || ''}
            onChange={(e) => handleInputChange(e, index, 'proficiency', 'userSkills')}
            placeholder="Proficiency"
            className="cv-input"
          />
          <button type="button" onClick={() => removeEntry(index, 'userSkills')} className="cv-remove-btn">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => addNewEntry('userSkills')} className="cv-add-btn">
        Add More Skill
      </button>
      <div className="cv-button-group">
        <button type="button" onClick={goBack} className="cv-back-btn">Back</button>
      </div>
      <button type="submit" className="cv-submit-btn">Update CV</button>
    </>
  );

  const renderSection = () => {
    switch (currentSection) {
      case 'cvTitle':
        return renderCvTitle();
      case 'userDetails':
        return renderUserDetails();
      case 'education':
        return renderEducation();
      case 'experiences':
        return renderExperiences();
      case 'languages':
        return renderLanguages();
      case 'projects':
        return renderProjects();
      case 'skills':
        return renderSkills();
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="cv-loading">Loading...</div>;
  }
  if (!cv) {
    return <div className="text-center"><h3 style={{
      fontFamily: 'Poppins',
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#c62828',
      padding: '20px',
      margin: '30px 0',
      textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
      letterSpacing: '0.5px'
    }}> No Cv to update please create a cv to implement this action</h3></div>;
  }

  return (
    <div className='detail-bg'>
        <button className="close-button" onClick={onClose}>Close</button>
    <div className="container py-5">
       
     <CustomModal 
      show={showModal}
      onClose={() => setShowModal(false)}
      onStay={() => handleUserChoice('stay')}
      onTemplate={() => handleUserChoice('template')}
    />
    
      <div className='cv-bg'>
        <h1 className="text-update-css">Update CV</h1>
        <form onSubmit={handleSubmit} className="cv-form">
          {renderSection()}
        </form>
      </div>
    </div>
    </div>
  );
};

export default UpdateCV;
