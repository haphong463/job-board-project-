import React, { useEffect, useState } from 'react';
import { differenceInDays, differenceInHours, differenceInWeeks, differenceInMonths, differenceInMinutes, differenceInSeconds } from 'date-fns';
// import jobData from './job_data.json';
// import companyData from './company_data.json';
import categoryData from '../../components/global-navbar/category.json';
import "./job_listing.css";
import { useLocation, useParams } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';

export const JobList = () =>
{
    const { id } = useParams();
    const categoryId = parseInt(id ?? '0', 10);
    const location = useLocation();
    const jobsPerPage = 2; // Number of jobs per page

    const [jobs, setJobs] = useState([]);
    const [jobCount, setJobCount] = useState(0);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [categoryName1, setCategoryName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

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

        if (location.pathname === "/viewAllJobs")
        {
            setJobs(jobData);
            setJobCount(jobData.length);
        } else
        {
            const filteredJobs = jobData.filter(job => job.categoryId === categoryId);
            setJobs(filteredJobs);
            setJobCount(filteredJobs.length);
        }
    }, [categoryId, location.pathname]);

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

    // Calculate total number of pages
    const totalPages = Math.ceil(jobs.length / jobsPerPage);

    const renderPaginationButtons = () =>
    {
        const pages = [];
        const maxVisiblePages = 7;

        if (totalPages <= maxVisiblePages)
        {
            for (let i = 1; i <= totalPages; i++)
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

    const handleCategoryClick = (jobId) =>
    {
        window.location.href = `/jobDetail/${jobId}`;
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
        const now = new Date();
        const createdAt = new Date(date);

        const monthsAgo = differenceInMonths(now, createdAt);
        const weeksAgo = differenceInWeeks(now, createdAt);
        const daysAgo = differenceInDays(now, createdAt);
        const hoursAgo = differenceInHours(now, createdAt);
        const minutesAgo = differenceInMinutes(now, createdAt);
        const secondsAgo = differenceInSeconds(now, createdAt);

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
        </GlobalLayoutUser>
    );
};

