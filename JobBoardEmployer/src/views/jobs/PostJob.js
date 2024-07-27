import React, { useState, useEffect, useRef } from 'react';
import
{
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormInput,
  CForm,
  CFormLabel,
  CRow
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector and useDispatch
import { addJob } from '../../features/JobSlice';
import { jwtDecode } from "jwt-decode";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { fetchCategoryThunk } from '../../features/categorySlice';
import { fetchCompanyThunk } from '../../features/companySlice';

const PostJob = () =>
{
  const [formData, setFormData] = useState({
    title: '',
    offeredSalary: '',
    description: '',
    responsibilities: '',
    requiredSkills: '',
    workSchedule: '',
    keySkills: '',
    position: '',
    experience: '',
    slot: '',
    qualification: '',
    categoryId: '',
    companyId: '',
    benefit: '',
    jobType: '',
    contractType: '',
    expire: '',
    isSuperHot: ''
  });

  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, state: categoryState } = useSelector(state => state.categories); // Select categories from Redux state
  const { companies } = useSelector(state => state.companies);

  useEffect(() =>
  {
    dispatch(fetchCategoryThunk());
    dispatch(fetchCompanyThunk());
  }, []);

  useEffect(() =>
  {
    // Optional: Set default categoryId if needed
    if (categoryState === 'succeeded')
    {
      setFormData(prevData => ({
        ...prevData,
        categoryId: categories.length > 0 ? categories[0].id : '',
        companyId: companies.length > 0 ? companies[0].id : '',
      }));
    }
  }, [categories, categoryState, companies]);

  const fetchProvinces = async () =>
  {
    try
    {
      const response = await fetch('https://open.oapi.vn/location/provinces');
      if (!response.ok)
      {
        throw new Error('Failed to fetch provinces');
      }
      const data = await response.json();

      if (data.code === 'success')
      {
        setProvinces(data.data);
      } else
      {
        throw new Error('Invalid data format from API');
      }
    } catch (error)
    {
      console.error('Error fetching provinces:', error);
    }
  };

  useEffect(() =>
  {
    fetchProvinces();
  }, []);


  const handleChange = (e) =>
  {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // const handleChange = (e) =>
  // {
  //   const { id, value, type, checked } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [id]: type === 'checkbox' ? checked : value,
  //   }));
  // };


  const handleQuillChange = (field, value) =>
  {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // const quillRefs = {
  //   description: useRef(null),
  //   workSchedule: useRef(null),
  //   qualification: useRef(null),
  //   responsibilities: useRef(null),
  //   requiredSkills: useRef(null),
  //   keySkills: useRef(null),
  //   benefit: useRef(null)
  // };

  useEffect(() =>
  {
    console.log('Categories State:', categories);
  }, [categories]);


  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    if (validateForm())
    {
      const token = localStorage.getItem('accessToken');
      if (token)
      {
        try
        {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          const result = await dispatch(addJob({ categoryId: formData.categoryId, companyId: formData.companyId, data: formData }));
          if (addJob.fulfilled.match(result))
          {
            navigate('/job');
          } else
          {
            console.log('Failed to add job:', result.payload);
          }
        } catch (error)
        {
          console.error('Error:', error);
        }
      }
    }
  };

  const validateForm = () =>
  {
    let tempErrors = {};
    if (!formData.title) tempErrors.title = "Title is required";
    else if (formData.title.length > 200) tempErrors.title = "Title must be less than 200 characters";
    if (!formData.offeredSalary) tempErrors.offeredSalary = "Offered Salary is required";
    if (!formData.description) tempErrors.description = "Description is required";
    if (!formData.slot) tempErrors.slot = "Slot is required";
    if (!formData.workSchedule) tempErrors.workSchedule = "Work schedule is required";
    if (!formData.responsibilities) tempErrors.responsibilities = "Responsibilities are required";
    if (!formData.requiredSkills) tempErrors.requiredSkills = "Required Skills are required";
    if (!formData.keySkills) tempErrors.keySkills = "Key Skills are required";
    if (!formData.position) tempErrors.position = "Position is required";
    if (!formData.experience) tempErrors.experience = "Experience is required";
    if (!formData.qualification) tempErrors.qualification = "Qualification is required";
    if (!formData.benefit) tempErrors.benefit = "Benefit is required";
    if (!formData.jobType) tempErrors.jobType = "Job type is required";
    if (!formData.contractType) tempErrors.contractType = "Contract type is required";
    if (!formData.categoryId) tempErrors.categoryId = "Category is required";
    if (!formData.companyId) tempErrors.companyId = "Company is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  return (
    <>
      <section className="section-hero overlay inner-page bg-image">
        <CContainer>
          <CRow>
            <CCol md={7}>
              <h1 className="font-weight-bold">Post A Job</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <a href="/job">Job</a> <span className="mx-2 slash">/</span>
                <span>
                  <strong>Post a Job</strong>
                </span>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </section>
      <br></br>
      <section className="site-section">
        <CContainer>
          <CRow>
            <CCol lg={8}>
              <CCard>
                <CCardBody>
                  <CForm method="post" onSubmit={handleSubmit}>
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="title" className="form-label">Job Title</CFormLabel>
                          <CFormInput
                            type="text"
                            id="title"
                            placeholder="Enter Job Title"
                            value={formData.title}
                            onChange={handleChange}
                            invalid={!!errors.title}
                          />
                          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="offeredSalary" className="form-label">Offered Salary</CFormLabel>
                          <CFormInput
                            type="text"
                            id="offeredSalary"
                            placeholder="Enter Offered Salary"
                            value={formData.offeredSalary}
                            onChange={handleChange}
                            invalid={!!errors.offeredSalary}
                          />
                          {errors.offeredSalary && <div className="invalid-feedback">{errors.offeredSalary}</div>}
                        </div>
                      </CCol>
                    </CRow>
                    <div className="mb-3">
                      <CFormLabel htmlFor="description" className="form-label">Job Description</CFormLabel>
                      <ReactQuill
                        // ref={quillRefs.description}
                        value={formData.description}
                        onChange={(value) => handleQuillChange('description', value)}
                      />
                      {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="position" className="form-label">Position</CFormLabel>
                          <select
                            className="form-select"
                            id="position"
                            value={formData.position}
                            onChange={handleChange}
                          >
                            <option value="">Select position</option>
                            <option value="INTERN">Intern</option>
                            <option value="FRESHER">Fresher</option>
                            <option value="JUNIOR">Junior</option>
                            <option value="MIDDLE">Middle</option>
                            <option value="SENIOR">Senior</option>
                            <option value="LEADER">Leader</option>
                            <option value="MANAGER">Manager</option>
                          </select>
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="quantity" className="form-label">Slot (people)</CFormLabel>
                          <CFormInput
                            type="number"
                            id="slot"
                            placeholder="Enter slot"
                            value={formData.slot}
                            onChange={handleChange}
                            invalid={!!errors.slot}
                          />
                          {errors.slot && <div className="invalid-feedback">{errors.slot}</div>}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="jobType" className="form-label">Job type</CFormLabel>
                          <select
                            className="form-select"
                            id="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                          >
                            <option value="">Select Job type</option>
                            <option value="IN_OFFICE">In Office</option>
                            <option value="HYBRID">Hybrid</option>
                            <option value="REMOTE">Remote</option>
                            <option value="OVERSEA">Oversea</option>
                          </select>
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="quantity" className="form-label">Contract type</CFormLabel>
                          <select
                            className="form-select"
                            id="contractType"
                            value={formData.contractType}
                            onChange={handleChange}
                          >
                            <option value="">Select Contract type</option>
                            <option value="FREELANCE">Freelance</option>
                            <option value="FULLTIME">Fulltime</option>
                            <option value="PART_TIME">Part-time</option>
                          </select>
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="expire" className="form-label">The deadline for submission</CFormLabel>
                          <CFormInput
                            type="date"
                            id="expire"
                            placeholder="Enter application deadline date"
                            value={formData.expire}
                            onChange={handleChange}
                            invalid={!!errors.expire}
                          />
                          {errors.expire && <div className="invalid-feedback">{errors.expire}</div>}
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="isSuperHot" className="form-label">Super hot job</CFormLabel>
                          <select
                            className="form-select"
                            id="isSuperHot"
                            value={formData.isSuperHot}
                            onChange={handleChange}
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                      </CCol>
                    </CRow>
                    <div className="mb-3">
                      <CFormLabel htmlFor="workSchedule" className="form-label">Work Schedule</CFormLabel>
                      <ReactQuill
                        // ref={quillRefs.workSchedule}
                        value={formData.workSchedule}
                        onChange={(value) => handleQuillChange('workSchedule', value)}
                      />
                      {errors.workSchedule && <div className="invalid-feedback">{errors.workSchedule}</div>}
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="experience" className="form-label">Experience</CFormLabel>
                      <CFormInput
                        type="text"
                        id="experience"
                        placeholder="Enter Experience"
                        value={formData.experience}
                        onChange={handleChange}
                        invalid={!!errors.experience}
                      />
                      {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="qualification" className="form-label">Qualification</CFormLabel>
                      <ReactQuill
                        // ref={quillRefs.qualification}
                        value={formData.qualification}
                        onChange={(value) => handleQuillChange('qualification', value)}
                      />
                      {errors.qualification && <div className="invalid-feedback">{errors.qualification}</div>}
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="responsibilities" className="form-label">Responsibilities</CFormLabel>
                      <ReactQuill
                        // ref={quillRefs.responsibilities}
                        value={formData.responsibilities}
                        onChange={(value) => handleQuillChange('responsibilities', value)}
                      />
                      {errors.responsibilities && <div className="invalid-feedback">{errors.responsibilities}</div>}
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="requiredSkills" className="form-label">Required Skills</CFormLabel>
                      <ReactQuill
                        // ref={quillRefs.requiredSkills}
                        value={formData.requiredSkills}
                        onChange={(value) => handleQuillChange('requiredSkills', value)}
                      />
                      {errors.requiredSkills && <div className="invalid-feedback">{errors.requiredSkills}</div>}
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="keySkills" className="form-label">Key Skills</CFormLabel>
                      <ReactQuill
                        // ref={quillRefs.keySkills}
                        value={formData.keySkills}
                        onChange={(value) => handleQuillChange('keySkills', value)}
                      />
                      {errors.keySkills && <div className="invalid-feedback">{errors.keySkills}</div>}
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="benefit" className="form-label">Benefit</CFormLabel>
                      <ReactQuill
                        // ref={quillRefs.benefit}
                        value={formData.benefit}
                        onChange={(value) => handleQuillChange('benefit', value)}
                      />
                      {errors.benefit && <div className="invalid-feedback">{errors.benefit}</div>}
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="categoryId" className="form-label">Category</CFormLabel>
                      <select
                        className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                        id="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        onBlur={validateForm}
                      >
                        <option key="" value="">Select Category</option>
                        {categories?.map((category) => (
                          <option key={category.categoryId
                          } value={category.categoryId}>
                            {category.categoryName}
                          </option>
                        ))}
                      </select>
                      {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                      {console.log('Categories:', categories)}
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="companyId" className="form-label">Company</CFormLabel>
                      <select
                        className={`form-select ${errors.companyId ? 'is-invalid' : ''}`}
                        id="companyId"
                        value={formData.companyId}
                        onChange={handleChange}
                        onBlur={validateForm}
                      >
                        <option key="" value="">Select company</option>
                        {companies?.map((company) => (
                          <option key={company.companyId
                          } value={company.companyId}>
                            {company.companyName}
                          </option>
                        ))}
                      </select>
                      {errors.companyId && <div className="invalid-feedback">{errors.companyId}</div>}
                      {console.log('Companies:', companies)}
                    </div>

                    {/* <div className="mb-3">
                      <CFormLabel htmlFor="city" className="form-label">City</CFormLabel>
                      <select
                        className="form-select"
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        invalid={!!errors.city}
                      >
                        <option value="">Select City</option>
                        {provinces.map((province) => (
                          <option key={province.id} value={province.name}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                      {console.log('city:', provinces)}
                      {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div> */}

                    <CButton type="submit" className="btn btn-primary">Submit</CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </section>
    </>
  );
};

export default PostJob;
