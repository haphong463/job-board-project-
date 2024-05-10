import React from "react";
import { GlobalLayoutUser } from "../../../components/clients/global-layout-user/GlobalLayoutUser";

export const Blog = () => {
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
                <h1 className="text-white font-weight-bold">Our Blog</h1>
                <div className="custom-breadcrumbs">
                  <a href="#">Home</a> <span className="mx-2 slash">/</span>
                  <span className="text-white">
                    <strong>About Us</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="site-section">
          <div className="container">
            <div className="row mb-5">
              <div className="col-md-6 col-lg-4 mb-5">
                <a href="blog-single.html">
                  <img
                    src="../../../../assets/images/sq_img_1.jpg"
                    alt="Image"
                    className="img-fluid rounded mb-4"
                  />
                </a>
                <h3>
                  <a href="blog-single.html" className="text-black">
                    7 Factors for Choosing Between Two Jobs
                  </a>
                </h3>
                <div>
                  April 15, 2019 <span className="mx-2">|</span>{" "}
                  <a href="#">2 Comments</a>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 mb-5">
                <a href="blog-single.html">
                  <img
                    src="../../../../assets/images/sq_img_2.jpg"
                    alt="Image"
                    className="img-fluid rounded mb-4"
                  />
                </a>
                <h3>
                  <a href="blog-single.html" className="text-black">
                    How to Write a Creative Cover Letter
                  </a>
                </h3>
                <div>
                  April 15, 2019 <span className="mx-2">|</span>{" "}
                  <a href="#">2 Comments</a>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 mb-5">
                <a href="blog-single.html">
                  <img
                    src="../../../../assets/images/sq_img_4.jpg"
                    alt="Image"
                    className="img-fluid rounded mb-4"
                  />
                </a>
                <h3>
                  <a href="blog-single.html" className="text-black">
                    The Right Way to Quit a Job You Started
                  </a>
                </h3>
                <div>
                  April 15, 2019 <span className="mx-2">|</span>{" "}
                  <a href="#">2 Comments</a>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 mb-5">
                <a href="blog-single.html">
                  <img
                    src="../../../../assets/images/sq_img_7.jpg"
                    alt="Image"
                    className="img-fluid rounded mb-4"
                  />
                </a>
                <h3>
                  <a href="blog-single.html" className="text-black">
                    7 Factors for Choosing Between Two Jobs
                  </a>
                </h3>
                <div>
                  April 15, 2019 <span className="mx-2">|</span>{" "}
                  <a href="#">2 Comments</a>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 mb-5">
                <a href="blog-single.html">
                  <img
                    src="../../../../assets/images/sq_img_5.jpg"
                    alt="Image"
                    className="img-fluid rounded mb-4"
                  />
                </a>
                <h3>
                  <a href="blog-single.html" className="text-black">
                    How to Write a Creative Cover Letter
                  </a>
                </h3>
                <div>
                  April 15, 2019 <span className="mx-2">|</span>{" "}
                  <a href="#">2 Comments</a>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 mb-5">
                <a href="blog-single.html">
                  <img
                    src="../../../../assets/images/sq_img_6.jpg"
                    alt="Image"
                    className="img-fluid rounded mb-4"
                  />
                </a>
                <h3>
                  <a href="blog-single.html" className="text-black">
                    The Right Way to Quit a Job You Started
                  </a>
                </h3>
                <div>
                  April 15, 2019 <span className="mx-2">|</span>{" "}
                  <a href="#">2 Comments</a>
                </div>
              </div>
            </div>
            <div className="row pagination-wrap mt-5">
              <div className="col-md-12 text-center ">
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
      </>
    </GlobalLayoutUser>
  );
};
