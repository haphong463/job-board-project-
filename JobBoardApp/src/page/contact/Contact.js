import React from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";

export const Contact = () => {
  return (
    <GlobalLayoutUser>
      <>
        <section
          className="section-hero overlay inner-page bg-image"
          style={{
            backgroundImage: 'url("../../../assets/images/hero_1.jpg")',
          }}
          id="home-section"
        >
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">Contact Us</h1>
                <div className="custom-breadcrumbs">
                  <a href="#">Home</a> <span className="mx-2 slash">/</span>
                  <span className="text-white">
                    <strong>Contact Us</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="site-section" id="next-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <form action="#" className="">
                  <div className="row form-group">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="text-black" htmlFor="fname">
                        First Name
                      </label>
                      <input type="text" id="fname" className="form-control" />
                    </div>
                    <div className="col-md-6">
                      <label className="text-black" htmlFor="lname">
                        Last Name
                      </label>
                      <input type="text" id="lname" className="form-control" />
                    </div>
                  </div>
                  <div className="row form-group">
                    <div className="col-md-12">
                      <label className="text-black" htmlFor="email">
                        Email
                      </label>
                      <input type="email" id="email" className="form-control" />
                    </div>
                  </div>
                  <div className="row form-group">
                    <div className="col-md-12">
                      <label className="text-black" htmlFor="subject">
                        Subject
                      </label>
                      <input
                        type="subject"
                        id="subject"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="row form-group">
                    <div className="col-md-12">
                      <label className="text-black" htmlFor="message">
                        Message
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        cols={30}
                        rows={7}
                        className="form-control"
                        placeholder="Write your notes or questions here..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="row form-group">
                    <div className="col-md-12">
                      <input
                        type="submit"
                        defaultValue="Send Message"
                        className="btn btn-primary btn-md text-white"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-lg-5 ml-auto">
                <div className="p-4 mb-3 bg-white">
                  <p className="mb-0 font-weight-bold">Address</p>
                  <p className="mb-4">
                    203 Fake St. Mountain View, San Francisco, California, USA
                  </p>
                  <p className="mb-0 font-weight-bold">Phone</p>
                  <p className="mb-4">
                    <a href="#">+1 232 3235 324</a>
                  </p>
                  <p className="mb-0 font-weight-bold">Email Address</p>
                  <p className="mb-0">
                    <a href="#">youremail@domain.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="site-section bg-light">
          <div className="container">
            <div className="row mb-5">
              <div className="col-12 text-center" data-aos="fade">
                <h2 className="section-title mb-3">Happy Candidates Says</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="block__87154 bg-white rounded">
                  <blockquote>
                    <p>
                      “Ipsum harum assumenda in eum vel eveniet numquam cumque
                      vero vitae enim cupiditate deserunt eligendi officia modi
                      consectetur. Expedita tempora quos nobis earum hic ex
                      asperiores quisquam optio nostrum sit”
                    </p>
                  </blockquote>
                  <div className="block__91147 d-flex align-items-center">
                    <figure className="mr-4">
                      <img
                        src="../../../assets/images/person_1.jpg"
                        alt="Image"
                        className="img-fluid"
                      />
                    </figure>
                    <div>
                      <h3>Elisabeth Smith</h3>
                      <span className="position">Creative Director</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="block__87154 bg-white rounded">
                  <blockquote>
                    <p>
                      “Ipsum harum assumenda in eum vel eveniet numquam, cumque
                      vero vitae enim cupiditate deserunt eligendi officia modi
                      consectetur. Expedita tempora quos nobis earum hic ex
                      asperiores quisquam optio nostrum sit”
                    </p>
                  </blockquote>
                  <div className="block__91147 d-flex align-items-center">
                    <figure className="mr-4">
                      <img
                        src="../../../assets/images/person_2.jpg"
                        alt="Image"
                        className="img-fluid"
                      />
                    </figure>
                    <div>
                      <h3>Chris Peter</h3>
                      <span className="position">Web Designer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </GlobalLayoutUser>
  );
};

export default Contact;
