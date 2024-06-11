export function BlogSideBar() {
  return (
    <div className="col-lg-4 sidebar pl-lg-5">
      <div className="sidebar-box">
        <form action="#" className="search-form">
          <div className="form-group">
            <span className="icon fa fa-search" />
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Type a keyword and hit enter"
            />
          </div>
        </form>
      </div>
      <div className="sidebar-box">
        <img
          src="../../../../assets/images/person_1.jpg"
          alt="Image placeholder"
          className="img-fluid mb-4 w-50 rounded-circle"
        />
        <h3>About The Author</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus
          itaque, autem necessitatibus voluptate quod mollitia delectus aut,
          sunt placeat nam vero culpa sapiente consectetur similique, inventore
          eos fugit cupiditate numquam!
        </p>
        <p>
          <a href="#" className="btn btn-primary btn-sm">
            Read More
          </a>
        </p>
      </div>
      <div className="sidebar-box">
        <div className="categories">
          <h3>Categories</h3>
          <li>
            <a href="#">
              Creatives <span>(12)</span>
            </a>
          </li>
          <li>
            <a href="#">
              News <span>(22)</span>
            </a>
          </li>
          <li>
            <a href="#">
              Design <span>(37)</span>
            </a>
          </li>
          <li>
            <a href="#">
              HTML <span>(42)</span>
            </a>
          </li>
          <li>
            <a href="#">
              Web Development <span>(14)</span>
            </a>
          </li>
        </div>
      </div>
      <div className="sidebar-box">
        <h3>Paragraph</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus
          itaque, autem necessitatibus voluptate quod mollitia delectus aut,
          sunt placeat nam vero culpa sapiente consectetur similique, inventore
          eos fugit cupiditate numquam!
        </p>
      </div>
    </div>
  );
}
