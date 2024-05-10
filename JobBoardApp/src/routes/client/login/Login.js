import React from "react";
import { GlobalLayoutUser } from "../../../components/clients/global-layout-user/GlobalLayoutUser";

export const Login = () => {
  return (
    <GlobalLayoutUser>
      <>
        <section
          className="section-hero overlay inner-page bg-image"
          style={{ backgroundImage: 'url("images/hero_1.jpg")' }}
          id="home-section"
        >
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">Sign Up/Login</h1>
                <div className="custom-breadcrumbs">
                  <a href="#">Home</a> <span className="mx-2 slash">/</span>
                  <span className="text-white">
                    <strong>Log In</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="site-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 mb-5">
                <h2 className="mb-4">Sign Up To JobBoard</h2>
                <form action="#" className="p-4 border rounded">
                  <div className="row form-group">
                    <div className="col-md-12 mb-3 mb-md-0">
                      <label className="text-black" htmlFor="fname">
                        Email
                      </label>
                      <input
                        type="text"
                        id="fname"
                        className="form-control"
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                  <div className="row form-group">
                    <div className="col-md-12 mb-3 mb-md-0">
                      <label className="text-black" htmlFor="fname">
                        Password
                      </label>
                      <input
                        type="password"
                        id="fname"
                        className="form-control"
                        placeholder="Password"
                      />
                    </div>
                  </div>
                  <div className="row form-group mb-4">
                    <div className="col-md-12 mb-3 mb-md-0">
                      <label className="text-black" htmlFor="fname">
                        Re-Type Password
                      </label>
                      <input
                        type="password"
                        id="fname"
                        className="form-control"
                        placeholder="Re-type Password"
                      />
                    </div>
                  </div>
                  <div className="row form-group">
                    <div className="col-md-12">
                      <input
                        type="submit"
                        defaultValue="Sign Up"
                        className="btn px-4 btn-primary text-white"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-lg-6">
                <h2 className="mb-4">Log In To JobBoard</h2>
                <form action="#" className="p-4 border rounded">
                  <div className="row form-group">
                    <div className="col-md-12 mb-3 mb-md-0">
                      <label className="text-black" htmlFor="fname">
                        Email
                      </label>
                      <input
                        type="text"
                        id="fname"
                        className="form-control"
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                  <div className="row form-group mb-4">
                    <div className="col-md-12 mb-3 mb-md-0">
                      <label className="text-black" htmlFor="fname">
                        Password
                      </label>
                      <input
                        type="password"
                        id="fname"
                        className="form-control"
                        placeholder="Password"
                      />
                    </div>
                  </div>
                  <div className="row form-group">
                    <div className="col-md-12">
                      <input
                        type="submit"
                        defaultValue="Log In"
                        className="btn px-4 btn-primary text-white"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </>
    </GlobalLayoutUser>
  );
};
