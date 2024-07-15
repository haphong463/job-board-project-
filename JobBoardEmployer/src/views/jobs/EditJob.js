import React, { useState, useEffect } from 'react';
import {
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
import { useDispatch, useSelector } from 'react-redux';
import { updateJobById, getJobById } from '../../features/JobSlice';
import { jwtDecode } from 'jwt-decode';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import { fetchCategoryThunk } from '../../features/categorySlice'; // Import fetchCategoryThunk

const EditJob = () => {
  const { jobId } = useParams(); // Lấy jobId từ URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const jobDetails = useSelector((state) => state.jobs.job); // Lấy thông tin công việc từ Redux store
  console.log(jobDetails)
  const [formData, setFormData] = useState({
    title: '',
    offeredSalary: '',
    description: '',
    city: '',
    responsibilities: '',
    requiredSkills: '',
    workSchedule: 'FULL_TIME',
    keySkills: '',
    position: '',
    experience: '',
    quantity: '',
    qualification: '',
    categoryId: '',
    workingDays: '',
  });

  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);

  const { categories, state: categoryState } = useSelector(state => state.categories); // Select categories from Redux state

  useEffect(() => {
    dispatch(fetchCategoryThunk()); // Fetch categories when component mounts
  }, [dispatch]);

  useEffect(() => {
    if (categoryState === 'succeeded') {
      // Optional: Set default categoryId if needed
      setFormData(prevData => ({
        ...prevData,
        categoryId: categories.length > 0 ? categories[0].id : '',
      }));
    }
  }, [categories, categoryState]);

  useEffect(() => {
    if (jobId) {
      dispatch(getJobById(jobId)).then((action) => {
        console.log("Job details:", action.payload); // In ra kết quả từ API
      }).catch((error) => {
        console.error("Failed to fetch job details:", error);
      });
    } else {
      console.log("Không có jobId để gọi API");
    }
  }, [dispatch, jobId]);


  useEffect(() => {
    if (jobDetails) {
      console.log(jobDetails)
      setFormData({
        title: jobDetails.title || '',
        offeredSalary: jobDetails.offeredSalary || '',
        description: jobDetails.description || '',
        city: jobDetails.city || '',
        responsibilities: jobDetails.responsibilities || '',
        requiredSkills: jobDetails.requiredSkills || '',
        workSchedule: jobDetails.workSchedule || 'FULL_TIME',
        keySkills: jobDetails.keySkills || '',
        position: jobDetails.position || '',
        experience: jobDetails.experience || '',
        quantity: jobDetails.quantity || '',
        qualification: jobDetails.qualification || '',
        categoryId: jobDetails.categoryId || '',
        workingDays: jobDetails.workingDays || '',
      });
    }
  }, [jobDetails]);

  const fetchProvinces = async () => {
    try {
      const response = await fetch('https://open.oapi.vn/location/provinces');
      if (!response.ok) {
        throw new Error('Failed to fetch provinces');
      }
      const data = await response.json();

      if (data.code === 'success') {
        setProvinces(data.data); // Set provinces state with data from API
      } else {
        throw new Error('Invalid data format from API');
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
      // Handle error as needed
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleQuillChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  useEffect(() => {
    console.log('Categories State:', categories);
  }, [categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          console.log(jobId);
          const result = await dispatch(updateJobById({ jobId, data: formData }));
          if (updateJobById.fulfilled.match(result)) {
            // Job added successfully
            navigate('/job'); // Navigate to the job page
          } else {
            // Handle error
            console.log('Failed to update job:', result.payload);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.title) tempErrors.title = "Title is required";
    else if (formData.title.length > 200) tempErrors.title = "Title must be less than 200 characters";
    if (!formData.offeredSalary) tempErrors.offeredSalary = "Offered Salary is required";
    if (!formData.description) tempErrors.description = "Description is required";
    if (!formData.city) tempErrors.city = "City is required";
    if (!formData.responsibilities) tempErrors.responsibilities = "Responsibilities are required";
    if (!formData.requiredSkills) tempErrors.requiredSkills = "Required Skills are required";
    if (!formData.keySkills) tempErrors.keySkills = "Key Skills are required";
    if (!formData.position) tempErrors.position = "Position is required";
    if (!formData.experience) tempErrors.experience = "Experience is required";
    if (!formData.qualification) tempErrors.qualification = "Qualification is required";
    if (!formData.categoryId) tempErrors.categoryId = "Category is required";
    if (!formData.quantity) tempErrors.quantity = "Quantity is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  return (
    <>
      <section className="section-hero overlay inner-page bg-image">
        <CContainer>
          <CRow>
            <CCol md={7}>
              <h1 className="font-weight-bold">{jobId ? "Edit Job" : "Post A Job"}</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <a href="/job">Job</a> <span className="mx-2 slash">/</span>
                <span>
                  <strong>{jobId ? "Edit Job" : "Post a Job"}</strong>
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
                            type="number"
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
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="workSchedule" className="form-label">Work Schedule</CFormLabel>
                          <select
                            className="form-select"
                            id="workSchedule"
                            value={formData.workSchedule}
                            onChange={handleChange}
                          >
                            <option value="FULL_TIME">Full Time</option>
                            <option value="PART_TIME">Part Time</option>
                          </select>
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="quantity" className="form-label">Quantity</CFormLabel>
                          <CFormInput
                            type="number"
                            id="quantity"
                            placeholder="Enter quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            invalid={!!errors.quantity}
                          />
                          {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                        </div>
                      </CCol>
                    </CRow>

                    <div className="mb-3">
                      <CFormLabel htmlFor="position" className="form-label">Position</CFormLabel>
                      <CFormInput
                        type="text"
                        id="position"
                        placeholder="Enter Position"
                        value={formData.position}
                        onChange={handleChange}
                        invalid={!!errors.position}
                      />
                      {errors.position && <div className="invalid-feedback">{errors.position}</div>}
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
                      <CFormInput
                        type="text"
                        id="qualification"
                        placeholder="Enter Qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        invalid={!!errors.qualification}
                      />
                      {errors.qualification && <div className="invalid-feedback">{errors.qualification}</div>}
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="description" className="form-label">Job Description</CFormLabel>
                      <ReactQuill
                        value={formData.description}
                        onChange={(value) => handleQuillChange('description', value)}
                      />
                      {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>
                    <div className="mb-3">
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
                      {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="responsibilities" className="form-label">Responsibilities</CFormLabel>
                      <ReactQuill
                        value={formData.responsibilities}
                        onChange={(value) => handleQuillChange('responsibilities', value)}
                      />
                      {errors.responsibilities && <div className="invalid-feedback">{errors.responsibilities}</div>}
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="requiredSkills" className="form-label">Required Skills</CFormLabel>
                      <ReactQuill
                        value={formData.requiredSkills}
                        onChange={(value) => handleQuillChange('requiredSkills', value)}
                      />
                      {errors.requiredSkills && <div className="invalid-feedback">{errors.requiredSkills}</div>}
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="keySkills" className="form-label">Key Skills</CFormLabel>
                      <ReactQuill
                        value={formData.keySkills}
                        onChange={(value) => handleQuillChange('keySkills', value)}
                      />
                      {errors.keySkills && <div className="invalid-feedback">{errors.keySkills}</div>}
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
                        {categories.map((category) => (
                          <option key={category.categoryId
                          } value={category.categoryId}>
                            {category.categoryName}
                          </option>
                        ))}
                      </select>

                      {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                      {console.log('Categories:', categories)}
                    </div>
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

export default EditJob;
