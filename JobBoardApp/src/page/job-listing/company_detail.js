import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import moment from 'moment';
import './company_detail.css';
import './job-single.css';
import { NavLink, useParams } from 'react-router-dom';
import jobData1 from './job_data.json';
import companyData1 from './company_data.json';
import { fetchCompanyThunk } from "../../features/companySlice";
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

   useEffect(() =>
   {
      if (companies.length === 0)
      {
         dispatch(fetchCompanyThunk());
      }
   }, [dispatch, companies.length]);

   const companyData = companies.find(company => company.companyId === companyId);

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
                                 <li className="mb-2 d-flex justify-content-between align-items-start"><strong>Country:</strong> <span className="text-dark"><i className={`fi fi-${companyData?.countryCode} border border-gray rounded-sm`}></i> {companyData?.country}</span></li>
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
         </>
      </GlobalLayoutUser>
   );
}
