import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import jobData1 from './job_data.json';
import companyData1 from './company_data.json';
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import 'flag-icons/css/flag-icons.min.css';

export const JobDetail = () =>
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

                <div className="jb-job-detail-container pt-120 pb-120">
                    <div className="container">
                        <div className="row justify-content-between">
                            {/* Left Content */}
                            <div className="col-xl-7 col-lg-8">
                                <div className="jb-job-detail-container__title mb-50">
                                    <h2>{jobData?.title}</h2>
                                    <ul className="jb-job-detail-container__info list-info1">
                                        <li> <FaMapMarkerAlt className="jb-icon-location" /> {jobData?.location}</li>
                                        <li><MonetizationOnIcon className="jb-icon-salary" />{jobData?.offeredSalary}</li>
                                        <li><FaClock className="jb-icon-time" />Deadline for submission: {jobData?.expire}</li>
                                    </ul>
                                    <div className="jb-job-detail-container__skills jb-job-skill">
                                        Skills:
                                        <p className="jb-job-skill__label label-skill">
                                            {jobData?.keySkills.split(',').map((skill, index) => (
                                                <span key={index} className="jb-job-skill__badge skill-badges">{skill.trim()}</span>
                                            ))}
                                        </p>
                                    </div>
                                </div>
                                {/* Job Details */}
                                <div className="jb-job-detail-container__post-details jb-post-details-section mb-50">
                                    <h4 className="jb-post-details-section__title jb-job-detail">Job description</h4>
                                    <div className='jb-post-details-section__item list-item' dangerouslySetInnerHTML={{ __html: jobData?.description }} />
                                    <h5 className="jb-post-details-section__highlighted-text highlighted-text">Working hours:</h5>
                                    <div className='jb-post-details-section__item list-item' dangerouslySetInnerHTML={{ __html: jobData?.workSchedule }} />

                                    <hr></hr>
                                    <h4 className="jb-post-details-section__title jb-job-detail">Your role & responsibilities</h4>
                                    <div className='jb-post-details-section__item list-item' dangerouslySetInnerHTML={{ __html: jobData?.responsibilities }} />
                                    <hr></hr>
                                    <h4 className="jb-post-details-section__title jb-job-detail">Your skills & qualifications</h4>
                                    <h5 className="jb-post-details-section__highlighted-text highlighted-text">1. Educational Background</h5>
                                    <div className='jb-post-details-section__item list-item' dangerouslySetInnerHTML={{ __html: jobData?.qualification }} />
                                    <h5 className="jb-post-details-section__highlighted-text highlighted-text">2. Skills</h5>
                                    <div className='jb-post-details-section__item list-item' dangerouslySetInnerHTML={{ __html: jobData?.requiredSkills }} />
                                    <hr></hr>
                                    <h4 className="jb-post-details-section__title jb-job-detail">Benefits for you</h4>
                                    <div className='jb-post-details-section__item list-item' dangerouslySetInnerHTML={{ __html: jobData?.benefit }} />
                                </div>
                            </div>
                            {/* Right Content */}
                            <div className="jb-overview-content col-xl-4 col-lg-4">
                                <div className="jb-overview-content__overview jb-job-overview mb-50">
                                    <div className="jb-overview-content__title section-title">
                                        <h4>Job Overview</h4>
                                    </div>
                                    <ul>
                                        <li>Experience<span>{jobData?.experience}</span></li>
                                        <li>Level<span>{jobData?.position}</span></li>
                                        <li>Job type<span>{jobData?.jobType}</span></li>
                                        <li>Contract type<span>{jobData?.contractType}</span></li>
                                        <li>Number of recruits<span>{jobData?.numberOfRecruits} people</span></li>
                                        <li>Gender<span>{jobData?.gender}</span></li>
                                    </ul>
                                    <div className="jb-overview-content__apply-btn apply-btn">
                                        <a href="#" className="jb-apply-btn__btn btn">Apply Now</a>
                                    </div>
                                </div>
                                <div className="jb-overview-content__company-info jb-company-info mb-51">
                                    <div className="jb-company-info__title section-title">
                                        <h4>Company Information</h4>
                                    </div>
                                    <div className="jb-company-info__detail company-detail1">
                                        <a href={companyData?.websiteLink} target="_blank" rel="noopener noreferrer" className="jb-company-detail1__link company-link1">
                                            <img className="jb-company-detail1__image company-img1" src={companyData?.logo} onClick={() => handleCompanyClick(jobData?.companyId)} />
                                        </a>
                                        <p className="jb-company-detail1__name company-name1">{companyData?.companyName}</p>
                                    </div>
                                    <ul className="jb-company-info__list">
                                        <li>Company type<span>{companyData?.type}</span></li>
                                        <li>Company size<span>{companyData?.companySize}</span></li>
                                        <li>Country<span className='jb-company-info__country icon1'><i className={`fi fi-${companyData?.countryCode}`}></i>{companyData?.country}</span></li>
                                        <li>Working days<span>{companyData?.workingDays}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        </GlobalLayoutUser>
    );
}
