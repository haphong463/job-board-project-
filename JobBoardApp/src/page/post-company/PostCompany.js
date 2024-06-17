import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {jwtDecode} from 'jwt-decode';
import { addCompany, uploadCompanyLogo } from '../../features/companySlice';

export const PostCompany = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    location: '',
    type: '',
    description: '',
    website: '',
    logo: null,
  });

  const [isEmployer, setIsEmployer] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const roles = useSelector((state) => state.auth.roles);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsEmployer(decodedToken.role.some((r) => r.authority === 'ROLE_EMPLOYER'));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleQuillChange = (value) => {
    setFormData({
      ...formData,
      description: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      logo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmployer) {
      alert('You are not authorized to post a company.');
      return;
    }

    try {
      const companyData = {
        companyName: formData.companyName,
        location: formData.location,
        type: formData.type,
        description: formData.description,
        website: formData.website,
      };

      const action = await dispatch(addCompany(companyData));
      const companyId = action.payload.id;

      if (formData.logo) {
        const logoFormData = new FormData();
        logoFormData.append('file', formData.logo);

        await dispatch(uploadCompanyLogo({ id: companyId, file: formData.logo }));
      }

      alert('Company created successfully!');
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Failed to create company.');
    }
  };

  return (
    <GlobalLayoutUser>
      <>
        <section
          className="section-hero overlay inner-page bg-image"
          style={{ backgroundImage: 'url("images/hero_1.jpg")' }}
          id="home-section"
        >
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">Post A Company</h1>
                <div className="custom-breadcrumbs">
                  <a href="#">Home</a> <span className="mx-2 slash">/</span>
                  <a href="#">Company</a> <span className="mx-2 slash">/</span>
                  <span className="text-white">
                    <strong>Post a Company</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="site-section">
          <div className="container">
            <div className="row align-items-center mb-5">
              <div className="col-lg-8 mb-4 mb-lg-0">
                <div className="d-flex align-items-center">
                  <div>
                    <h2>Post A Company</h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="row">
                  <div className="col-6">
                    <a href="#" className="btn btn-block btn-light btn-md">
                      <span className="icon-open_in_new mr-2" />
                      Preview
                    </a>
                  </div>
                  <div className="col-6">
                    <a href="#" className="btn btn-block btn-primary btn-md" onClick={handleSubmit}>
                      Save Company
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-5">
              <div className="col-lg-12">
                <form className="p-4 p-md-5 border rounded" onSubmit={handleSubmit}>
                  <h3 className="text-black mb-5 border-bottom pb-2">Company Details</h3>
                  <div className="form-group">
                    <label htmlFor="company-logo">Upload Logo</label> <br />
                    <label className="btn btn-primary btn-md btn-file">
                      Browse File
                      <input type="file" hidden name="logo" onChange={handleFileChange} />
                    </label>
                    {formData.logo && (
                      <div>
                        <p>{formData.logo.name}</p>
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="companyName">Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="companyName"
                      name="companyName"
                      placeholder="Company Name"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      name="location"
                      placeholder="e.g. New York"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="type">Company Type</label>
                    <select
                      className="selectpicker border rounded"
                      id="type"
                      name="type"
                      data-style="btn-black"
                      data-width="100%"
                      data-live-search="true"
                      title="Select Company Type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                      <option>Education</option>
                      <option>Manufacturing</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Company Description</label>
                    <ReactQuill
                      value={formData.description}
                      onChange={handleQuillChange}
                      modules={{
                        toolbar: [
                          [{ header: '1' }, { header: '2' }, { font: [] }],
                          [{ size: [] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [
                            { list: 'ordered' },
                            { list: 'bullet' },
                            { indent: '-1' },
                            { indent: '+1' },
                          ],
                          ['link', 'image', 'video'],
                          ['clean'],
                        ],
                        clipboard: {
                          matchVisual: false,
                        },
                      }}
                      formats={[
                        'header',
                        'font',
                        'size',
                        'bold',
                        'italic',
                        'underline',
                        'strike',
                        'blockquote',
                        'list',
                        'bullet',
                        'indent',
                        'link',
                        'image',
                        'video',
                      ]}
                      theme="snow"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="website">Website (Optional)</label>
                    <input
                      type="url"
                      className="form-control"
                      id="website"
                      name="website"
                      placeholder="https://"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-md btn-block">
                    Save Company
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </>
    </GlobalLayoutUser>
  );
};