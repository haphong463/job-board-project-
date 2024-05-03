import React from "react";
import { NavLink } from "react-router-dom";

export const GlobalFooter = () => {
  return (
    <footer class="site-footer">
      <a href="#top" class="smoothscroll scroll-top">
        <span class="icon-keyboard_arrow_up"></span>
      </a>

      <div class="container">
        <div class="row mb-5">
          <div class="col-6 col-md-3 mb-4 mb-md-0">
            <h3>Search Trending</h3>
            <ul class="list-unstyled">
              <li>
                <NavLink href="#">Web Design</NavLink>
              </li>
              <li>
                <NavLink href="#">Graphic Design</NavLink>
              </li>
              <li>
                <NavLink href="#">Web Developers</NavLink>
              </li>
              <li>
                <NavLink href="#">Python</NavLink>
              </li>
              <li>
                <NavLink href="#">HTML5</NavLink>
              </li>
              <li>
                <NavLink href="#">CSS3</NavLink>
              </li>
            </ul>
          </div>
          <div class="col-6 col-md-3 mb-4 mb-md-0">
            <h3>Company</h3>
            <ul class="list-unstyled">
              <li>
                <NavLink href="#">About Us</NavLink>
              </li>
              <li>
                <NavLink href="#">Career</NavLink>
              </li>
              <li>
                <NavLink href="#">Blog</NavLink>
              </li>
              <li>
                <NavLink href="#">Resources</NavLink>
              </li>
            </ul>
          </div>
          <div class="col-6 col-md-3 mb-4 mb-md-0">
            <h3>Support</h3>
            <ul class="list-unstyled">
              <li>
                <NavLink href="#">Support</NavLink>
              </li>
              <li>
                <NavLink href="#">Privacy</NavLink>
              </li>
              <li>
                <NavLink href="#">Terms of Service</NavLink>
              </li>
            </ul>
          </div>
          <div class="col-6 col-md-3 mb-4 mb-md-0">
            <h3>Contact Us</h3>
            <div class="footer-social">
              <NavLink href="#">
                <span class="icon-facebook"></span>
              </NavLink>
              <NavLink href="#">
                <span class="icon-twitter"></span>
              </NavLink>
              <NavLink href="#">
                <span class="icon-instagram"></span>
              </NavLink>
              <NavLink href="#">
                <span class="icon-linkedin"></span>
              </NavLink>
            </div>
          </div>
        </div>

        <div class="row text-center">
          <div class="col-12">
            <p class="copyright">
              <small>
                Link back to Colorlib can't be removed. Template is licensed
                under CC BY 3.0. Copyright &copy;
                <script>document.write(new Date().getFullYear());</script> All
                rights reserved | This template is made with{" "}
                <i class="icon-heart text-danger" aria-hidden="true"></i> by{" "}
                <a href="https://colorlib.com" target="_blank" rel="noreferrer">
                  Colorlib
                </a>
                Link back to Colorlib can't be removed. Template is licensed
                under CC BY 3.0.{" "}
              </small>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
