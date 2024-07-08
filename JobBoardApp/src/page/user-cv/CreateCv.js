import React, { useState,useContext} from 'react';
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import '../../assets/css/create-cv.css';
import axiosRequest from "../../configs/axiosConfig";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const CreateCV = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

//     const reduxState = useSelector((state) => state);
// console.log('Redux State:', reduxState);

    const [cvTitle, setCvTitle] = useState('');
    const [userDetails, setUserDetails] = useState([{ fullName: '', address: '', email: '', phone: '', summary: '', profileImage: '' }]);
    const [userEducations, setUserEducations] = useState([{ institution: '', degree: '', description: '', startDate: '', endDate: '' }]);
    const [userExperiences, setUserExperiences] = useState([{ jobTitle: '', company: '', description: '', startDate: '', endDate: '' }]);
    const [userLanguages, setUserLanguages] = useState([{ languageName: '', proficiency: '' }]);
    const [userProjects, setUserProjects] = useState([{ projectName: '', description: '', startDate: '', endDate: '' }]);
    const [userSkills, setUserSkills] = useState([{ skillName: '', proficiency: '' }]);
    const [errors, setErrors] = useState({
        userDetails: [],
        userEducations: [],
        userExperiences: [],
        userLanguages: [],
        userProjects: [],
        userSkills: [],
        cvTitle: '',
    });
     
    
    const handleInputChange = (e, index, field, section) => {
        const value = e.target.value;
        switch (section) {
            case 'userDetails':
                setUserDetails((prevDetails) => {
                    const newDetails = [...prevDetails];
                    newDetails[index][field] = value;
                    return newDetails;
                });
                break;
            case 'userEducations':
                setUserEducations((prevEducations) => {
                    const newEducations = [...prevEducations];
                    newEducations[index][field] = value;
                    return newEducations;
                });
                break;
            case 'userExperiences':
                setUserExperiences((prevExperiences) => {
                    const newExperiences = [...prevExperiences];
                    newExperiences[index][field] = value;
                    return newExperiences;
                });
                break;
            case 'userLanguages':
                setUserLanguages((prevLanguages) => {
                    const newLanguages = [...prevLanguages];
                    newLanguages[index][field] = value;
                    return newLanguages;
                });
                break;
            case 'userProjects':
                setUserProjects((prevProjects) => {
                    const newProjects = [...prevProjects];
                    newProjects[index][field] = value;
                    return newProjects;
                });
                break;
            case 'userSkills':
                setUserSkills((prevSkills) => {
                    const newSkills = [...prevSkills];
                    newSkills[index][field] = value;
                    return newSkills;
                });
                break;
            default:
                break;
        }
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        setUserDetails((prevDetails) => {
            const newDetails = [...prevDetails];
            newDetails[index].profileImage = file;

            // Create a temporary URL for the selected file
            newDetails[index].profileImageUrl = file ? URL.createObjectURL(file) : null;

            return newDetails;
        });
    };
   
    const addNewEntry = (section) => {
        const isValid = validateFields(section,cvTitle, userDetails, userEducations, userExperiences, userLanguages, userProjects, userSkills);
        if (isValid) {
            switch (section) {
                case 'userEducations':
                    setUserEducations((prevEducations) => [...prevEducations, { institution: '', degree: '', description: '', startDate: '', endDate: '' }]);
                    break;
                case 'userExperiences':
                    setUserExperiences((prevExperiences) => [...prevExperiences, { jobTitle: '', company: '', description: '', startDate: '', endDate: '' }]);
                    break;
                case 'userLanguages':
                    setUserLanguages((prevLanguages) => [...prevLanguages, { languageName: '', proficiency: '' }]);
                    break;
                case 'userProjects':
                    setUserProjects((prevProjects) => [...prevProjects, { projectName: '', description: '', startDate: '', endDate: '' }]);
                    break;
                case 'userSkills':
                    setUserSkills((prevSkills) => [...prevSkills, { skillName: '', proficiency: '' }]);
                    break;
                default:
                    break;
            }
        }
    };


    const removeEntry = (index, section) => {
        switch (section) {
            case 'userEducations':
                setUserEducations((prevEducations) => prevEducations.filter((_, i) => i !== index));
                break;
            case 'userExperiences':
                setUserExperiences((prevExperiences) => prevExperiences.filter((_, i) => i !== index));
                break;
            case 'userLanguages':
                setUserLanguages((prevLanguages) => prevLanguages.filter((_, i) => i !== index));
                break;
            case 'userProjects':
                setUserProjects((prevProjects) => prevProjects.filter((_, i) => i !== index));
                break;
            case 'userSkills':
                setUserSkills((prevSkills) => prevSkills.filter((_, i) => i !== index));
                break;
            default:
                break;
        }
    };

    const validateFields = (section,cvTitle, userDetails, userEducations, userExperiences, userLanguages, userProjects, userSkills) => {
        let sectionErrors = [];
      
        switch (section) {
            case 'cvTitle':
                if (!cvTitle || cvTitle.trim().length === 0) {
                    sectionErrors.push('CV Title is required');
                } else if (cvTitle.length < 3) {
                    sectionErrors.push('CV Title must be at least 3 characters long');
                }
                break;
          case 'userDetails':
            userDetails.forEach((detail, index) => {
              if (!detail.fullName || !detail.address || !detail.email || !detail.phone || !detail.summary) {
                sectionErrors.push(`Please fill out all fields for User Detail ${index + 1}`);
              }
              if(detail.email && !/\S+@\S+\.\S+/.test(detail.email)) {
                sectionErrors.push(`Email format is invalid for User Detail ${index + 1}`);
              }
            });
            break;
          case 'userEducations':
            userEducations.forEach((education, index) => {
              if (!education.institution || !education.degree || !education.description || !education.startDate || !education.endDate) {
                sectionErrors.push(`Please fill out all fields for Education ${index + 1}`);
              }
            });
            break;
          case 'userExperiences':
            userExperiences.forEach((experience, index) => {
              if (!experience.jobTitle || !experience.company || !experience.description || !experience.startDate || !experience.endDate) {
                sectionErrors.push(`Please fill out all fields for Experience ${index + 1}`);
              }
            });
            break;
          case 'userLanguages':
            userLanguages.forEach((language, index) => {
              if (!language.languageName || !language.proficiency) {
                sectionErrors.push(`Please fill out all fields for Language ${index + 1}`);
              }
            });
            break;
          case 'userProjects':
            userProjects.forEach((project, index) => {
              if (!project.projectName || !project.description || !project.startDate || !project.endDate) {
                sectionErrors.push(`Please fill out all fields for Project ${index + 1}`);
              }
            });
            break;
          case 'userSkills':
            userSkills.forEach((skill, index) => {
              if (!skill.skillName || !skill.proficiency) {
                sectionErrors.push(`Please fill out all fields for Skill ${index + 1}`);
              }
            });
            break;
          default:
            break;
        }
      
        setErrors((prevErrors) => ({
          ...prevErrors,
          [section]: sectionErrors,
        }));
      
        return sectionErrors.length === 0;
      };
      
    const handleContinue = () => {
        const currentSection = step === 1 ? 'cvTitle' : step === 2 ? 'userDetails' : step === 3 ? 'userEducations' : step === 4 ? 'userExperiences' : step === 5 ? 'userLanguages' : step === 6 ? 'userProjects' : step === 7 ? 'userSkills' : null;
        const isValid = validateFields(currentSection, cvTitle, userDetails, userEducations, userExperiences, userLanguages, userProjects, userSkills);
      
        if (isValid) {
          setStep(step + 1);
        }
      };

    const handleGoBack = () => {
        setStep(step - 1);
    };

    const user = useSelector(state => state.auth.user)
    // console.log(user)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const params = new FormData();
            params.append('cvTitle', cvTitle);
            params.append('user.id', user.id);
            userDetails.forEach((detail, index) => {
                const prefix = `userDetails[${index}]`;
                console.log('image: ', detail.profileImage);
                params.append(`${prefix}.fullName`, detail.fullName);
                params.append(`${prefix}.address`, detail.address);
                params.append(`${prefix}.email`, detail.email);
                params.append(`${prefix}.phone`, detail.phone);
                params.append(`${prefix}.summary`, detail.summary);
                params.append('profileImage', detail.profileImage);
            });
            userEducations.forEach((education, index) => {
                const prefix = `userEducations[${index}]`;
                params.append(`${prefix}.institution`, education.institution);
                params.append(`${prefix}.degree`, education.degree);
                params.append(`${prefix}.description`, education.description);
                params.append(`${prefix}.startDate`, education.startDate);
                params.append(`${prefix}.endDate`, education.endDate);
            });
            userExperiences.forEach((experience, index) => {
                const prefix = `userExperiences[${index}]`;
                params.append(`${prefix}.jobTitle`, experience.jobTitle);
                params.append(`${prefix}.company`, experience.company);
                params.append(`${prefix}.description`, experience.description);
                params.append(`${prefix}.startDate`, experience.startDate);
                params.append(`${prefix}.endDate`, experience.endDate);
            });
            userLanguages.forEach((language, index) => {
                const prefix = `userLanguages[${index}]`;
                params.append(`${prefix}.languageName`, language.languageName);
                params.append(`${prefix}.proficiency`, language.proficiency);
            });
            userProjects.forEach((project, index) => {
                const prefix = `userProjects[${index}]`;
                params.append(`${prefix}.projectName`, project.projectName);
                params.append(`${prefix}.description`, project.description);
                params.append(`${prefix}.startDate`, project.startDate);
                params.append(`${prefix}.endDate`, project.endDate);
            });
            userSkills.forEach((skill, index) => {
                const prefix = `userSkills[${index}]`;
                params.append(`${prefix}.skillName`, skill.skillName);
                params.append(`${prefix}.proficiency`, skill.proficiency);
            });
            for (var pair of params.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }
            const response = await axiosRequest.post('/usercv/submit-cv', params, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            navigate('/list-template'); // Handle success response
        } catch (error) {
            console.error(error); // Handle error
        }
    };

    return (
        <GlobalLayoutUser>
            <section
                className="section-hero overlay inner-page bg-image"
                style={{ backgroundImage: 'url("../../../assets/images/hero_1.jpg")' }}
                id="createCv-section"
            >
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <h1 className="text-white font-weight-bold">Create CV</h1>
                            <div className="custom-breadcrumbs">
                                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                                <span className="text-white">
                                    <strong>Create CV</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section
                className="py-5 bg-image overlay-primary fixed overlay"
                style={{
                    backgroundImage: 'url("../../../assets/images/hero_1.jpg")',
                }}
            >
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h2 className="text-white">You are struggling with prepare a CV?</h2>
                            <p className="mb-0 text-white lead">
                                Scroll down and fill up the form below to create your CV.
                            </p>
                        </div>
                        <div className="col-md-3 ml-auto">
                            <a href="#" className="btn btn-warning btn-block btn-lg">
                                Or sign up for free
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container py-5">
                <div className="step-indicator">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <span className="circle"></span>
                        <div>CV Title</div>
                    </div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <span className="circle"></span>
                        <div>User Details</div>
                    </div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <span className="circle"></span>
                        <div>Education</div>
                    </div>
                    <div className={`step ${step >= 4 ? 'active' : ''}`}>
                        <span className="circle"></span>
                        <div>Experiences</div>
                    </div>
                    <div className={`step ${step >= 5 ? 'active' : ''}`}>
                        <span className="circle"></span>
                        <div>Languages</div>
                    </div>
                    <div className={`step ${step >= 6 ? 'active' : ''}`}>
                        <span className="circle"></span>
                        <div>Projects</div>
                    </div>
                    <div className={`step ${step >= 7 ? 'active' : ''}`}>
                        <span className="circle"></span>
                        <div>Skills</div>
                    </div>
                </div>
                <div className='cv-bg'>
                    <h2 className='text-center'>
                        <span className='text-effect' style={{ '--animation-order': 0 }}>Please</span>{' '}
                        <span className='text-effect' style={{ '--animation-order': 1 }}>fill</span>{' '}
                        <span className='text-effect' style={{ '--animation-order': 2 }}>out</span>{' '}
                        <span className='text-effect' style={{ '--animation-order': 3 }}>these</span>{' '}
                        <span className='text-effect' style={{ '--animation-order': 4 }}>form</span>{' '}
                        <span className='text-effect' style={{ '--animation-order': 5 }}>before</span>{' '}
                        <span className='text-effect' style={{ '--animation-order': 6 }}>choose</span>{' '}
                        <span className='text-effect' style={{ '--animation-order': 7 }}>a</span>{' '}
                        <span className='text-effect' style={{ '--animation-order': 8 }}>CV</span>{' '}
                        <span className='text-effect' style={{ '--animation-order': 9 }}>template</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="cv-form">
                    
                        {/* CV Title */}
                        {step === 1 && (
                            <>
                                <h1 className="cv-section-title">Section 1: CV Title</h1>
                                <div className="cv-section">
                                    <label htmlFor="cvTitle" className="cv-label">CV Title:</label>
                                    <input
                                        type="text"
                                        id="cvTitle"
                                        value={cvTitle}
                                        onChange={(e) => setCvTitle(e.target.value)}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.cvTitle && <div className="cv-error-message">{errors.cvTitle.join(', ')}</div>}
                                </div>
                                <div className="cv-button-group">
                                    <button type="button" onClick={handleContinue} className="cv-continue-btn">
                                        Continue
                                    </button>
                                </div>
                            </>
                        )}

                        {/* User Details */}
                        {step === 2 && (
                            <>

                                <h2 className="cv-section-title">Section 2: User Details</h2>
                                {errors.userDetails.length > 0 && (
                                    <div className="cv-validation-errors">
                                        {errors.userDetails.map((error, index) => (
                                            <p key={index} className="cv-error-message">{error}</p>
                                        ))}
                                    </div>
                                )}
                                {userDetails.map((detail, index) => (
                                    <div key={index} className="cv-entry">
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={detail.fullName}
                                            onChange={(e) => handleInputChange(e, index, 'fullName', 'userDetails')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Address"
                                            value={detail.address}
                                            onChange={(e) => handleInputChange(e, index, 'address', 'userDetails')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={detail.email}
                                            onChange={(e) => handleInputChange(e, index, 'email', 'userDetails')}
                                            required
                                            className="cv-input"
                                        />
                                        
                                        <input
                                            type="number"
                                            placeholder="Phone"
                                            value={detail.phone}
                                            onChange={(e) => handleInputChange(e, index, 'phone', 'userDetails')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Summary"
                                            value={detail.summary}
                                            onChange={(e) => handleInputChange(e, index, 'summary', 'userDetails')}
                                            required
                                            className="cv-input"
                                        />


                                        <label htmlFor={`profileImage-${index}`} className="cv-label">
                                            Profile Image
                                        </label>
                                        <input
                                            type="file"
                                            id={`profileImage-${index}`}
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, index)}
                                            className="cv-file-input"
                                        />
                                        {detail.profileImageUrl && (
                                            <img
                                                src={detail.profileImageUrl}
                                                alt="Profile"
                                                className="cv-profile-image"
                                            />
                                        )}
                                        {userDetails.length > 1 && (
                                            <button type="button" onClick={() => removeEntry(index, 'userDetails')} className="cv-remove-btn">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <div className="cv-button-group">
                                    <button type="button" onClick={handleGoBack} className="cv-back-btn">
                                        Go Back
                                    </button>
                                    <button type="button" onClick={handleContinue} className="cv-continue-btn">
                                        Continue
                                    </button>
                                </div>

                            </>
                        )}

                        {/* Education Section */}
                        {step === 3 && (
                            <>
                                <h2 className="cv-section-title">Section 3: Education</h2>
                                {errors.userEducations.length > 0 && (
                                    <div className="cv-validation-errors">
                                        {errors.userEducations.map((error, index) => (
                                            <p key={index} className="cv-error-message">{error}</p>
                                        ))}
                                    </div>
                                )}
                                {userEducations.map((education, index) => (
                                    <div key={index} className="cv-entry">
                                        <input
                                            type="text"
                                            placeholder="Institution"
                                            value={education.institution}
                                            onChange={(e) => handleInputChange(e, index, 'institution', 'userEducations')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Degree"
                                            value={education.degree}
                                            onChange={(e) => handleInputChange(e, index, 'degree', 'userEducations')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={education.description}
                                            onChange={(e) => handleInputChange(e, index, 'description', 'userEducations')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="date"
                                            placeholder="Start Date"
                                            value={education.startDate}
                                            onChange={(e) => handleInputChange(e, index, 'startDate', 'userEducations')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="date"
                                            placeholder="End Date"
                                            value={education.endDate}
                                            onChange={(e) => handleInputChange(e, index, 'endDate', 'userEducations')}
                                            required
                                            className="cv-input"
                                        />
                                        {userEducations.length > 1 && (
                                            <button type="button" onClick={() => removeEntry(index, 'userEducations')} className="cv-remove-btn">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => addNewEntry('userEducations')} className="cv-add-btn">
                                    Add More
                                </button>
                                <div className="cv-button-group">
                                    <button type="button" onClick={handleGoBack} className="cv-back-btn">
                                        Go Back
                                    </button>
                                    <button type="button" onClick={handleContinue} className="cv-continue-btn">
                                        Continue
                                    </button>
                                </div>

                            </>
                        )}

                        {/* Experience Section */}
                        {step === 4 && (
                            <>
                                <h2 className="cv-section-title">Section 4: Experience</h2>
                                {errors.userExperiences.length > 0 && (
                                    <div className="cv-validation-errors">
                                        {errors.userExperiences.map((error, index) => (
                                            <p key={index} className="cv-error-message">{error}</p>
                                        ))}
                                    </div>
                                )}
                                {userExperiences.map((experience, index) => (
                                    <div key={index} className="cv-entry">
                                        <input
                                            type="text"
                                            placeholder="Job Title"
                                            value={experience.jobTitle}
                                            onChange={(e) => handleInputChange(e, index, 'jobTitle', 'userExperiences')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Company"
                                            value={experience.company}
                                            onChange={(e) => handleInputChange(e, index, 'company', 'userExperiences')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={experience.description}
                                            onChange={(e) => handleInputChange(e, index, 'description', 'userExperiences')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="date"
                                            placeholder="Start Date"
                                            value={experience.startDate}
                                            onChange={(e) => handleInputChange(e, index, 'startDate', 'userExperiences')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="date"
                                            placeholder="End Date"
                                            value={experience.endDate}
                                            onChange={(e) => handleInputChange(e, index, 'endDate', 'userExperiences')}
                                            required
                                            className="cv-input"
                                        />
                                        {userExperiences.length > 1 && (
                                            <button type="button" onClick={() => removeEntry(index, 'userExperiences')} className="cv-remove-btn">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => addNewEntry('userExperiences')} className="cv-add-btn">
                                    Add More
                                </button>
                                <div className="cv-button-group">
                                    <button type="button" onClick={handleGoBack} className="cv-back-btn">
                                        Go Back
                                    </button>
                                    <button type="button" onClick={handleContinue} className="cv-continue-btn">
                                        Continue
                                    </button>
                                </div>

                            </>
                        )}

                        {/* Language Section */}
                        {step === 5 && (
                            <>
                                <h2 className="cv-section-title">Section 5: Languages</h2>
                                {errors.userLanguages.length > 0 && (
                                    <div className="cv-validation-errors">
                                        {errors.userLanguages.map((error, index) => (
                                            <p key={index} className="cv-error-message">{error}</p>
                                        ))}
                                    </div>
                                )}
                                {userLanguages.map((language, index) => (
                                    <div key={index} className="cv-entry">
                                        <input
                                            type="text"
                                            placeholder="Language Name"
                                            value={language.languageName}
                                            onChange={(e) => handleInputChange(e, index, 'languageName', 'userLanguages')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Proficiency Level"
                                            value={language.proficiency}
                                            onChange={(e) => handleInputChange(e, index, 'proficiency', 'userLanguages')}
                                            required
                                            className="cv-input"
                                        />
                                        {userLanguages.length > 1 && (
                                            <button type="button" onClick={() => removeEntry(index, 'userLanguages')} className="cv-remove-btn">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => addNewEntry('userLanguages')} className="cv-add-btn">
                                    Add More
                                </button>
                                <div className="cv-button-group">
                                    <button type="button" onClick={handleGoBack} className="cv-back-btn">
                                        Go Back
                                    </button>
                                    <button type="button" onClick={handleContinue} className="cv-continue-btn">
                                        Continue
                                    </button>
                                </div>

                            </>
                        )}

                        {/* Project Section */}
                        {step === 6 && (
                            <>
                                <h2 className="cv-section-title">Section 6: Projects</h2>
                                {errors.userProjects.length > 0 && (
                                    <div className="cv-validation-errors">
                                        {errors.userProjects.map((error, index) => (
                                            <p key={index} className="cv-error-message">{error}</p>
                                        ))}
                                    </div>
                                )}
                                {userProjects.map((project, index) => (
                                    <div key={index} className="cv-entry">
                                        <input
                                            type="text"
                                            placeholder="Project Name"
                                            value={project.projectName}
                                            onChange={(e) => handleInputChange(e, index, 'projectName', 'userProjects')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={project.description}
                                            onChange={(e) => handleInputChange(e, index, 'description', 'userProjects')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="date"
                                            placeholder="Start Date"
                                            value={project.startDate}
                                            onChange={(e) => handleInputChange(e, index, 'startDate', 'userProjects')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="date"
                                            placeholder="End Date"
                                            value={project.endDate}
                                            onChange={(e) => handleInputChange(e, index, 'endDate', 'userProjects')}
                                            required
                                            className="cv-input"
                                        />
                                        {userProjects.length > 1 && (
                                            <button type="button" onClick={() => removeEntry(index, 'userProjects')} className="cv-remove-btn">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => addNewEntry('userProjects')} className="cv-add-btn">
                                    Add More
                                </button>
                                <div className="cv-button-group">
                                    <button type="button" onClick={handleGoBack} className="cv-back-btn">
                                        Go Back
                                    </button>
                                    <button type="button" onClick={handleContinue} className="cv-continue-btn">
                                        Continue
                                    </button>
                                </div>

                            </>
                        )}

                        {/* Skill Section */}
                        {step === 7 && (
                            <>
                                <h2 className="cv-section-title">Section 7: Skills</h2>
                                {errors.userSkills.length > 0 && (
                                    <div className="cv-validation-errors">
                                        {errors.userSkills.map((error, index) => (
                                            <p key={index} className="cv-error-message">{error}</p>
                                        ))}
                                    </div>
                                )}
                                {userSkills.map((skill, index) => (
                                    <div key={index} className="cv-entry">
                                        <input
                                            type="text"
                                            placeholder="Skill Name"
                                            value={skill.skillName}
                                            onChange={(e) => handleInputChange(e, index, 'skillName', 'userSkills')}
                                            required
                                            className="cv-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Proficiency Level"
                                            value={skill.proficiency}
                                            onChange={(e) => handleInputChange(e, index, 'proficiency', 'userSkills')}
                                            required
                                            className="cv-input"
                                        />
                                        {userSkills.length > 1 && (
                                            <button type="button" onClick={() => removeEntry(index, 'userSkills')} className="cv-remove-btn">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => addNewEntry('userSkills')} className="cv-add-btn">
                                    Add More
                                </button>
                                <button type="submit" className="cv-submit-btn">Submit CV</button>
                                <div className="cv-button-group">
                                    <button type="button" onClick={handleGoBack} className="cv-back-btn">
                                        Go Back
                                    </button>

                                </div>


                            </>
                        )}
                    </form>
                </div>
            </div>
        </GlobalLayoutUser>
    );
};

export default CreateCV;
