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
  CRow,
  CFormSelect
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { addJob } from '../../features/JobSlice';
import { jwtDecode } from 'jwt-decode';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { fetchCategoryThunk } from '../../features/categorySlice';
import Select from 'react-select';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for DatePicker

import { format, parse } from 'date-fns';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    offeredSalary: '',
    description: '',
    city: '',
    responsibilities: '',
    requiredSkills: '',
    workSchedule: '',
    categoryId: [], // Change to array
    position: '',
    experience: '',
    slot: '',
    qualification: '',
    benefit: '',
    companyId: '',
    expire: '',
  });

  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, state: categoryState } = useSelector(state => state.categories);

  useEffect(() => {
    dispatch(fetchCategoryThunk());
  }, [dispatch]);

  useEffect(() => {
    if (categoryState === 'succeeded') {
      setFormData(prevData => ({
        ...prevData,
        categoryId: categories.length > 0 ? categories[0].id : '',
      }));
    }
  }, [categories, categoryState]);


  console.log(categories);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setFormData(prevData => ({
          ...prevData,
          companyId: decodedToken.company // Set companyId from token
        }));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);



  const fetchProvinces = async () => {
    try {
      const response = await fetch('https://open.oapi.vn/location/provinces');
      if (!response.ok) {
        throw new Error('Failed to fetch provinces');
      }
      const data = await response.json();

      if (data.code === 'success') {
        setProvinces(data.data);
      } else {
        throw new Error('Invalid data format from API');
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          const result = await dispatch(addJob({ userId, data: formData }));
          if (addJob.fulfilled.match(result)) {
            navigate('/job?success=true');
          } else {
            console.log('Failed to add job:', result.payload);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  };
  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = format(date, 'dd/MM/yyyy'); // Định dạng ngày
      setFormData(prevData => ({
        ...prevData,
        expire: formattedDate,
      }));
    }
  };
  const validateForm = () => {
    let tempErrors = {};

    const currentDate = new Date();
    const expireDate = formData.expire ? parse(formData.expire, 'dd/MM/yyyy', new Date()) : null;
    const tenDaysLater = new Date();
    tenDaysLater.setDate(currentDate.getDate() + 10);

    if (!formData.expire) tempErrors.expire = "Expire date is required";
    else if (expireDate < tenDaysLater) tempErrors.expire = "Expire date must be at least 10 days from today";

    if (!formData.title) tempErrors.title = "Title is required";
    else if (formData.title.length > 200) tempErrors.title = "Title must be less than 200 characters";

    if (!formData.offeredSalary) tempErrors.offeredSalary = "Offered Salary is required";
    else if (formData.offeredSalary <= 100) tempErrors.offeredSalary = "Offered Salary must be greater than 100";
    else if (formData.offeredSalary < 0) tempErrors.offeredSalary = "Offered Salary cannot be negative";

    if (!formData.description) tempErrors.description = "Description is required";
    if (!formData.workSchedule) tempErrors.workSchedule = "Work Schedule is required";
    if (!formData.city) tempErrors.city = "City is required";
    if (!formData.responsibilities) tempErrors.responsibilities = "Responsibilities are required";
    if (!formData.requiredSkills) tempErrors.requiredSkills = "Required Skills are required";
    if (!formData.position) tempErrors.position = "Position is required";
    if (!formData.experience) tempErrors.experience = "Experience is required";
    if (!formData.qualification) tempErrors.qualification = "Qualification is required";
    if (!formData.benefit) tempErrors.benefit = "Benefit is required";
    if (!formData.categoryId.length) tempErrors.categoryId = "Category is required";
    if (!formData.slot) tempErrors.slot = "Quantity is required";
    else if (formData.slot < 0) tempErrors.slot = "Quantity cannot be negative";

    console.log(tempErrors);
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleSelectChange = (selectedOptions, actionMeta) => {
    if (actionMeta.name === 'categoryId') {
      setFormData(prevData => ({
        ...prevData,
        categoryId: selectedOptions ? selectedOptions.map(option => option.value) : []
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        keySkills: selectedOptions ? selectedOptions.map(option => option.value) : []
      }));
    }
  };
  const jobOptions = [
    // Your options list here
  ];

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
                          <CFormLabel htmlFor="workSchedule" className="form-label">workSchedule</CFormLabel>
                          <CFormInput
                            type="text"
                            id="workSchedule"
                            placeholder="Enter workSchedule"
                            value={formData.workSchedule}
                            onChange={handleChange}
                            invalid={!!errors.workSchedule}
                          />
                          {errors.workSchedule && <div className="invalid-feedback">{errors.workSchedule}</div>}
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="slot" className="form-label">Quantity</CFormLabel>
                          <CFormInput
                            type="number"
                            id="slot"
                            placeholder="Enter quantity"
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
                          <CFormLabel htmlFor="categoryId" className="form-label">Category</CFormLabel>
                          <Select
                            isMulti
                            name="categoryId"
                            options={categories.map(cat => ({ value: cat.categoryId, label: cat.categoryName }))}
                            onChange={handleSelectChange}
                            value={formData.categoryId.map(id => {
                              const category = categories.find(cat => cat.categoryId === id);
                              return category ? { value: category.categoryId, label: category.categoryName } : null;
                            }).filter(Boolean)}
                          />
                          {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="position" className="form-label">Position</CFormLabel>
                          <CFormSelect
                            id="position"
                            value={formData.position}
                            onChange={handleChange}
                            invalid={!!errors.position}
                          >
                            <option value="">Select position</option>
                            <option value="INTERN">Intern</option>
                            <option value="FRESHER">Fresher</option>
                            <option value="JUNIOR">Junior</option>
                            <option value="MIDDLE">Middle</option>
                            <option value="SENIOR">Senior</option>
                            <option value="LEADER">Leader</option>
                            <option value="MANAGER">Manager</option>
                          </CFormSelect>
                          {errors.position && <div className="invalid-feedback">{errors.position}</div>}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="experience" className="form-label">Experience</CFormLabel>
                          <CFormInput
                            type="text"
                            id="experience"
                            placeholder="Enter experience"
                            value={formData.experience}
                            onChange={handleChange}
                            invalid={!!errors.experience}
                          />
                          {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
                        </div>
                      </CCol>

                      <CRow>
                        <CCol md={6}>
                          <div className="mb-3">
                            <CFormLabel htmlFor="expire" className="form-label">Expire Date</CFormLabel>
                            <DatePicker
                              id="expire"
                              selected={formData.expire ? parse(formData.expire, 'dd/MM/yyyy', new Date()) : null}
                              onChange={handleDateChange}
                              dateFormat="dd/MM/yyyy"
                              placeholderText="Select expiration date"
                              className="form-control"
                            />

                          </div>
                        </CCol>
                      </CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="qualification" className="form-label">Qualification</CFormLabel>
                          <CFormInput
                            type="text"
                            id="qualification"
                            placeholder="Enter qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                            invalid={!!errors.qualification}
                          />
                          {errors.qualification && <div className="invalid-feedback">{errors.qualification}</div>}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={12}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="description" className="form-label">Job Description</CFormLabel>
                          <ReactQuill
                            value={formData.description}
                            onChange={(value) => handleQuillChange('description', value)}
                          />
                          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={12}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="responsibilities" className="form-label">Job Responsibilities</CFormLabel>
                          <ReactQuill
                            value={formData.responsibilities}
                            onChange={(value) => handleQuillChange('responsibilities', value)}
                          />
                          {errors.responsibilities && <div className="invalid-feedback">{errors.responsibilities}</div>}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={12}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="requiredSkills" className="form-label">Key Skills</CFormLabel>
                          <ReactQuill
                            value={formData.requiredSkills}
                            onChange={(value) => handleQuillChange('requiredSkills', value)}
                          />
                          {errors.requiredSkills && <div className="invalid-feedback">{errors.requiredSkills}</div>}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={12}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="benefit" className="form-label">Benefit</CFormLabel>
                          <ReactQuill
                            value={formData.benefit}
                            onChange={(value) => handleQuillChange('benefit', value)}
                          />
                          {errors.benefit && <div className="invalid-feedback">{errors.benefit}</div>}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={12}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="city" className="form-label">City</CFormLabel>
                          <select
                            className="form-select"
                            id="city"
                            value={formData.city}
                            onChange={handleChange}
                          >
                            {provinces.map(province => (
                              <option key={province.id} value={province.id}>{province.name}</option>
                            ))}
                          </select>
                          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                        </div>
                      </CCol>
                    </CRow>
                    <CButton type="submit" color="primary">Submit</CButton>
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


const style = document.createElement('style');
style.textContent = `

.invalid-feedback {
  color: red;
  font-size: 0.875rem;
}


`;
document.head.appendChild(style);
