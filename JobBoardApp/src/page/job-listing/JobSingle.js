import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import moment from 'moment';
import './job_company.css';
import { NavLink, useParams } from 'react-router-dom';
import { fetchJobThunk } from "../../features/jobSlice";
import { fetchCompanyThunk } from "../../features/companySlice";
import { fetchCategoryThunk } from "../../features/categorySlice";
// import jobData1 from './job_data.json';
// import companyData1 from './company_data.json';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import 'flag-icons/css/flag-icons.min.css';
import parse from 'html-react-parser';
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle } from 'react-bootstrap-icons';

export const JobSingle = () =>
{
   const { id } = useParams();
   const jobId = parseInt(id ?? '0', 10);
   // const [jobs, setJobs] = useState([]);
   const dispatch = useDispatch();
   const jobs = useSelector((state) => state.job.jobs);
   const companies = useSelector((state) => state.company.companies);
   const categories = useSelector((state) => state.category.categories);

   useEffect(() =>
   {
      dispatch(fetchCategoryThunk());

      if (companies.length === 0)
      {
         dispatch(fetchCompanyThunk());
      }
      if (jobs.length === 0)
      {
         dispatch(fetchJobThunk());
      }
   }, [dispatch, jobs.length, companies.length]);

   const jobData = jobs.find(job => job.id === jobId);
   console.log(jobData);
   const companyData = companies.find(company => company.companyId === jobData?.companyId);

   if (!jobData || !companyData)
   {
      return <div>Loading...</div>; // Hoặc bạn có thể chuyển hướng đến trang lỗi
   }

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

   const handleCategoryClick = (categoryId) =>
   {
      window.location.href = `/jobList/${categoryId}`;
   };

   const handleJobDetailClick = (jobId, companyId) =>
   {
      window.location.href = `/jobDetail/${jobId}/${companyId}`;
   };

   const addIconsToListItems = (htmlString) =>
   {
      return parse(htmlString, {
         replace: (domNode) =>
         {
            return parseChildNode(domNode);
         },
      });
   };

   const parseChildNode = (domNode) =>
   {
      if (domNode.type === 'text')
      {
         return domNode.data;
      }

      if (domNode.name === 'li')
      {
         return (
            <li className="d-flex align-items-start mb-2 trf">
               <span className="icon-check_circle mr-2 text-muted" />
               <span>{domNode.children.map((child, index) => (
                  <React.Fragment key={index}>{parseChildNode(child)}</React.Fragment>
               ))}</span>
            </li>
         );
      }

      if (domNode.type === 'tag')
      {
         const Tag = domNode.name;
         return (
            <Tag {...domNode.attribs}>
               {domNode.children.map((child, index) => (
                  <React.Fragment key={index}>{parseChildNode(child)}</React.Fragment>
               ))}
            </Tag>
         );
      }
      return null;
   };

   // const currentJobKeySkills = jobData?.keySkills ? jobData.keySkills.split(',').map(skill => skill.trim()) : [];

   // // Filter jobs that share any key skills with the current job
   // const relatedJobs = jobs.filter(job =>
   //    job.id !== jobId &&
   //    job.keySkills && // Ensure job.keySkills is not null or undefined
   //    job.keySkills.split(',').map(skill => skill.trim()).some(skill => currentJobKeySkills.includes(skill))
   // );

   // const currentJobCategoryIds = new Set(jobData.categoryId);  // Chuyển List<Long> thành Set<Long>

   // const relatedJobs = jobs.filter(job =>
   // {
   //    const jobCategoryIds = new Set(job.categoryId);

   //    // Kiểm tra xem có bất kỳ phần tử nào trong jobCategoryIds tồn tại trong currentJobCategoryIds
   //    for (const id of jobCategoryIds)
   //    {
   //       if (currentJobCategoryIds.has(id))
   //       {
   //          return true;
   //       }
   //    }
   //    return false;
   // });

   const categoryArray = Array.isArray(categories) ? categories : [];

   const categoryIds = Array.isArray(jobData.categoryId) ? jobData.categoryId : [];
   const currentJobCategoryIds = new Set(categoryIds);

   const relatedJobs = jobs.filter(job =>
   {
      if (!Array.isArray(job.categoryId))
      {
         console.error("categoryId in job is not an array");
         return false;
      }

      // Loại bỏ job hiện tại
      if (job.id === jobId)
      {
         return false;
      }

      const jobCategoryIds = new Set(job.categoryId);

      for (const id of jobCategoryIds)
      {
         if (currentJobCategoryIds.has(id))
         {
            return true;
         }
      }
      return false;
   });

   // const currentJobKeySkills = jobData?.keySkills ? jobData.keySkills.split(',').map(skill => skill.trim()) : [];

   // // Filter jobs that share any key skills with the current job
   // const relatedJobs = jobs.filter(job =>
   //    job.id !== jobId &&
   //    job.keySkills && // Ensure job.keySkills is not null or undefined
   //    job.keySkills.split(',').map(skill => skill.trim()).some(skill => currentJobKeySkills.includes(skill))
   // );

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
                           {jobData?.title}
                        </h1>
                        <div className="custom-breadcrumbs">
                           <a href="/">Home</a> <span className="mx-2 slash">/</span>
                           <NavLink to={'/viewAllJobs'}>Job</NavLink> <span className="mx-2 slash">/</span>
                           <span className="text-white">
                              <strong>{jobData?.title}</strong>
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section className="site-section jb_content0">
               <div className="container-fluid jb_content1">
                  <div className="row align-items-center mb-5">
                     <div className="col-lg-8 mb-4 mb-lg-0">
                        <div className="d-flex align-items-center">
                           <div>
                              <h2>{jobData?.title}</h2>
                              <div className="m-0 mt-3">
                                 <span className="icon-room" />
                                 {companyData?.location}
                              </div>
                              <div className="m-0 mt-3">
                                 {jobData.categoryId.map((id) =>
                                 {
                                    const categoryName = categoryArray.find(category => category.categoryId === id)?.categoryName;
                                    return categoryName ? (
                                       <NavLink key={id} onClick={() => handleCategoryClick(id)} className="jb_text1 bg-white border border-gray p-2 mr-2 rounded-pill text-dark" to={""}>
                                          {categoryName}
                                       </NavLink>
                                    ) : null;
                                 })}
                              </div>

                              {/* <div className="m-0 mt-3" >
                                 {jobData?.keySkills.split(',').map((skill, index) => (
                                    <span key={index} className="jb_text1 bg-white border border-gray p-2 mr-2 rounded-pill text-dark">{skill.trim()}</span>
                                 ))}
                              </div> */}
                           </div>
                        </div>
                     </div>
                     <div className="col-lg-4">
                        <div className="row">
                           <div className="col-6">
                              <a href="" className="btn btn-block btn-light btn-md">
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
                     <div className="col-lg-8 text-dark">
                        <div className="mb-5">
                           <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                              <span className="icon-align-left mr-3" />
                              Job description
                           </h3>

                           {addIconsToListItems(jobData?.description)}

                        </div>
                        <div className="mb-5">
                           <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                              <span className="icon-align-left mr-3" />
                              Work schedule
                           </h3>
                           <ul className="list-unstyled m-0 p-0">
                              {addIconsToListItems(jobData?.workSchedule)}
                           </ul>
                        </div>
                        <div className="mb-5">
                           <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                              <span className="icon-rocket mr-3" />
                              Your responsibilities
                           </h3>
                           <ul className="list-unstyled m-0 p-0">
                              {addIconsToListItems(jobData?.responsibilities)}
                           </ul>

                        </div>
                        <div className="mb-5">
                           <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                              <span className="icon-book mr-3" />
                              Your skills and qualifications
                           </h3>
                           <ul className="list-unstyled m-0 p-0 ">
                              {addIconsToListItems(jobData?.qualification)}
                           </ul>
                           <ul className="list-unstyled m-0 p-0">
                              {addIconsToListItems(jobData?.requiredSkills)}
                           </ul>
                        </div>
                        <div className="mb-5">
                           <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                              <span className="icon-turned_in mr-3" />
                              Benefits for you
                           </h3>
                           <ul className="list-unstyled m-0 p-0 trf1">
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
                                 <span>{jobData?.slot} people</span>
                              </li>
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Salary</strong>
                                 <span>{jobData?.offeredSalary}</span>
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
                                    className="img-fluid border p-0 d-inline-block mr-3 rounded-sm bg-white"
                                    style={{ width: '8em', height: '8em', objectFit: 'contain' }}
                                 />
                                 <NavLink to={`/companyDetail/${jobData?.companyId}`} className="pt-3 pb-3 pr-3 pl-0" onClick={() => handleCompanyClick(jobData?.companyId)}>
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
                                    <span><i className={`fi fi-${companyData?.countryCode} border border-gray rounded-sm`} style={{ width: '1.4em', lineHeight: '1em' }}></i>&nbsp;&nbsp;{companyData?.country}</span>
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
            <section className="site-section jb_content0" id="next">
               <div className="container-fluid">
                  <div className="row mb-5 justify-content-center">
                     <div className="col-md-7 text-center">
                        <h2 className="section-title mb-2">More jobs for you</h2>
                     </div>
                  </div>
                  <ul className="job-listings mb-5">
                     {relatedJobs.map(job =>
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
                                             const categoryName = categoryArray.find(category => category.categoryId === id)?.categoryName;
                                             return categoryName ? (
                                                <span key={id} onClick={() => handleCategoryClick(id)} className="jb_text1 bg-white border border-gray p-2 mr-2 rounded-pill text-dark">
                                                   {categoryName}
                                                </span>
                                             ) : null;
                                          })}
                                       </div>
                                       {/* <div className='d-flex flex-wrap mt-2'>
                                          {job.keySkills.split(',').map((skill, index) => (
                                             <span key={index} className="bg-white border border-gray p-2 mr-2 rounded-pill text-dark">{skill.trim()}</span>
                                          ))}
                                       </div> */}
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
                     })}
                  </ul>

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
