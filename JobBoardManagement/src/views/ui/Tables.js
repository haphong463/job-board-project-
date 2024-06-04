import DataTable from "react-data-table-component";
import ProjectTables from "../../components/dashboard/ProjectTable";
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import Forms from "./Forms";
import { useEffect, useState } from "react";
import { getAllBlogs, deleteBlog } from "../../services/BlogService";

const Tables = () => {
  const [blogData, setBlogData] = useState([]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      console.log(">>> blogId: " + id);
      deleteBlog(id).then((response) => {
        if (response) {
          setBlogData(blogData.filter((blog) => blog.id !== id));
        }
      });
    }
  };

  const handleEdit = (id) => {
    history.push(`/edit-blog/${id}`);
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          {row.title}
        </div>
      ),
    },
    {
      name: "Image",
      selector: (row) => row.imageUrl,
      sortable: true,
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          <img
            src={row.imageUrl}
            alt={row.title}
            style={{ maxWidth: "100px" }}
          />
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            onClick={() => handleEdit(row.id)}
            style={{ marginRight: "10px" }}
            className="btn btn-info"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    getAllBlogs().then((data) => data && setBlogData(data));
  }, []);
  return (
    <Row>
      <Col lg="12">
        <Forms onSetBlogData={setBlogData} />
      </Col>
      <Col lg="12">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-card-text me-2"> </i>
            Blog List
          </CardTitle>
          <DataTable columns={columns} data={blogData} />
        </Card>
      </Col>
    </Row>
  );
};

export default Tables;
