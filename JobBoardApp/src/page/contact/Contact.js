import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { postContactThunk } from "../../features/contactsSlice"; // Adjust the path as necessary
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import './contact.css';
export const Contact = () => {
  const dispatch = useDispatch();
  const contactState = useSelector((state) => state.contacts);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    subject: Yup.string().required("Subject is required"),
    message: Yup.string().required("Message is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    await dispatch(postContactThunk(values));
    setSubmitting(false);
    resetForm();
  };

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
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="contact-form">
                      <div className="row form-group">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <label className="text-black" htmlFor="firstName">
                            First Name
                          </label>
                          <Field
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="text-black" htmlFor="lastName">
                            Last Name
                          </label>
                          <Field
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="error-message"
                          />
                        </div>
                      </div>
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label className="text-black" htmlFor="email">
                            Email
                          </label>
                          <Field
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="error-message"
                          />
                        </div>
                      </div>
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label className="text-black" htmlFor="subject">
                            Subject
                          </label>
                          <Field
                            type="text"
                            id="subject"
                            name="subject"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="subject"
                            component="div"
                            className="error-message"
                          />
                        </div>
                      </div>
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label className="text-black" htmlFor="message">
                            Message
                          </label>
                          <Field
                            as="textarea"
                            name="message"
                            id="message"
                            cols={30}
                            rows={7}
                            className="form-control"
                            placeholder="Write your notes or questions here..."
                          />
                          <ErrorMessage
                            name="message"
                            component="div"
                            className="error-message"
                          />
                        </div>
                      </div>
                      <div className="row form-group">
                        <div className="col-md-12">
                          <button
                            type="submit"
                            className="btn btn-primary btn-md text-white"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Sending..." : "Send Message"}
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
                {contactState.state === "Loading..." && <p>Loading...</p>}
                {contactState.state === "Post ok!" && <p>Contact created successfully!</p>}
                {contactState.state === "Rejected!" && <p>Error: {contactState.error}</p>}
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
  <a href="mailto:jobboardfpt@gmail.com">jobboardfpt@gmail.com</a>
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
