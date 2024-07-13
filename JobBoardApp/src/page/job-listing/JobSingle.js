import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import moment from 'moment';
import './job-single.css';
import { NavLink, useParams } from 'react-router-dom';
import jobData1 from './job_data.json';
import companyData1 from './company_data.json';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import 'flag-icons/css/flag-icons.min.css';
import parse from 'html-react-parser';

export const JobSingle = () =>
{
   const { id } = useParams();
   const jobId = parseInt(id ?? '0', 10);

   const jobData = jobData1.find(job => job.id === jobId);
   const companyData = companyData1.find(company => company.companyId === jobData?.companyId);

   const formatJobPostedTime = (date) =>
   {
      const now = moment();
      const createdAt = moment(date);

      const monthsAgo = now.diff(createdAt, 'months');
      const weeksAgo = now.diff(createdAt, 'weeks');
      const daysAgo = now.diff(createdAt, 'days');
      const hoursAgo = now.diff(createdAt, 'hours');
      const minutesAgo = now.diff(createdAt, 'minutes');
      const secondsAgo = now.diff(createdAt, 'seconds');

      if (monthsAgo >= 1)
      {
         return `Posted ${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
      }

      if (weeksAgo >= 1)
      {
         return `Posted ${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
      }

      if (daysAgo >= 1)
      {
         return `Posted ${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
      }

      if (hoursAgo >= 1)
      {
         return `Posted ${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
      }

      if (minutesAgo >= 1)
      {
         return `Posted ${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
      }

      return `Posted ${secondsAgo} second${secondsAgo > 1 ? 's' : ''} ago`;
   };

   let timeAgo = jobData?.createdAt ? formatJobPostedTime(jobData.createdAt) : '';
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
         return parts[len - 1];
      }
      return address;
   };
   const address = getLocation1String(companyData?.location);

   const handleCompanyClick = (companyId) =>
   {
      window.location.href = `/companyDetail/${companyId}`;
   };

   const addIconsToListItems = (htmlString) =>
   {
      return parse(htmlString, {
         replace: (domNode) =>
         {
            if (domNode.name === 'li')
            {
               return (
                  <li className="d-flex align-items-start mb-2 trf">
                     <span className="icon-check_circle mr-2 text-muted" />
                     <span>{domNode.children[0].data}</span>
                  </li>
               );
            }
         },
      });
   };

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
                        <h1 className="text-white font-weight-bold">
                           Product Designer
                        </h1>
                        <div className="custom-breadcrumbs">
                           <a href="#">Home</a> <span className="mx-2 slash">/</span>
                           <a href="#">Job</a> <span className="mx-2 slash">/</span>
                           <span className="text-white">
                              <strong>Product Designer</strong>
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section className="site-section">
               <div className="container jb_content1">
                  <div className="row align-items-center mb-5">
                     <div className="col-lg-8 mb-4 mb-lg-0">
                        <div className="d-flex align-items-center">
                           <div>
                              <h2>{jobData?.title}</h2>
                              <div>
                                 <span className="m-2">
                                    <span className="icon-room mr-2" />
                                    {jobData?.location}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="col-lg-4">
                        <div className="row">
                           <div className="col-6">
                              <a href="#" className="btn btn-block btn-light btn-md">
                                 <span className="icon-heart-o mr-2 text-danger" />
                                 Save Job
                              </a>
                           </div>
                           <div className="col-6">
                              <a href="#" className="btn btn-block btn-primary btn-md">
                                 Apply Now
                              </a>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-lg-8">
                        <div className="mb-5">
                           <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                              <span className="icon-align-left mr-3" />
                              Job Description
                           </h3>
                           <div dangerouslySetInnerHTML={{ __html: jobData?.description }} />
                        </div>
                        <div className="mb-5">
                           <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                              <span className="icon-rocket mr-3" />
                              Responsibilities
                           </h3>
                           <ul className="list-unstyled m-0 p-0">
                              {addIconsToListItems(jobData?.responsibilities)}
                           </ul>

                        </div>
                        <div className="mb-5">
                           <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                              <span className="icon-book mr-3" />
                              Education + Skills
                           </h3>
                           <h6 className="jb_header1">1. Educational Background</h6>
                           <ul className="list-unstyled m-0 p-0 ">
                              {addIconsToListItems(jobData?.qualification)}
                           </ul>
                           <h6 className="jb_header1">2. Skills</h6>
                           <ul className="list-unstyled m-0 p-0">
                              {addIconsToListItems(jobData?.requiredSkills)}
                           </ul>
                        </div>
                        <div className="mb-5">
                           <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                              <span className="icon-turned_in mr-3" />
                              Benefits for you
                           </h3>
                           <ul className="list-unstyled m-0 p-0">
                              {addIconsToListItems(jobData?.benefit)}
                           </ul>
                        </div>
                     </div>
                     <div className="col-lg-4">
                        <div className="bg-light p-3 border rounded mb-4">
                           <h3 className="text-primary  mt-3 h5 pl-3 mb-3 ">
                              Job Summary
                           </h3>
                           <ul className="list-unstyled pl-3 mb-0">
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Experience</strong>
                                 <span>{jobData?.experience}</span>
                              </li>
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Level</strong>
                                 <span>{jobData?.position}</span>
                              </li>
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Job type</strong>{" "}
                                 <span>{jobData?.jobType}</span>
                              </li>
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Contract type</strong>
                                 <span>{jobData?.contractType}</span>
                              </li>
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Number of recruits</strong>
                                 <span>{jobData?.numberOfRecruits} people</span>
                              </li>
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Salary</strong>
                                 <span>{jobData?.offeredSalary}</span>
                              </li>
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Gender</strong>
                                 <span>{jobData?.gender}</span>
                              </li>
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Application Deadline</strong>
                                 <span>{jobData?.expire}</span>
                              </li>
                           </ul>
                        </div>
                        <div className="bg-light p-3 border rounded">
                           <h3 className="text-primary  mt-3 h5 pl-3 mb-3 ">Company Information</h3>
                           <div className="px-3">
                              <div className="d-flex align-items-center">
                                 <img
                                    src={companyData?.logo}
                                    alt="Image"
                                    className="w-50 h-100 border p-0 d-inline-block mr-3 rounded"
                                 />
                                 <NavLink to={``} className="pt-3 pb-3 pr-3 pl-0" onClick={() => handleCompanyClick(jobData?.companyId)}>
                                    {companyData?.companyName}
                                 </NavLink>
                              </div>
                              <br />
                              <ul className="list-unstyled mb-0">
                                 <li className="d-flex justify-content-between mb-2">
                                    <strong className="text-black">Company type</strong>{" "}
                                    <span>{companyData?.type}</span>
                                 </li>
                                 <li className="d-flex justify-content-between mb-2">
                                    <strong className="text-black">Company size</strong>
                                    <span>{companyData?.companySize}</span>
                                 </li>
                                 <li className="d-flex justify-content-between mb-2">
                                    <strong className="text-black">Country</strong>
                                    <span><i className={`fi fi-${companyData?.countryCode}`}></i>&nbsp;&nbsp;{companyData?.country}</span>
                                 </li>
                                 <li className="d-flex justify-content-between mb-2">
                                    <strong className="text-black">Working days</strong>{" "}
                                    <span>{companyData?.workingDays}</span>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section className="site-section" id="next">
               <div className="container">
                  <div className="row mb-5 justify-content-center">
                     <div className="col-md-7 text-center">
                        <h2 className="section-title mb-2">22,392 Related Jobs</h2>
                     </div>
                  </div>
                  <ul className="job-listings mb-5">
                     <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
                        <a href="job-single.html" />
                        <div className="job-listing-logo">
                           <img
                              src="../../../../assets/images/job_logo_1.jpg"
                              alt="Image"
                              className="img-fluid"
                           />
                        </div>
                        <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                           <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                              <h2>Product Designer</h2>
                              <strong>Adidas</strong>
                           </div>
                           <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                              <span className="icon-room" /> New York, New York
                           </div>
                           <div className="job-listing-meta">
                              <span className="badge badge-danger">Part Time</span>
                           </div>
                        </div>
                     </li>
                     <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
                        <a href="job-single.html" />
                        <div className="job-listing-logo">
                           <img
                              src="../../../../assets/images/job_logo_2.jpg"
                              alt="Image"
                              className="img-fluid"
                           />
                        </div>
                        <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                           <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                              <h2>Digital Marketing Director</h2>
                              <strong>Sprint</strong>
                           </div>
                           <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                              <span className="icon-room" /> Overland Park, Kansas
                           </div>
                           <div className="job-listing-meta">
                              <span className="badge badge-success">Full Time</span>
                           </div>
                        </div>
                     </li>
                     <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
                        <a href="job-single.html" />
                        <div className="job-listing-logo">
                           <img
                              src="../../../../assets/images/job_logo_3.jpg"
                              alt="Image"
                              className="img-fluid"
                           />
                        </div>
                        <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                           <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                              <h2>Back-end Engineer (Python)</h2>
                              <strong>Amazon</strong>
                           </div>
                           <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                              <span className="icon-room" /> Overland Park, Kansas
                           </div>
                           <div className="job-listing-meta">
                              <span className="badge badge-success">Full Time</span>
                           </div>
                        </div>
                     </li>
                     <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
                        <a href="job-single.html" />
                        <div className="job-listing-logo">
                           <img
                              src="../../../../assets/images/job_logo_4.jpg"
                              alt="Image"
                              className="img-fluid"
                           />
                        </div>
                        <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                           <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                              <h2>Senior Art Director</h2>
                              <strong>Microsoft</strong>
                           </div>
                           <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                              <span className="icon-room" /> Anywhere
                           </div>
                           <div className="job-listing-meta">
                              <span className="badge badge-success">Full Time</span>
                           </div>
                        </div>
                     </li>
                     <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
                        <a href="job-single.html" />
                        <div className="job-listing-logo">
                           <img
                              src="../../../../assets/images/job_logo_5.jpg"
                              alt="Image"
                              className="img-fluid"
                           />
                        </div>
                        <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                           <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                              <h2>Product Designer</h2>
                              <strong>Puma</strong>
                           </div>
                           <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                              <span className="icon-room" /> San Mateo, CA
                           </div>
                           <div className="job-listing-meta">
                              <span className="badge badge-success">Full Time</span>
                           </div>
                        </div>
                     </li>
                     <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
                        <a href="job-single.html" />
                        <div className="job-listing-logo">
                           <img
                              src="../../../../assets/images/job_logo_1.jpg"
                              alt="Image"
                              className="img-fluid"
                           />
                        </div>
                        <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                           <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                              <h2>Product Designer</h2>
                              <strong>Adidas</strong>
                           </div>
                           <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                              <span className="icon-room" /> New York, New York
                           </div>
                           <div className="job-listing-meta">
                              <span className="badge badge-danger">Part Time</span>
                           </div>
                        </div>
                     </li>
                     <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
                        <a href="job-single.html" />
                        <div className="job-listing-logo">
                           <img
                              src="../../../../assets/images/job_logo_2.jpg"
                              alt="Image"
                              className="img-fluid"
                           />
                        </div>
                        <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                           <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                              <h2>Digital Marketing Director</h2>
                              <strong>Sprint</strong>
                           </div>
                           <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                              <span className="icon-room" /> Overland Park, Kansas
                           </div>
                           <div className="job-listing-meta">
                              <span className="badge badge-success">Full Time</span>
                           </div>
                        </div>
                     </li>
                  </ul>
                  <div className="row pagination-wrap">
                     <div className="col-md-6 text-center text-md-left mb-4 mb-md-0">
                        <span>Showing 1-7 Of 22,392 Jobs</span>
                     </div>
                     <div className="col-md-6 text-center text-md-right">
                        <div className="custom-pagination ml-auto">
                           <a href="#" className="prev">
                              Prev
                           </a>
                           <div className="d-inline-block">
                              <a href="#" className="active">
                                 1
                              </a>
                              <a href="#">2</a>
                              <a href="#">3</a>
                              <a href="#">4</a>
                           </div>
                           <a href="#" className="next">
                              Next
                           </a>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section className="bg-light pt-5 testimony-full">
               <div className="owl-carousel single-carousel">
                  <div className="container">
                     <div className="row">
                        <div className="col-lg-6 align-self-center text-center text-lg-left">
                           <blockquote>
                              <p>
                                 “Soluta quasi cum delectus eum facilis recusandae nesciunt
                                 molestias accusantium libero dolores repellat id in
                                 dolorem laborum ad modi qui at quas dolorum voluptatem
                                 voluptatum repudiandae.”
                              </p>
                              <p>
                                 <cite> — Corey Woods, @Dribbble</cite>
                              </p>
                           </blockquote>
                        </div>
                        <div className="col-lg-6 align-self-end text-center text-lg-right">
                           <img
                              src="../../../../assets/images/person_transparent_2.png"
                              alt="Image"
                              className="img-fluid mb-0"
                           />
                        </div>
                     </div>
                  </div>
                  <div className="container">
                     <div className="row">
                        <div className="col-lg-6 align-self-center text-center text-lg-left">
                           <blockquote>
                              <p>
                                 “Soluta quasi cum delectus eum facilis recusandae nesciunt
                                 molestias accusantium libero dolores repellat id in
                                 dolorem laborum ad modi qui at quas dolorum voluptatem
                                 voluptatum repudiandae.”
                              </p>
                              <p>
                                 <cite> — Chris Peters, @Google</cite>
                              </p>
                           </blockquote>
                        </div>
                        <div className="col-lg-6 align-self-end text-center text-lg-right">
                           <img
                              src="../../../../assets/images/person_transparent.png"
                              alt="Image"
                              className="img-fluid mb-0"
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section
               className="pt-5 bg-image overlay-primary fixed overlay"
               style={{
                  backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
               }}
            >
               <div className="container">
                  <div className="row">
                     <div className="col-md-6 align-self-center text-center text-md-left mb-5 mb-md-0">
                        <h2 className="text-white">Get The Mobile Apps</h2>
                        <p className="mb-5 lead text-white">
                           Lorem ipsum dolor sit amet consectetur adipisicing elit
                           tempora adipisci impedit.
                        </p>
                        <p className="mb-0">
                           <a
                              href="#"
                              className="btn btn-dark btn-md px-4 border-width-2"
                           >
                              <span className="icon-apple mr-3" />
                              App Store
                           </a>
                           <a
                              href="#"
                              className="btn btn-dark btn-md px-4 border-width-2"
                           >
                              <span className="icon-android mr-3" />
                              Play Store
                           </a>
                        </p>
                     </div>
                     <div className="col-md-6 ml-auto align-self-end">
                        <img
                           src="../../../../assets/images/apps.png"
                           alt="Image"
                           className="img-fluid"
                        />
                     </div>
                  </div>
               </div>
            </section>
         </>
      </GlobalLayoutUser >
   );
};

export default JobSingle;
