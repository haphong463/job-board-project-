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

                <div className="cp-job-detail-container pt-120 pb-120">
                    <div className="container">
                        <div className="row justify-content-between">
                            {/* Left Content */}
                            <div className="col-xl-7 col-lg-8">
                                <div className="cp-job-detail__company-title mb-50">
                                    <div className="cp-job-detail__company-detail">
                                        {/* <a href={companyData?.websiteLink} target="_blank" rel="noopener noreferrer" className="cp-job-detail__company-link"> */}
                                        <img className="cp-job-detail__company-img" src={companyData?.logo} />
                                        {/* </a> */}
                                        <strong className="cp-job-detail__company-name">{companyData?.companyName}</strong>
                                    </div>
                                </div>
                                {/* Job Details */}
                                <div className='cp-job-detail__list-item' dangerouslySetInnerHTML={{ __html: companyData?.description }} />
                            </div>
                            {/* Right Content */}
                            <div className="cp-job-detail__overview-content col-xl-4 col-lg-4">
                                <div className="cp-job-detail__company-info mb-51">
                                    <div className="cp-job-detail__section-title">
                                        <h4>General information</h4>
                                    </div>
                                    <ul>
                                        <li>Company type<span>{companyData?.type}</span></li>
                                        <li>Company size<span>{companyData?.companySize}</span></li>
                                        <li>Country<span className='cp-job-detail__icon'><i className={`fi fi-${companyData?.countryCode}`}></i>{companyData?.country}</span></li>
                                        <li>Working days<span>{companyData?.workingDays}</span></li>
                                    </ul>
                                    <div className="cp-job-detail__job-skill">
                                        Tech stack
                                        <p className="cp-job-detail__label-skill">
                                            {companyData?.keySkills.split(',').map((skill, index) => (
                                                <span key={index} className="cp-job-detail__skill-badge">{skill.trim()}</span>
                                            ))}
                                        </p>
                                    </div>
                                </div>
                                <div className="cp-job-detail__job-overview mb-50">
                                    <div className="cp-job-detail__section-title">
                                        <h4>Contact information</h4>
                                    </div>
                                    <ul>
                                        <li>Website<a href={companyData?.websiteLink} className="cp-job-detail__company-link" target="_blank" rel="noopener noreferrer">{companyData?.websiteLink}</a></li>
                                        <li>Office address<span><FaMapMarkerAlt className="cp-job-detail__icon-location" />{companyData?.location}</span></li>
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
