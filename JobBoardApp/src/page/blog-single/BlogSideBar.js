import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

export function BlogSideBar(props) {
  const categories = useSelector((state) => state.blogs.categories);
  const blogs = useSelector((state) => state.blogs.blogs);
  const author = useSelector((state) => state.blogs.author);
  console.log(">>>author: ", author);
  return (
    <div className="col-lg-4 sidebar pl-lg-5">
      <div className="sidebar-box">
        <img
          src="../../../../assets/images/person_1.jpg"
          alt="Image placeholder"
          className="img-fluid mb-4 w-50 rounded-circle"
        />
        <h3>
          {author?.firstName} {author?.lastName}
        </h3>
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
          {categories.slice(0, 5).map((category) => (
            <li key={category.id}>
              <NavLink to={`/blogs?type=${category.name}`}>
                {category.name} <span>{category.blogCount}</span>
              </NavLink>
            </li>
          ))}
        </div>
      </div>
      <div className="sidebar-box">
        <div className="categories">
          <h3>Related article</h3>
          {blogs.map((blog) => (
            <li key={blog.id}>
              <NavLink href="#">{blog.title}</NavLink>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}
