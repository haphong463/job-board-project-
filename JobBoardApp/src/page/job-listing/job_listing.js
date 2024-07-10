import React, { useEffect, useState } from 'react';
import moment from 'moment';
import jobData from './job_data.json';
import companyData from './company_data.json';
import categoryData from '../../components/global-navbar/category.json';
import "./job_listing.css";
import { useLocation, useParams } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
import Select, { components } from 'react-select';
// import { Select } from 'antd';
import { MenuItem, Checkbox, ListItemText, FormControl, Select as MuiSelect } from '@mui/material';

export const JobList = () =>
{
   const { id } = useParams();
   const categoryId = parseInt(id ?? '0', 10);
   const location = useLocation();
   const jobsPerPage = 5; // Number of jobs per page

   const [jobs, setJobs] = useState([]);
   const [jobCount, setJobCount] = useState(0);
   const [selectedJobId, setSelectedJobId] = useState(null);
   const [categoryName1, setCategoryName] = useState("");
   const [currentPage, setCurrentPage] = useState(1);


   const [filters, setFilters] = useState({
      title: '',
      // offeredSalary: '',
      location: [],
      position: [],
      jobType: [],
      contractType: [],
      companyType: []
   });

   useEffect(() =>
   {
      const categoryInfo = categoryData.find(cat => cat.categoryId === categoryId);
      if (categoryInfo)
      {
         setCategoryName(categoryInfo.categoryName);
      } else
      {
         setCategoryName("");
      }

      let filteredJobs;

      if (location.pathname === "/viewAllJobs")
      {
         filteredJobs = jobData;
      } else
      {
         filteredJobs = jobData.filter(job => job.categoryId === categoryId);
      }

      filteredJobs = filteredJobs.filter(applyFilters); // Áp dụng các bộ lọc

      setJobCount(filteredJobs.length); // Cập nhật số lượng công việc phù hợp với các bộ lọc

      // Cập nhật jobs sau khi lọc
      setJobs(filteredJobs);
   }, [categoryId, location.pathname, filters, currentPage]);

   const handleJobClick = (jobId) =>
   {
      setSelectedJobId(jobId);
   };

   const handlePageChange = (pageNumber) =>
   {
      setCurrentPage(pageNumber);
   };

   // Calculate the jobs to display based on the current page
   const indexOfLastJob = currentPage * jobsPerPage;
   const indexOfFirstJob = indexOfLastJob - jobsPerPage;

   const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

   const handleCategoryClick = (jobId) =>
   {
      const jobDetailUrl = `/jobDetail/${jobId}`;
      window.open(jobDetailUrl, '_blank');
      // window.location.href = `/jobDetail/${jobId}`;
   };

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

   const locations = [
      { value: 'Ho Chi Minh city', label: 'Ho Chi Minh city' },
      { value: 'Hanoi', label: 'Hanoi' },
      { value: 'Da Nang', label: 'Da Nang' },
   ];

   const position = [
      { value: 'Intern', label: 'Intern' },
      { value: 'Fresher', label: 'Fresher' },
      { value: 'Junior', label: 'Junior' },
      { value: 'Middle', label: 'Middle' },
      { value: 'Senior', label: 'Senior' },
      { value: 'Leader', label: 'Leader' },
      { value: 'Manager', label: 'Manager' }
   ];

   const jobTypes = [
      { value: 'In Office', label: 'In Office' },
      { value: 'Hybrid', label: 'Hybrid' },
      { value: 'Remote', label: 'Remote' },
      { value: 'Oversea', label: 'Oversea' }
   ];

   const contractTypes = [
      { value: 'Fulltime', label: 'Fulltime' },
      { value: 'Freelance', label: 'Freelance' },
      { value: 'Part-time', label: 'Part-time' }
   ];

   const companyTypes = [
      { value: 'IT Outsourcing', label: 'IT Outsourcing' },
      { value: 'IT Product', label: 'IT Product' },
      { value: 'Headhunt', label: 'Headhunt' },
      { value: 'IT Service and IT Consulting', label: 'IT Service and IT Consulting' },
      { value: 'Non-IT', label: 'Non-IT' }
   ];

   const handleFilterChange1 = (selectedOption, { name }) =>
   {
      setFilters({ ...filters, [name]: selectedOption || [] });
   };

   // const handleFilterChange = (event) =>
   // {
   //    const { name, value } = event.target;
   //    if (name === 'position')
   //    {
   //       // Handle position changes separately for multiple values
   //       setFilters({ ...filters, [name]: value });
   //    } else
   //    {
   //       setFilters({ ...filters, [name]: value });
   //    }
   // };

   const applyFilters = (job) =>
   {
      const { title, offeredSalary, position, location, keySkills, jobType, contractType, companyType } = filters;

      const searchTextArray = title.toLowerCase().split(' ');
      // Tìm kiếm theo tiêu đề công việc và kỹ năng chính
      const titleMatch = searchTextArray.some(searchText => job.title.toLowerCase().includes(searchText));
      const keySkillsMatch = searchTextArray.some(searchText => job.keySkills.toLowerCase().includes(searchText));
      // Kiểm tra sự phù hợp với tiêu chí tìm kiếm
      const isSearchTextMatch = titleMatch || keySkillsMatch;

      const jobLocationParts = job.location.split(", ");
      const jobLocation = jobLocationParts[jobLocationParts.length - 1]?.trim().toLowerCase() || '';

      // Kiểm tra sự phù hợp với địa điểm
      const locationMatch = location.length === 0 || location.some(loc => jobLocation === loc.value.toLowerCase());

      const positionMatch = position.length === 0 || position.some(pos => job.position.toLowerCase().includes(pos.value.toLowerCase()));
      const jobTypeMatch = jobType.length === 0 || jobType.some(tyle => job.jobType?.toLowerCase().includes(tyle.value.toLowerCase()));
      const contractTypeMatch = contractType.length === 0 || contractType.some(tyle => job.contractType?.toLowerCase().includes(tyle.value.toLowerCase()));
      const company = companyData.find(company => company.companyId === job.companyId);
      const companyTypeMatch = companyType.length === 0 || companyType.some(type => company.type?.toLowerCase() === type.value.toLowerCase());

      return isSearchTextMatch && locationMatch && positionMatch && jobTypeMatch && contractTypeMatch && companyTypeMatch;
   };

   // const filteredJobs = jobs.filter(applyFilters);
   // Calculate total number of pages
   const totalPages = Math.ceil(jobs.length / jobsPerPage);

   const renderPaginationButtons = () =>
   {
      const pages = [];
      const maxVisiblePages = 10;

      if (totalPages <= maxVisiblePages)
      {
         for (let i = 1; i <= totalPages; i++)
         {
            pages.push(
               <div>
                  <button
                     key={i}
                     className={`pagination-button ${currentPage === i ? 'active' : ''}`}
                     onClick={() => handlePageChange(i)}
                  >
                     {i}
                  </button></div>
            );
         }
      } else
      {
         pages.push(
            <button
               key={1}
               className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
               onClick={() => handlePageChange(1)}
            >
               1
            </button>
         );

         if (currentPage > 3)
         {
            pages.push(<span key="left-ellipsis" className="pagination-ellipsis">...</span>);
         }

         const startPage = Math.max(2, currentPage - 1);
         const endPage = Math.min(totalPages - 1, currentPage + 1);

         for (let i = startPage; i <= endPage; i++)
         {
            pages.push(
               <button
                  key={i}
                  className={`pagination-button ${currentPage === i ? 'active' : ''}`}
                  onClick={() => handlePageChange(i)}
               >
                  {i}
               </button>
            );
         }

         if (currentPage < totalPages - 2)
         {
            pages.push(<span key="right-ellipsis" className="pagination-ellipsis">...</span>);
         }

         pages.push(
            <button
               key={totalPages}
               className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
               onClick={() => handlePageChange(totalPages)}
            >
               {totalPages}
            </button>
         );
      }
      return pages;
   };

   const handlePositionChange = (event) =>
   {
      const {
         target: { value }
      } = event;

      setFilters({
         ...filters,
         position: typeof value === 'string' ? value.split(',') : value
      });
   };

   const handlePositionItemClick = (level) =>
   {
      const newSelection = filters.position.some((item) => item.value === level.value)
         ? filters.position.filter((item) => item.value !== level.value)
         : [...filters.position, level];
      setFilters({ ...filters, position: newSelection });
   };

   const handleLocationItemClick = (level) =>
   {
      const newSelection = filters.location.some((item) => item.value === level.value)
         ? filters.location.filter((item) => item.value !== level.value)
         : [...filters.location, level];
      setFilters({ ...filters, location: newSelection });
   };

   const handleJobTypeItemClick = (level) =>
   {
      const newSelection = filters.jobType.some((item) => item.value === level.value)
         ? filters.jobType.filter((item) => item.value !== level.value)
         : [...filters.jobType, level];
      setFilters({ ...filters, jobType: newSelection });
   };

   const handleContractTypeItemClick = (level) =>
   {
      const newSelection = filters.contractType.some((item) => item.value === level.value)
         ? filters.contractType.filter((item) => item.value !== level.value)
         : [...filters.contractType, level];
      setFilters({ ...filters, contractType: newSelection });
   };

   const handleCompanyTypeItemClick = (type) =>
   {
      const newSelection = filters.companyType.some((item) => item.value === type.value)
         ? filters.companyType.filter((item) => item.value !== type.value)
         : [...filters.companyType, type];
      setFilters({ ...filters, companyType: newSelection });
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
                        <h1 className="text-white font-weight-bold">Job By Skill</h1>
                     </div>
                  </div>
               </div>
            </section>

            <div className="job-listing">

               <div className="job-filters">
                  <div className="filter-group">
                     <label>Search</label>
                     <input
                        type="text"
                        name="title"
                        placeholder="Job Title"
                        value={filters.title}
                        onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                     />
                  </div>

                  <div className="filter-group">
                     <FormControl>
                        <MuiSelect
                           name="location"
                           multiple
                           value={filters.location.map(loc => loc.value)}
                           onChange={(event) =>
                           {
                              const selectedValues = event.target.value;
                              const selectedItems = locations.filter(loc => selectedValues.includes(loc.value));
                              setFilters({ ...filters, location: selectedItems });
                           }}
                           renderValue={() => (
                              <span className="selected-level">Location</span>
                           )}
                           displayEmpty
                        >
                           {locations.map(level => (
                              <MenuItem key={level.value} value={level.value} onClick={() => handleLocationItemClick(level)}>
                                 <Checkbox
                                    checked={filters.location.some(item => item.value === level.value)}
                                 />
                                 <ListItemText primary={level.label} />
                              </MenuItem>
                           ))}
                        </MuiSelect>
                     </FormControl>
                  </div>

                  <div className="filter-group">
                     <FormControl>
                        <MuiSelect
                           name="position"
                           multiple
                           value={filters.position.map(pos => pos.value)}
                           onChange={(event) =>
                           {
                              const selectedValues = event.target.value;
                              const selectedItems = position.filter(pos => selectedValues.includes(pos.value));
                              setFilters({ ...filters, position: selectedItems });
                           }}
                           renderValue={() => (
                              <span className="selected-level">Levels</span>
                           )}
                           displayEmpty
                        >
                           {position.map(level => (
                              <MenuItem key={level.value} value={level.value} onClick={() => handlePositionItemClick(level)}>
                                 <Checkbox
                                    checked={filters.position.some(item => item.value === level.value)}
                                 />
                                 <ListItemText primary={level.label} />
                              </MenuItem>
                           ))}
                        </MuiSelect>
                     </FormControl>
                  </div>
                  <div className="filter-group">
                     <FormControl>
                        <MuiSelect
                           name="jobType"
                           multiple
                           value={filters.jobType.map(loc => loc.value)}
                           onChange={(event) =>
                           {
                              const selectedValues = event.target.value;
                              const selectedItems = jobTypes.filter(loc => selectedValues.includes(loc.value));
                              setFilters({ ...filters, jobType: selectedItems });
                           }}
                           renderValue={() => (
                              <span className="selected-level">Job types</span>
                           )}
                           displayEmpty
                        >
                           {jobTypes.map(level => (
                              <MenuItem key={level.value} value={level.value} onClick={() => handleJobTypeItemClick(level)}>
                                 <Checkbox
                                    checked={filters.jobType.some(item => item.value === level.value)}
                                 />
                                 <ListItemText primary={level.label} />
                              </MenuItem>
                           ))}
                        </MuiSelect>
                     </FormControl>
                  </div>
                  <div className="filter-group">
                     <FormControl>
                        <MuiSelect
                           name="contractType"
                           multiple
                           value={filters.contractType.map(loc => loc.value)}
                           onChange={(event) =>
                           {
                              const selectedValues = event.target.value;
                              const selectedItems = contractTypes.filter(loc => selectedValues.includes(loc.value));
                              setFilters({ ...filters, contractType: selectedItems });
                           }}
                           renderValue={() => (
                              <span className="selected-level">Contract types</span>
                           )}
                           displayEmpty
                        >
                           {contractTypes.map(level => (
                              <MenuItem key={level.value} value={level.value} onClick={() => handleContractTypeItemClick(level)}>
                                 <Checkbox
                                    checked={filters.contractType.some(item => item.value === level.value)}
                                 />
                                 <ListItemText primary={level.label} />
                              </MenuItem>
                           ))}
                        </MuiSelect>
                     </FormControl>
                  </div>
                  <div className="filter-group">
                     <FormControl>
                        <MuiSelect
                           name="companyType"
                           multiple
                           value={filters.companyType.map(type => type.value)}
                           onChange={(event) =>
                           {
                              const selectedValues = event.target.value;
                              const selectedItems = companyTypes.filter(type => selectedValues.includes(type.value));
                              setFilters({ ...filters, companyType: selectedItems });
                           }}
                           renderValue={() => (
                              <span className="selected-level">Company Types</span>
                           )}
                           displayEmpty
                        >
                           {companyTypes.map(type => (
                              <MenuItem key={type.value} value={type.value} onClick={() => handleCompanyTypeItemClick(type)}>
                                 <Checkbox
                                    checked={filters.companyType.some(item => item.value === type.value)}
                                 />
                                 <ListItemText primary={type.label} />
                              </MenuItem>
                           ))}
                        </MuiSelect>
                     </FormControl>
                  </div>
               </div>

               <h3 className="number-job">{jobCount}{" "}
                  {location.pathname === "/viewAllJobs" ? (
                     "IT"
                  ) : (
                     <span className="category-name">{categoryName1}</span>
                  )}{" "}
                  jobs in Vietnam</h3>

               {currentJobs.map(job =>
               {
                  const company = companyData.find(company => company.companyId === job.companyId);
                  const address = getLocation1String(job.location);
                  let timeAgo = job.createdAt ? formatJobPostedTime(job.createdAt) : '';

                  if (company)
                  {
                     return (
                        <div key={job.id} className={`single-job-item ${selectedJobId === job.id ? 'selected' : ''}`}
                           onClick={() => handleJobClick(job.id)}>
                           <div className="job-info">
                              <p className="time-post">{timeAgo}</p>
                              <a className="jobName" onClick={() => handleCategoryClick(job.id)}>{job.title}</a>
                              <div className="company-details">
                                 <a href={company.websiteLink} target="_blank" rel="noopener noreferrer" className="company-link">
                                    <div className="company-img">
                                       <img src={company.logo} />
                                    </div>
                                 </a>
                                 <a href={company.websiteLink} className="company-name">{company.companyName}</a>
                              </div>
                              <p className="company-position">{job.position}</p>
                              <p className="job-location">
                                 <FaMapMarkerAlt className="icon-location" /> {address}
                              </p>
                              <div className="job-skills">
                                 {job.keySkills.split(',').map((skill, index) => (
                                    <span key={index} className="skill-badge">{skill.trim()}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     );
                  }
                  return null;
               })}
            </div>
            <div className="pagination">
               {renderPaginationButtons()}
            </div>

         </>
      </GlobalLayoutUser >
   );
}
