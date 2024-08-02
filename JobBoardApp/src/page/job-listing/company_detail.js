import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import moment from 'moment';
import { NavLink, useParams } from 'react-router-dom';
import jobData1 from './job_data.json';
import companyData1 from './company_data.json';
import { fetchCompanyThunk } from "../../features/companySlice";
import { fetchJobThunk } from "../../features/jobSlice";
import { fetchCategoryThunk } from "../../features/categorySlice";
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import 'flag-icons/css/flag-icons.min.css';
import { useDispatch, useSelector } from 'react-redux';

export const CompanyDetail = () =>
{
   const { id } = useParams();
   const companyId = parseInt(id ?? '0', 10);
   const dispatch = useDispatch();
   const companies = useSelector((state) => state.company.companies);
   const jobs = useSelector((state) => state.job.jobs);
   const categories = useSelector((state) => state.category.categories);

   useEffect(() =>
   {
      dispatch(fetchCompanyThunk());
      dispatch(fetchJobThunk());
      dispatch(fetchCategoryThunk());
   }, []);

   const companyData = companies.find(company => company.companyId === companyId);
   const companyJobs = jobs.filter(job => job.companyId === companyId);

   const getLocation1String = (address) =>
   {
      if (typeof address !== 'string')
      {
         return '';
      }
      const parts = address.split(", ");
      const len = parts.length;
      if (len >= 2)
      {
         return parts.slice(-2).join(", ");
      }
      return address;
   };

   const handleCompanyClick = (companyId) =>
   {
      window.location.href = `/companyDetail/${companyId}`;
   };

   const handleJobDetailClick = (jobId, companyId) =>
   {
      window.location.href = `/jobDetail/${jobId}/${companyId}`;
   };

   const categoryArray = Array.isArray(categories) ? categories : [];
   const handleCategoryClick = (categoryId) =>
   {
      window.location.href = `/jobList/${categoryId}`;
   };
   const categoryName = categoryArray.find(category => category.categoryId === id)?.categoryName;

   return (
      <GlobalLayoutUser>
         <>
            <section
               className="section-hero overlay inner-page bg-image"
               style={{
                  backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
               }}
               id="home-section"
            >
               <div className="container">
                  <div className="row">
                     <div className="col-md-7">
                        <h1 className="text-white font-weight-bold">{companyData?.companyName}</h1>
                     </div>
                  </div>
               </div>
            </section>
            <div className="container-fluid custom-container pt-5 pb-5">
               <div className="row justify-content-center jb_content1">
                  <div className="col-xl-11 col-lg-11">
                     <div className="row">
                        {/* Left Content */}
                        <div className="col-xl-8 col-lg-8 mb-4">
                           <div className="card shadow-lg p-4 ml-2 text-dark">
                              <div className="d-flex align-items-center mb-4">
                                 <img
                                    className="rounded border border-light shadow-sm mr-3 img-fluid"
                                    src={companyData?.logo}  // Use a medium-sized image by default
                                    alt="Company Logo"
                                    style={{ width: '13em', height: '13em', objectFit: 'contain' }}
                                 />
                                 <div>
                                    <h4 className="font-weight-bold mb-2">{companyData?.companyName}</h4>
                                 </div>
                              </div>
                              {/* Job Details */}
                              <div className="job-details" dangerouslySetInnerHTML={{ __html: companyData?.description }} />
                           </div>
                        </div>
                        {/* Right Content */}
                        <div className="col-xl-4 col-lg-4">
                           <div className="card shadow-sm p-4 mb-4">
                              <h5 className="card-title">General Information</h5>
                              <ul className="list-unstyled">
                                 <li className="mb-2 d-flex justify-content-between align-items-start"><strong>Company Type:</strong> <span className="text-dark">{companyData?.type}</span></li>
                                 <li className="mb-2 d-flex justify-content-between align-items-start"><strong>Company Size:</strong> <span className="text-dark">{companyData?.companySize}</span></li>
                                 <li className="mb-2 d-flex justify-content-between align-items-start"><strong>Country:</strong> <span className="text-dark"><i className={`fi fi-${companyData?.countryCode} border border-gray rounded-sm`} style={{ width: '1.4em', lineHeight: '1em' }}></i> {companyData?.country}</span></li>
                                 <li className="mb-2 d-flex justify-content-between align-items-start"><strong>Working Days:</strong> <span className="text-dark">{companyData?.workingDays}</span></li>
                              </ul>
                           </div>
                           <div className="card shadow-sm p-4 mb-4">
                              <h5 className="card-title">Contact Information</h5>
                              <ul className="list-unstyled">
                                 <li className="mb-2 d-flex justify-content-between align-items-start"><strong>Website:</strong> <a href={companyData?.websiteLink} className="text-primary" target="_blank" rel="noopener noreferrer">{companyData?.websiteLink}</a></li>
                                 <li className="mb-2 "><strong>Office Address</strong><span className="text-dark">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FaMapMarkerAlt className="mr-1" />{companyData?.location}</span></li>
                              </ul>
                           </div>
                           <div className="card shadow-sm p-4">
                              <h5 className="card-title mb-4">Tech Stack</h5>
                              <div>
                                 {companyData?.keySkills.split(',').map((skill, index) => (
                                    <span key={index} className="text-dark rounded-sm border border-gray mr-2 p-1" style={{ marginBottom: '8px', display: 'inline-block' }}>{skill.trim()}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="col-xl-8 col-lg-12 mb-4">
               <div className="p-4 ml-5">
                  <div className="row mb-5 justify-content-center">
                     <div className="col-md-7 text-center">
                        <h2 className="section-title mb-2">{companyJobs.length} job openings</h2>
                     </div>
                  </div>
                  <ul className="job-listings mb-5">
                     {companyJobs.length === 0 ? (
                        <li className="text-center">No jobs for this company.</li>
                     ) : (
                        companyJobs.map(job =>
                        {
                           const company = companies.find(company => company.companyId === job.companyId);
                           const address = getLocation1String(company?.location);
                           if (company)
                           {
                              return (
                                 <li className="col-12 job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center mb-3 jb_bg-light border border-gray rounded">
                                    <div className="job-listing-logo">
                                       <img
                                          src={company.logo}
                                          alt="Free Website"
                                          className="img-fluid p-0 d-inline-block rounded-sm me-2 bg-white"
                                          onClick={() =>
                                          {
                                             handleCompanyClick(job.companyId);
                                          }} style={{ width: '7em', height: '7em', objectFit: 'contain', cursor: 'pointer' }}
                                       />

                                       {/* <img src={company.logo} className="img-fluid rounded-sm border border-gray me-2 bg-white" style={{ width: '90px', height: '90px', objectFit: 'contain' }} /> */}

                                    </div>

                                    <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4 gap-3 mt-4 mb-4">
                                       <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                                          <h2 className="mb-2" onClick={() =>
                                          {
                                             handleJobDetailClick(job.id, job.companyId);
                                             console.log(job.companyId);
                                          }} style={{ textDecoration: 'none', cursor: 'pointer' }}>{job.title}</h2>
                                          <strong onClick={() =>
                                          {
                                             handleCompanyClick(job.companyId);
                                          }} style={{ textDecoration: 'none', cursor: 'pointer' }}>{company.companyName}</strong>
                                          <div className="m-0 mt-3">
                                             {job.categoryId.map((id) =>
                                             {
                                                return categoryName ? (
                                                   <span key={id} onClick={() => handleCategoryClick(id)} className="jb_text1 bg-white border border-gray p-2 mr-2 rounded-pill text-dark">
                                                      {categoryName}
                                                   </span>
                                                ) : null;
                                             })}
                                          </div>
                                       </div>
                                       <div className="d-flex flex-column flex-sm-row align-items-start flex-grow-1 gap-3">
                                          <div className="justify-content-start me-3">
                                             <span className="icon-room me-2" /> {address}
                                          </div>
                                       </div>
                                       <div className="job-listing-meta ">
                                          <span className="badge bg-danger">{job.contractType}</span>
                                       </div>
                                    </div>

                                 </li>
                              );
                           }
                           return null;
                        })
                     )}
                  </ul>
               </div>
            </div>
         </>
      </GlobalLayoutUser >
   );
}
