import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import moment from 'moment';
import './company_detail.css';
import { NavLink, useParams } from 'react-router-dom';
import jobData1 from './job_data.json';
import companyData1 from './company_data.json';
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import 'flag-icons/css/flag-icons.min.css';

export const CompanyDetail = () =>
{
    const { id } = useParams();
    const companyId = parseInt(id ?? '0', 10);

    const jobData = jobData1.find(job => job.id);
    const companyData = companyData1.find(company => company.companyId === companyId);

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
                {/* <div className=""> */}

                <div className="job-detail-container pt-120 pb-120">
                    <div className="container">

                        <div className="row justify-content-between">
                            {/* Left Content */}
                            <div className="col-xl-7 col-lg-8">
                                <div className="company-title mb-50">
                                    <div className="company-detail2">
                                        {/* <a href={companyData?.websiteLink} target="_blank" rel="noopener noreferrer" className="company-link2"> */}
                                        <img className="company-img2" src={companyData?.logo} />
                                        {/* </a> */}
                                        <p className="company-name2">{companyData?.companyName}</p>
                                    </div>
                                </div>
                                {/* Job Details */}
                                {/* <div className="job-post-details"> */}
                                <div className="post-details mb-50">

                                    <div className='list-item' dangerouslySetInnerHTML={{ __html: companyData?.description }} />
                                </div>
                                {/* </div> */}
                            </div>
                            {/* Right Content */}
                            <div className="overview-content col-xl-4 col-lg-4">
                                <div className="company-info mb-51">
                                    <div className="section-title">
                                        <h4>General information</h4>
                                    </div>
                                    <ul>
                                        <li>Company type<span>{companyData?.type}</span></li>
                                        <li>Company size<span>{companyData?.companySize}</span></li>
                                        <li>Country<span className='icon1'><i className={`fi fi-${companyData?.countryCode}`}></i>{companyData?.country}</span></li>
                                        <li>Working days<span>{companyData?.workingDays}</span></li>
                                    </ul>
                                    <div className="job-skill">
                                        Tech stack
                                        <p className="label-skill1">
                                            {companyData?.keySkills.split(',').map((skill, index) => (
                                                <span key={index} className="skill-badges">{skill.trim()}</span>
                                            ))}</p>
                                    </div>
                                </div>
                                <div className="job-overview mb-50">
                                    <div className="section-title">
                                        <h4>Contact information</h4>
                                    </div>
                                    <ul>
                                        <li>Website<a href={companyData?.websiteLink} className="company-link" target="_blank" rel="noopener noreferrer">{companyData?.websiteLink}</a></li>
                                        <li>Office address<span><FaMapMarkerAlt className="icon-location" />{companyData?.location}</span></li>
                                    </ul>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                {/* </div> */}
            </>
        </GlobalLayoutUser>
    );
}
