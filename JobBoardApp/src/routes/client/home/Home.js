import React from "react";
import { GlobalNavbar } from "../../../components/clients/global-navbar/GlobalNavbar";
import { GlobalLayoutUser } from "../../../components/clients/global-layout-user/GlobalLayoutUser";
export const Home = () => {
  return (
    <GlobalLayoutUser>
      <section
        className="home-section section-hero overlay bg-image"
        style={{ backgroundImage: 'url("assets/images/hero_1.jpg")' }}
        id="home-section"
      >
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-12">
              <div className="mb-5 text-center">
                <h1 className="text-white font-weight-bold">
                  The Easiest Way To Get Your Dream Job
                </h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Cupiditate est, consequuntur perferendis.
                </p>
              </div>
              <form method="post" className="search-jobs-form">
                <div className="row mb-5">
                  <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Job title, Company..."
                    />
                  </div>
                  <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                    <select
                      className="selectpicker"
                      data-style="btn-white btn-lg"
                      data-width="100%"
                      data-live-search="true"
                      title="Select Region"
                    >
                      <option>Anywhere</option>
                      <option>San Francisco</option>
                      <option>Palo Alto</option>
                      <option>New York</option>
                      <option>Manhattan</option>
                      <option>Ontario</option>
                      <option>Toronto</option>
                      <option>Kansas</option>
                      <option>Mountain View</option>
                    </select>
                  </div>
                  <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                    <select
                      className="selectpicker"
                      data-style="btn-white btn-lg"
                      data-width="100%"
                      data-live-search="true"
                      title="Select Job Type"
                    >
                      <option>Part Time</option>
                      <option>Full Time</option>
                    </select>
                  </div>
                  <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg btn-block text-white btn-search"
                    >
                      <span className="icon-search icon mr-2" />
                      Search Job
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 popular-keywords">
                    <h3>Trending Keywords:</h3>
                    <ul className="keywords list-unstyled m-0 p-0">
                      <li>
                        <a href="#" className="">
                          UI Designer
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Python
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Developer
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <a href="#next" className="scroll-button smoothscroll">
          <span className=" icon-keyboard_arrow_down" />
        </a>
      </section>
      <section
        className="py-5 bg-image overlay-primary fixed overlay"
        id="next"
        style={{ backgroundImage: 'url("assets/images/hero_1.jpg")' }}
      >
        <div className="container">
          <div className="row mb-5 justify-content-center">
            <div className="col-md-7 text-center">
              <h2 className="section-title mb-2 text-white">
                JobBoard Site Stats
              </h2>
              <p className="lead text-white">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Expedita unde officiis recusandae sequi excepturi corrupti.
              </p>
            </div>
          </div>
          <div className="row pb-0 block__19738 section-counter">
            <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <strong className="number" data-number={1930}>
                  0
                </strong>
              </div>
              <span className="caption">Candidates</span>
            </div>
            <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <strong className="number" data-number={54}>
                  0
                </strong>
              </div>
              <span className="caption">Jobs Posted</span>
            </div>
            <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <strong className="number" data-number={120}>
                  0
                </strong>
              </div>
              <span className="caption">Jobs Filled</span>
            </div>
            <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <strong className="number" data-number={550}>
                  0
                </strong>
              </div>
              <span className="caption">Companies</span>
            </div>
          </div>
        </div>
      </section>
    </GlobalLayoutUser>
  );
};
