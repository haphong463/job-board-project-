import React, { useEffect } from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { NavLink } from "react-router-dom";
import { JobFilter } from "../../components/job-filter/JobFIlter";

export const JobListing = () => {
  useEffect(() => {
    // Ensure selectpicker is initialized
    $(".selectpicker").selectpicker("refresh");
    const searchParams = new URLSearchParams(location.search);
    const message = searchParams.get("message");
    if (message) {
      setMessage(message);
      setTimeout(() => {
        setMessage("");
        // Remove the message parameter from the URL
        navigate(location.pathname, { replace: true });
        // Reload the page
        window.location.reload();
      }, 2000); // Adjust the time (5000 ms = 5 seconds) as needed
    }
  }, []);
  return (
    <GlobalLayoutUser>
      <section
        className="section-hero home-section overlay inner-page bg-image"
        style={{
          backgroundImage: " url('../../../../assets/images/hero_1.jpg')",
        }}
        id="home-section"
      >
        <JobFilter />
        <a href="#next" className="scroll-button smoothscroll">
          <span className="icon-keyboard_arrow_down"></span>
        </a>
      </section>

      <section className="site-section" id="next">
        <div className="container">
          <div className="row mb-5 justify-content-center">
            <div className="col-md-7 text-center">
              <h2 className="section-title mb-2">43,167 Job Listed</h2>
            </div>
          </div>

          <ul className="job-listings mb-5">
            <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
              <a href="job-single.html"></a>
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
                  <span className="icon-room"></span> New York, New York
                </div>
                <div className="job-listing-meta">
                  <span className="badge badge-danger">Part Time</span>
                </div>
              </div>
            </li>
            <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
              <a href="job-single.html"></a>
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
                  <span className="icon-room"></span> Overland Park, Kansas
                </div>
                <div className="job-listing-meta">
                  <span className="badge badge-success">Full Time</span>
                </div>
              </div>
            </li>

            <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
              <a href="job-single.html"></a>
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
                  <span className="icon-room"></span> Overland Park, Kansas
                </div>
                <div className="job-listing-meta">
                  <span className="badge badge-success">Full Time</span>
                </div>
              </div>
            </li>

            <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
              <a href="job-single.html"></a>
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
                  <span className="icon-room"></span> Anywhere
                </div>
                <div className="job-listing-meta">
                  <span className="badge badge-success">Full Time</span>
                </div>
              </div>
            </li>

            <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
              <a href="job-single.html"></a>
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
                  <span className="icon-room"></span> San Mateo, CA
                </div>
                <div className="job-listing-meta">
                  <span className="badge badge-success">Full Time</span>
                </div>
              </div>
            </li>
            <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
              <a href="job-single.html"></a>
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
                  <span className="icon-room"></span> New York, New York
                </div>
                <div className="job-listing-meta">
                  <span className="badge badge-danger">Part Time</span>
                </div>
              </div>
            </li>
            <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
              <a href="job-single.html"></a>
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
                  <span className="icon-room"></span> Overland Park, Kansas
                </div>
                <div className="job-listing-meta">
                  <span className="badge badge-success">Full Time</span>
                </div>
              </div>
            </li>
          </ul>

          <div className="row pagination-wrap">
            <div className="col-md-6 text-center text-md-left mb-4 mb-md-0">
              <span>Showing 1-7 Of 43,167 Jobs</span>
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

      <section
        className="py-5 bg-image overlay-primary fixed overlay"
        style={{
          backgroundImage: "url('../../../../assets/images/hero_1.jpg')",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="text-white">Looking For A Job?</h2>
              <p className="mb-0 text-white lead">
                Lorem ipsum dolor sit amet consectetur adipisicing elit tempora
                adipisci impedit.
              </p>
            </div>
            <div className="col-md-3 ml-auto">
              <NavLink
                to="/signup"
                className="btn btn-warning btn-block btn-lg"
              >
                Sign Up
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </GlobalLayoutUser>
  );
};

export default JobListing;
